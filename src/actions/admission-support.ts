'use server';

import prisma from '@/lib/prisma';

export async function getAdminClasses() {
    try {
        const classes = await prisma.class.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true }
        });
        return { success: true, data: classes };
    } catch (error) {
        console.error('Failed to fetch admin classes:', error);
        return { success: false, error: 'Failed to fetch classes.' };
    }
}

export async function getClassSessions() {
    try {
        const sessions = await prisma.session.findMany({
            orderBy: { name: 'desc' }
        });
        return { success: true, data: sessions };
    } catch (error) {
        console.error('getClassSessions error:', error);
        return { success: false, error: 'Failed to fetch sessions.' };
    }
}

export async function getRecentAdmissions(limit = 10) {
    try {
        const students = await (prisma.user as any).findMany({
            where: { role: 'STUDENT' },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                username: true,
                createdAt: true,
                studentProfile: {
                    include: {
                        class: true
                    }
                }
            }
        });

        return { success: true, data: students };
    } catch (error) {
        return { success: false, error: 'Failed to fetch recent admissions' };
    }
}
