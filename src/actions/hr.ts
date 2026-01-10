'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

/**
 * Staff Attendance
 */
export async function getStaffAttendanceList(date: Date) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: 'Unauthorized' };

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const staff = await prisma.staffProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                        image: true,
                        role: true
                    }
                },
                attendance: {
                    where: {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    }
                }
            } as any
        });

        // Ensure all staff have a profile if they are in staff roles
        if (staff.length === 0) {
            const staffUsers = await prisma.user.findMany({
                where: {
                    role: { in: ['TEACHER', 'HR', 'ADMIN', 'MEDICAL', 'SECURITY', 'ACCOUNTANT'] },
                    staffProfile: null
                }
            });

            if (staffUsers.length > 0) {
                await prisma.staffProfile.createMany({
                    data: staffUsers.map(u => ({
                        userId: u.id,
                        role: u.role
                    }))
                });
                // Re-fetch
                return getStaffAttendanceList(date);
            }
        }

        return { success: true, data: staff };
    } catch (error) {
        console.error('HR Action Error (getStaffAttendanceList):', error);
        return { success: false, error: 'Failed to fetch attendance' };
    }
}

export async function markStaffAttendance(records: { staffId: string, status: string, date: Date }[]) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: 'Unauthorized' };

        await prisma.$transaction(
            records.map(record => {
                const day = new Date(record.date);
                day.setHours(0, 0, 0, 0);

                return (prisma as any).staffAttendance.upsert({
                    where: {
                        staffId_date: {
                            staffId: record.staffId,
                            date: day
                        }
                    },
                    update: { status: record.status },
                    create: {
                        staffId: record.staffId,
                        date: day,
                        status: record.status
                    }
                });
            })
        );

        revalidatePath('/dashboard/hr/attendance');
        return { success: true };
    } catch (error) {
        console.error('HR Action Error (markStaffAttendance):', error);
        return { success: false, error: 'Failed to save attendance' };
    }
}

/**
 * Payroll Management
 */
export async function getSalaryStructures() {
    try {
        const structures = await (prisma as any).salaryStructure.findMany({
            include: {
            }
        });
        return { success: true, data: structures };
    } catch (error) {
        console.error('getSalaryStructures error:', error);
        return { success: false, error: 'Failed to fetch salary structures' };
    }
}

export async function upsertSalaryStructure(data: { staffId: string, baseSalary: number, allowances: number, deductions: number }) {
    try {
        await prisma.salaryStructure.upsert({
            where: { staffId: data.staffId },
            update: {
                baseSalary: data.baseSalary,
                allowances: data.allowances,
                deductions: data.deductions
            },
            create: {
                staffId: data.staffId,
                baseSalary: data.baseSalary,
                allowances: data.allowances,
                deductions: data.deductions
            }
        });
        revalidatePath('/dashboard/hr/payroll/structure');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to save salary structure' };
    }
}

export async function generateMonthlyPayroll(month: number, year: number) {
    try {
        const staffWithStructure = await prisma.staffProfile.findMany({
            include: { salaryStructure: true } as any
        });

        const payrollEntries = staffWithStructure
            .filter((s: any) => s.salaryStructure)
            .map((s: any) => {
                const struct = s.salaryStructure!;
                const netSalary = struct.baseSalary + struct.allowances - struct.deductions;
                return {
                    staffId: s.id,
                    month,
                    year,
                    baseSalary: struct.baseSalary,
                    allowances: struct.allowances,
                    deductions: struct.deductions,
                    netSalary,
                    status: 'PENDING'
                };
            });

        await prisma.$transaction(
            payrollEntries.map(entry =>
                (prisma as any).payroll.upsert({
                    where: {
                        staffId_month_year: {
                            staffId: entry.staffId,
                            month: entry.month,
                            year: entry.year
                        }
                    },
                    update: {
                        baseSalary: entry.baseSalary,
                        allowances: entry.allowances,
                        deductions: entry.deductions,
                        netSalary: entry.netSalary
                    },
                    create: {
                        ...entry,
                        status: entry.status as any
                    }
                })
            )
        );

        revalidatePath('/dashboard/hr/payroll/salaries');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to generate payroll' };
    }
}

/**
 * Leave Management
 */
export async function getLeaveRequests() {
    try {
        const requests = await (prisma as any).leaveRequest.findMany({
            include: {
                staff: {
                    include: {
                        user: true
                    }
                }
            } as any,
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: requests };
    } catch (error) {
        return { success: false, error: 'Failed to fetch leave requests' };
    }
}

export async function updateLeaveStatus(requestId: string, status: 'APPROVED' | 'REJECTED') {
    try {
        await (prisma as any).leaveRequest.update({
            where: { id: requestId },
            data: { status }
        });
        revalidatePath('/dashboard/hr/approvals');
        revalidatePath('/dashboard/hr/leave');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update leave status' };
    }
}
