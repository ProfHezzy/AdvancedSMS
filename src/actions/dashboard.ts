'use server';

import prisma from '@/lib/prisma';

export async function getParentDashboardStats(userId: string) {
    try {
        // 1. Resolve ParentProfile ID from User ID
        const parentProfile = await prisma.parentProfile.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!parentProfile) {
            return { success: false, error: 'Parent profile not found' };
        }

        const parentId = parentProfile.id;

        // Parallel fetching for performance
        const [wallet, fees, studentsCount, transactions] = await Promise.all([
            // 2. Get Wallet Balance
            prisma.wallet.findUnique({
                where: { parentId },
                select: { balance: true }
            }),

            // 2. Get Pending Fees (Count and Amount)
            prisma.feePayment.findMany({
                where: {
                    student: { parentId },
                    status: { in: ['PENDING', 'PARTIAL'] }
                },
                include: {
                    fee: true
                }
            }),

            // 3. Get Wards Count
            prisma.studentProfile.count({
                where: { parentId }
            }),

            // 4. Get Recent Transactions
            prisma.transaction.findMany({
                where: { wallet: { parentId } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    wallet: false // Don't need wallet details
                }
            })
        ]);

        // Calculate total pending amount
        let pendingAmount = 0;
        let pendingCount = 0;

        fees.forEach((payment: any) => {
            const amountPaid = payment.amountPaid || 0;
            const feeAmount = payment.fee.amount;
            if (amountPaid < feeAmount) {
                pendingAmount += (feeAmount - amountPaid);
                pendingCount++;
            }
        });

        // Format transactions
        const formattedTransactions = transactions.map((tx: any) => ({
            id: tx.id,
            title: tx.type === 'CREDIT' ? 'Wallet Funding' : 'Fee Payment', // infer title from type/ref
            amount: `${tx.type === 'CREDIT' ? '+' : '-'}₦${tx.amount.toLocaleString()}`,
            date: tx.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            type: tx.type.toLowerCase(),
            status: tx.status
        }));

        return {
            success: true,
            data: {
                balance: wallet?.balance || 0,
                pendingFeesCount: pendingCount,
                pendingFeesAmount: pendingAmount,
                wardsCount: studentsCount,
                unreadAlerts: 0,
                recentTransactions: formattedTransactions
            }
        };

    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        return {
            success: false,
            error: 'Failed to load dashboard statistics'
        };
    }
}

export async function getTeacherDashboardStats(userId: string) {
    try {
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId },
            include: {
                classes: {
                    include: {
                        students: true
                    }
                },
                subjects: true
            }
        });

        if (!teacherProfile) {
            return { success: false, error: 'Teacher profile not found' };
        }

        const stats = {
            studentCount: teacherProfile.classes.reduce((acc, cls) => acc + cls.students.length, 0),
            subjectCount: teacherProfile.subjects.length,
            pendingGradings: 0, // Mock for now until Assignment model is ready for counting
            attendanceRate: 94 // Mock for now
        };

        return { success: true, data: stats };
    } catch (error) {
        return { success: false, error: 'Failed to fetch teacher stats' };
    }
}

export async function getStudentDashboardStats(userId: string) {
    try {
        const studentProfile = await prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                class: true
            }
        });

        if (!studentProfile) {
            return { success: false, error: 'Student profile not found' };
        }

        const stats = {
            gpa: 3.8, // Mock for now
            attendanceRate: 98, // Mock for now
            assignmentCount: 0,
            subjectCount: studentProfile.classId ? await prisma.subject.count({
                where: { classes: { some: { id: studentProfile.classId } } }
            }) : 0
        };

        return { success: true, data: stats };
    } catch (error) {
        return { success: false, error: 'Failed to fetch student stats' };
    }
}

export async function getAdminDashboardStats() {
    try {
        const [studentCount, teacherCount, classCount, feeCollectionRate] = await Promise.all([
            prisma.studentProfile.count(),
            prisma.teacherProfile.count(),
            prisma.class.count(),
            Promise.resolve(84.2) // Mock for now
        ]);

        const stats = {
            institutionalSize: studentCount,
            staffCount: teacherCount,
            financialHealth: feeCollectionRate,
            activeIncidents: 0
        };

        return { success: true, data: stats };
    } catch (error) {
        return { success: false, error: 'Failed to fetch admin stats' };
    }
}
