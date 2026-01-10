'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Get pending fees for a student
 */
export async function getStudentFees(studentId: string, termId?: string) {
    try {
        // If no term specified, get current term
        let targetTermId = termId;
        if (!targetTermId) {
            const currentTerm = await prisma.term.findFirst({
                where: { isCurrent: true, session: { isCurrent: true } }
            });
            targetTermId = currentTerm?.id;
        }

        if (!targetTermId) return { success: false, error: 'No active term found' };

        // Get student's class
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            select: { classId: true }
        });

        if (!student?.classId) return { success: false, error: 'Student not assigned to a class' };

        // fetch available fees for this term/class
        const fees = await prisma.fee.findMany({
            where: {
                termId: targetTermId,
                OR: [
                    { classId: null }, // Global fees
                    { classId: student.classId } // Class specific fees
                ]
            },
            include: {
                payments: {
                    where: { studentId }
                }
            }
        });

        // Calculate statuses
        const feesWithStatus = fees.map((fee: any) => {
            const payment = fee.payments[0];
            const amountPaid = payment?.amountPaid || 0;
            const remaining = fee.amount - amountPaid;

            return {
                ...fee,
                amountPaid,
                remaining,
                status: amountPaid >= fee.amount ? 'PAID' : amountPaid > 0 ? 'PARTIAL' : 'PENDING'
            };
        });

        return { success: true, data: feesWithStatus };
    } catch (error) {
        console.error('Failed to get fees:', error);
        return { success: false, error: 'Failed to retrieve fees' };
    }
}

/**
 * Pay a fee using Wallet
 */
export async function payFeeFromWallet(data: {
    walletId: string;
    studentId: string;
    feeId: string;
    amount: number;
}) {
    try {
        const fee = await prisma.fee.findUnique({ where: { id: data.feeId } });
        if (!fee) return { success: false, error: 'Fee not found' };

        // 1. Check wallet balance
        const wallet = await prisma.wallet.findUnique({ where: { id: data.walletId } });
        if (!wallet || wallet.balance < data.amount) {
            return { success: false, error: 'Insufficient wallet balance' };
        }

        const reference = `FEE-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

        // 2. Process transaction atomically
        await prisma.$transaction(async (tx: any) => {
            // Debit wallet
            await tx.wallet.update({
                where: { id: data.walletId },
                data: { balance: { decrement: data.amount } }
            });

            // Create transaction record
            const transaction = await tx.transaction.create({
                data: {
                    walletId: data.walletId,
                    amount: data.amount,
                    type: 'DEBIT',
                    reference,
                    status: 'SUCCESS',
                }
            });

            // Update/Create fee payment record
            const existingPayment = await tx.feePayment.findUnique({
                where: {
                    studentId_feeId: {
                        studentId: data.studentId,
                        feeId: data.feeId
                    }
                }
            });

            if (existingPayment) {
                await tx.feePayment.update({
                    where: { id: existingPayment.id },
                    data: {
                        amountPaid: { increment: data.amount },
                        status: (existingPayment.amountPaid + data.amount) >= fee.amount ? 'COMPLETED' : 'PARTIAL',
                        transactionId: transaction.id
                    }
                });
            } else {
                await tx.feePayment.create({
                    data: {
                        studentId: data.studentId,
                        feeId: data.feeId,
                        amountPaid: data.amount,
                        status: data.amount >= fee.amount ? 'COMPLETED' : 'PARTIAL',
                        transactionId: transaction.id
                    }
                });
            }
        });

        revalidatePath('/dashboard/parent/fees');
        revalidatePath('/dashboard/parent/wallet');
        return { success: true, reference };

    } catch (error) {
        console.error('Fee payment failed:', error);
        return { success: false, error: 'Payment processing failed' };
    }
}
