'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PaymentStatus } from '@prisma/client';

export async function getFees() {
    try {
        const fees = await prisma.fee.findMany({
            include: {
                term: true,
                class: true,
                _count: {
                    select: { payments: true }
                }
            }
        });
        return { success: true, data: fees };
    } catch (error) {
        return { success: false, error: 'Failed to fetch fees.' };
    }
}

export async function createFee(data: {
    title: string;
    description?: string;
    amount: number;
    termId: string;
    classId?: string;
    mandatory?: boolean;
    dueDate?: Date;
}) {
    try {
        const fee = await prisma.fee.create({
            data: {
                ...data,
                mandatory: data.mandatory ?? true
            }
        });
        revalidatePath('/dashboard/admin/finance');
        return { success: true, data: fee };
    } catch (error) {
        console.error('Create Fee Error:', error);
        return { success: false, error: 'Failed to create fee.' };
    }
}

export async function getStudentInvoices(studentId: string) {
    try {
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: { class: true }
        });

        if (!student) return { success: false, error: 'Student not found.' };

        // Fetch fees applicable to this student (either class-specific or mandatory term fees)
        const fees = await prisma.fee.findMany({
            where: {
                OR: [
                    { classId: student.classId },
                    { classId: null, mandatory: true }
                ]
            },
            include: {
                payments: {
                    where: { studentId }
                }
            }
        });

        const invoices = fees.map(fee => {
            const payment = fee.payments[0];
            const amountPaid = payment?.amountPaid || 0;
            const balance = fee.amount - amountPaid;

            let status = 'PENDING';
            if (amountPaid >= fee.amount) status = 'PAID';
            else if (amountPaid > 0) status = 'PARTIAL';
            else if (fee.dueDate && new Date(fee.dueDate) < new Date()) status = 'OVERDUE';

            return {
                id: fee.id,
                description: fee.title,
                amount: fee.amount,
                amountPaid,
                balance,
                dueDate: fee.dueDate,
                status,
                feeId: fee.id
            };
        });

        return { success: true, data: invoices };
    } catch (error) {
        console.error('Fetch Invoices Error:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function recordPayment(data: {
    studentId: string;
    feeId: string;
    amount: number;
    transactionId?: string;
}) {
    try {
        const payment = await prisma.feePayment.upsert({
            where: {
                studentId_feeId: {
                    studentId: data.studentId,
                    feeId: data.feeId
                }
            },
            update: {
                amountPaid: { increment: data.amount },
                status: 'COMPLETED', // Simplified for now
                transactionId: data.transactionId
            },
            create: {
                studentId: data.studentId,
                feeId: data.feeId,
                amountPaid: data.amount,
                status: 'COMPLETED',
                transactionId: data.transactionId
            }
        });

        revalidatePath('/dashboard/parent/invoices');
        return { success: true, data: payment };
    } catch (error) {
        return { success: false, error: 'Failed to record payment.' };
    }
}
