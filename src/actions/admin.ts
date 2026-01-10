'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * User & Role Management
 */

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                studentProfile: true,
                teacherProfile: true,
                parentProfile: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users.' };
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: role as any }
        });
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update user role.' };
    }
}

/**
 * Institutional Settings
 */

interface SchoolSettings {
    schoolName: string;
    currentSession: string;
    currentTerm: string;
    logoUrl?: string;
    contactEmail: string;
}

const MOCK_SETTINGS: SchoolSettings = {
    schoolName: 'Advanced School Management System',
    currentSession: '2025/2026',
    currentTerm: 'Second Term',
    contactEmail: 'admin@asms.edu'
};

export async function getSchoolSettings() {
    return { success: true, data: MOCK_SETTINGS };
}

export async function updateSchoolSettings(data: SchoolSettings) {
    try {
        // Logic to update global config
        revalidatePath('/dashboard/admin/settings');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update settings.' };
    }
}

/**
 * Audit Logs
 */

export async function getAuditLogs() {
    try {
        // Mocking audit logs as they aren't in schema yet
        return {
            success: true,
            data: [
                { id: '1', action: 'ROLE_UPDATE', user: 'Admin', details: 'Updated user JS-001 to TEACHER', date: '2026-01-04T10:00:00Z' },
                { id: '2', action: 'SYSTEM_CONFIG', user: 'Admin', details: 'Changed current term to Second Term', date: '2026-01-04T09:30:00Z' },
            ]
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch audit logs.' };
    }
}

/**
 * Registries (Sessions, Classes, Subjects)
 */

export async function getSessions() {
    try {
        const sessions = await prisma.session.findMany({
            include: {
                terms: true
            },
            orderBy: { name: 'desc' }
        });
        return { success: true, data: sessions };
    } catch (error) {
        return { success: false, error: 'Failed to fetch sessions.' };
    }
}

export async function createSession(data: any) {
    try {
        await prisma.session.create({ data });
        revalidatePath('/dashboard/admin/sessions');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create session.' };
    }
}

export async function getClasses() {
    try {
        const classes = await prisma.class.findMany({
            include: {
                teacher: { include: { user: true } },
                _count: {
                    select: { students: true }
                }
            }
        });
        return { success: true, data: classes };
    } catch (error) {
        return { success: false, error: 'Failed to fetch classes.' };
    }
}

export async function createClass(data: any) {
    try {
        const createData = { ...data };
        if (createData.teacherId === 'none') delete createData.teacherId;

        await prisma.class.create({ data: createData });
        revalidatePath('/dashboard/admin/classes');
        return { success: true };
    } catch (error: any) {
        console.error('Create Class Error:', error);
        return { success: false, error: error.message || 'Failed to create class.' };
    }
}

export async function getTeachers() {
    try {
        const teachers = await prisma.teacherProfile.findMany({
            include: {
                user: true
            }
        });
        return { success: true, data: teachers };
    } catch (error) {
        return { success: false, error: 'Failed to fetch teachers.' };
    }
}

export async function getSubjects() {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                classes: true,
                teachers: { include: { user: true } },
                _count: {
                    select: {
                        classes: true,
                        teachers: true
                    }
                }
            }
        });
        return { success: true, data: subjects };
    } catch (error) {
        return { success: false, error: 'Failed to fetch subjects.' };
    }
}

export async function assignSubjectToClasses(subjectId: string, classIds: string[]) {
    try {
        await prisma.subject.update({
            where: { id: subjectId },
            data: {
                classes: {
                    set: classIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath('/dashboard/admin/subjects');
        return { success: true };
    } catch (error) {
        console.error('Assign Subjects Error:', error);
        return { success: false, error: 'Failed to assign subject to classes.' };
    }
}

export async function assignSubjectToTeachers(subjectId: string, teacherIds: string[]) {
    try {
        await prisma.subject.update({
            where: { id: subjectId },
            data: {
                teachers: {
                    set: teacherIds.map(id => ({ id }))
                }
            }
        });
        revalidatePath('/dashboard/admin/subjects');
        return { success: true };
    } catch (error) {
        console.error('Assign Teachers Error:', error);
        return { success: false, error: 'Failed to assign subject to teachers.' };
    }
}

export async function createSubject(data: any) {
    try {
        await prisma.subject.create({ data });
        revalidatePath('/dashboard/admin/subjects');
        return { success: true };
    } catch (error) {
        console.error('Create Subject Error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to create subject.' };
    }
}
