'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Staff Management
 */

export async function getStaffList(role?: 'HR' | 'TEACHER' | 'ADMIN' | 'MEDICAL' | 'SECURITY') {
    try {
        const staff = await prisma.user.findMany({
            where: role ? { role } : {
                NOT: { role: 'STUDENT' }
            },
            include: {
                teacherProfile: true,
                // Add other profiles as they are defined
            }
        });
        return { success: true, data: staff };
    } catch (error) {
        console.error('Failed to fetch staff:', error);
        return { success: false, error: 'Failed to retrieve staff list.' };
    }
}

export async function getStaffDetails(userId: string) {
    try {
        const staff = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                teacherProfile: true,
                wallet: true
            }
        });
        return { success: true, data: staff };
    } catch (error) {
        return { success: false, error: 'Failed to fetch staff details.' };
    }
}

/**
 * Payroll Management
 */

interface PayrollItem {
    id: string;
    staffId: string;
    staffName: string;
    role: string;
    baseSalary: number;
    bonus: number;
    deduction: number;
    netPay: number;
    status: 'PENDING' | 'PAID';
    date: string;
}

// Mock implementation as Prisma schema doesn't have Payroll model yet
const MOCK_PAYROLL: PayrollItem[] = [
    { id: '1', staffId: 'u1', staffName: 'Dr. Sarah Wilson', role: 'TEACHER', baseSalary: 4500, bonus: 200, deduction: 50, netPay: 4650, status: 'PAID', date: '2025-12-28' },
    { id: '2', staffId: 'u2', staffName: 'James Miller', role: 'HR', baseSalary: 3800, bonus: 0, deduction: 100, netPay: 3700, status: 'PENDING', date: '2026-01-28' },
];

export async function getPayrollHistory() {
    // In a real app, this would query a Payroll model
    return { success: true, data: MOCK_PAYROLL };
}

export async function generatePayroll(month: string, year: string) {
    try {
        // Logic to calculate payroll for all staff
        // 1. Fetch all staff with salary info
        // 2. Create Payroll entries
        // 3. Update staff wallets (optional or internal ledger)

        revalidatePath('/dashboard/hr/payroll');
        return { success: true, message: `Payroll for ${month} ${year} generated.` };
    } catch (error) {
        return { success: false, error: 'Failed to generate payroll.' };
    }
}

/**
 * Attendance & Leave
 */

export async function getStaffAttendance(date: string) {
    // Logic for staff attendance
    return { success: true, data: [] };
}

export async function requestLeave(data: { staffId: string, type: string, start: Date, end: Date, reason: string }) {
    try {
        // Create LeaveRequest entry
        revalidatePath('/dashboard/hr/leave');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to submit leave request.' };
    }
}
