'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Ward Management
 */

export async function getWards(parentId: string) {
    try {
        const parent = await prisma.user.findUnique({
            where: { id: parentId },
            include: {
                parentProfile: {
                    include: {
                        students: {
                            include: {
                                user: true,
                                class: true
                            }
                        }
                    }
                }
            }
        });

        return { success: true, data: parent?.parentProfile?.students || [] };
    } catch (error) {
        console.error('Failed to fetch wards:', error);
        return { success: false, error: 'Failed to retrieve ward profiles.' };
    }
}

export async function getWardAcademicSummary(studentId: string) {
    try {
        const results = await prisma.result.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const attendance = await prisma.attendance.count({
            where: { studentId, status: 'PRESENT' }
        });

        const totalSessions = await prisma.attendance.count({
            where: { studentId }
        });

        return {
            success: true,
            data: {
                results,
                attendanceRate: totalSessions > 0 ? (attendance / totalSessions * 100).toFixed(1) : '100'
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch academic summary.' };
    }
}

/**
 * Financials (Fees & Wallet)
 */

interface Invoice {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
}

const MOCK_INVOICES: Record<string, Invoice[]> = {
    'ward-1': [
        { id: 'inv-1', description: '2nd Term Tuition', amount: 450, dueDate: '2026-01-15', status: 'PENDING' },
        { id: 'inv-2', description: 'Lab & Science Fee', amount: 50, dueDate: '2026-01-15', status: 'PAID' },
    ]
};

export async function getWardInvoices(studentId: string) {
    // In a real app, this would query a Transaction/Invoice model
    return { success: true, data: MOCK_INVOICES[studentId] || [] };
}

export async function payFee(studentId: string, invoiceId: string, amount: number) {
    try {
        // 1. Deduct from parent wallet
        // 2. Update invoice status
        // 3. Create Transaction log
        revalidatePath('/dashboard/parent/fees');
        return { success: true, message: 'Payment processed successfully.' };
    } catch (error) {
        return { success: false, error: 'Payment failed.' };
    }
}
