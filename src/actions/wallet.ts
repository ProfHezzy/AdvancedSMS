'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function getOrCreateWallet(parentId: string) {
    try {
        let wallet = await prisma.wallet.findUnique({
            where: { parentId },
            include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
        });

        if (!wallet) {
            // Generate mock 11-digit virtual account
            const virtualAccount = Math.floor(10000000000 + Math.random() * 90000000000).toString();

            wallet = await prisma.wallet.create({
                data: {
                    parentId,
                    balance: 0,
                    virtualAccount
                },
                include: { transactions: true }
            });
        }

        return wallet;
    } catch (error) {
        console.error('Failed to get/create wallet:', error);
        throw new Error('Failed to fetch wallet.');
    }
}

export async function fundWallet(walletId: string, amount: number) {
    try {
        const reference = `REF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

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
                    status: 'SUCCESS'
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

export async function getTransactions(walletId: string) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { walletId },
            orderBy: { createdAt: 'desc' }
        });
        return transactions;
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        throw new Error('Failed to fetch transaction history.');
    }
}
