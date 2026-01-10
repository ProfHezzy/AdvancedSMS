'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStudentAttendance(studentId: string) {
    try {
        const records = await prisma.attendance.findMany({
            where: { studentId },
            orderBy: { date: 'desc' }
        });

        // Calculate stats
        const total = records.length;
        const present = records.filter(r => r.status === 'PRESENT').length;
        const absent = records.filter(r => r.status === 'ABSENT').length;
        const late = records.filter(r => r.status === 'LATE').length;

        const rate = total > 0 ? ((present + late) / total * 100).toFixed(1) + '%' : '100%';

        return {
            success: true,
            data: {
                stats: { present, absent, late, total, rate },
                history: records
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch attendance.' };
    }
}

export async function getClassAttendance(classId: string, date: Date) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const records = await prisma.attendance.findMany({
            where: {
                student: { classId },
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: { student: { include: { user: true } } }
        });

        return { success: true, data: records };
    } catch (error) {
        return { success: false, error: 'Failed to fetch class attendance.' };
    }
}

export async function markAttendance(records: { studentId: string, status: string, date: Date }[]) {
    try {
        const results = [];
        for (const record of records) {
            const startOfDay = new Date(record.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(record.date);
            endOfDay.setHours(23, 59, 59, 999);

            const existing = await prisma.attendance.findFirst({
                where: {
                    studentId: record.studentId,
                    date: { gte: startOfDay, lte: endOfDay }
                }
            });

            if (existing) {
                results.push(await prisma.attendance.update({
                    where: { id: existing.id },
                    data: { status: record.status }
                }));
            } else {
                results.push(await prisma.attendance.create({
                    data: {
                        studentId: record.studentId,
                        date: record.date,
                        status: record.status
                    }
                }));
            }
        }

        revalidatePath('/dashboard/teacher/attendance');
        revalidatePath('/dashboard/parent/attendance');
        revalidatePath('/dashboard/student/attendance');

        return { success: true, count: results.length };
    } catch (error) {
        console.error("Mark Attendance Error", error);
        return { success: false, error: 'Failed to save attendance.' };
    }
}

// Teacher Helpers
export async function getTeacherClasses(teacherUserId: string) {
    try {
        const teacher = await prisma.teacherProfile.findUnique({
            where: { userId: teacherUserId },
            include: { classes: true }
        });

        if (!teacher) return { success: false, error: 'Teacher profile not found.' };

        return { success: true, data: teacher.classes };
    } catch (error) {
        return { success: false, error: 'Failed to fetch classes.' };
    }
}

export async function getClassStudents(classId: string) {
    try {
        const students = await prisma.studentProfile.findMany({
            where: { classId },
            include: { user: true },
            orderBy: { user: { name: 'asc' } }
        });

        return { success: true, data: students };
    } catch (error) {
        return { success: false, error: 'Failed to fetch students.' };
    }
}
