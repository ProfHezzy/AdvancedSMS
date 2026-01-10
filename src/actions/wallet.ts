'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { createDedicatedVirtualAccount, verifyPayment } from '@/lib/paystack-service';

/**
 * Get or create wallet for parent with virtual account
 */
export async function getOrCreateWallet(parentId: string) {
    try {
        let wallet = await prisma.wallet.findUnique({
            where: { parentId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                parent: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!wallet) {
            // Get parent details for virtual account
            const parent = await prisma.parentProfile.findUnique({
                where: { id: parentId },
                include: { user: true }
            });

            if (!parent) {
                throw new Error('Parent profile not found');
            }

            // Create virtual account via Paystack
            const virtualAccountResult = await createDedicatedVirtualAccount({
                email: parent.user.email || `parent${parentId}@school.com`,
                firstName: parent.user.name?.split(' ')[0] || 'Parent',
                lastName: parent.user.name?.split(' ').slice(1).join(' ') || 'User',
            });

            wallet = await prisma.wallet.create({
                data: {
                    parentId,
                    balance: 0,
                    virtualAccount: virtualAccountResult.data?.account_number,
                },
                include: {
                    transactions: true,
                    parent: {
                        include: { user: true }
                    }
                }
            });
        }

        return { success: true, data: wallet };
    } catch (error) {
        console.error('Failed to get/create wallet:', error);
        return { success: false, error: 'Failed to fetch wallet.' };
    }
}

/**
 * Initialize payment for wallet funding
 */
export async function initializeWalletFunding(data: {
    walletId: string;
    amount: number;
    email: string;
}) {
    try {
        const reference = `FUND-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

        // Create pending transaction
        await prisma.transaction.create({
            data: {
                walletId: data.walletId,
                amount: data.amount,
                type: 'CREDIT',
                reference,
                status: 'PENDING',
            }
        });

        return {
            success: true,
            reference,
            message: 'Transfer to your virtual account to fund wallet'
        };
    } catch (error) {
        console.error('Failed to initialize funding:', error);
        return { success: false, error: 'Failed to initialize funding.' };
    }
}

/**
 * Verify and credit wallet after payment
 */
export async function verifyAndCreditWallet(reference: string) {
    try {
        // Get transaction
        const transaction = await prisma.transaction.findUnique({
            where: { reference },
            include: { wallet: true }
        });

        if (!transaction) {
            return { success: false, error: 'Transaction not found' };
        }

        if (transaction.status === 'SUCCESS') {
            return { success: true, message: 'Transaction already processed' };
        }

        // Verify with Paystack
        const verification = await verifyPayment(reference);

        if (verification.success && verification.data) {
            // Update wallet and transaction
            await prisma.$transaction([
                prisma.wallet.update({
                    where: { id: transaction.walletId },
                    data: { balance: { increment: transaction.amount } }
                }),
                prisma.transaction.update({
                    where: { reference },
                    data: { status: 'SUCCESS' }
                })
            ]);

            revalidatePath('/dashboard/parent/wallet');
            return { success: true, amount: transaction.amount };
        } else {
            // Mark as failed
            await prisma.transaction.update({
                where: { reference },
                data: { status: 'FAILED' }
            });

            return { success: false, error: 'Payment verification failed' };
        }
    } catch (error) {
        console.error('Failed to verify payment:', error);
        return { success: false, error: 'Failed to verify payment.' };
    }
}

/**
 * Manual wallet funding (for testing/admin)
 */
export async function fundWalletManually(walletId: string, amount: number) {
    try {
        const reference = `MANUAL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: walletId },
                data: { balance: { increment: amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId,
                    amount,
                    type: 'CREDIT',
                    reference,
                    status: 'SUCCESS',
                }
            })
        ]);

        revalidatePath('/dashboard/parent/wallet');
        return { success: true, reference };
    } catch (error) {
        console.error('Failed to fund wallet:', error);
        return { success: false, error: 'Failed to process funding.' };
    }
}

/**
 * Debit wallet for fee payment
 */
export async function debitWallet(data: {
    walletId: string;
    amount: number;
    description: string;
}) {
    try {
        // Check balance
        const wallet = await prisma.wallet.findUnique({
            where: { id: data.walletId }
        });

        if (!wallet) {
            return { success: false, error: 'Wallet not found' };
        }

        if (wallet.balance < data.amount) {
            return { success: false, error: 'Insufficient balance' };
        }

        const reference = `PAY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: data.walletId },
                data: { balance: { decrement: data.amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: data.walletId,
                    amount: data.amount,
                    type: 'DEBIT',
                    reference,
                    status: 'SUCCESS',
                }
            })
        ]);

        revalidatePath('/dashboard/parent/wallet');
        return { success: true, reference };
    } catch (error) {
        console.error('Failed to debit wallet:', error);
        return { success: false, error: 'Failed to process payment.' };
    }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(walletId: string) {
    try {
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
            select: { balance: true }
        });

        if (!wallet) {
            return { success: false, error: 'Wallet not found' };
        }

        return { success: true, balance: wallet.balance };
    } catch (error) {
        console.error('Failed to get balance:', error);
        return { success: false, error: 'Failed to fetch balance.' };
    }
}

/**
 * Get transaction history
 */
export async function getTransactions(walletId: string, limit: number = 50) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { walletId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return { success: true, data: transactions };
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return { success: false, error: 'Failed to fetch transaction history.' };
    }
}
