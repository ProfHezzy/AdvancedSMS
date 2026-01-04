'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Attendance Actions
 */

export async function markAttendance(data: {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    date: Date;
}) {
    try {
        const attendance = await prisma.attendance.create({
            data: {
                studentId: data.studentId,
                status: data.status,
                date: data.date,
            }
        });

        revalidatePath('/dashboard/teacher/attendance');
        return { success: true, data: attendance };
    } catch (error) {
        console.error('Failed to mark attendance:', error);
        return { success: false, error: 'Failed to record attendance.' };
    }
}

export async function getClassAttendance(classId: string, date: Date) {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await prisma.attendance.findMany({
            where: {
                student: {
                    classId: classId
                },
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                student: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return { success: true, data: attendance };
    } catch (error) {
        console.error('Failed to fetch class attendance:', error);
        return { success: false, error: 'Failed to retrieve attendance records.' };
    }
}

/**
 * Timetable Actions
 */

export async function getTimetable(classId: string) {
    try {
        const timetable = await prisma.timetableEntry.findMany({
            where: { classId },
            include: {
                subject: true,
                class: true
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });

        return { success: true, data: timetable };
    } catch (error) {
        console.error('Failed to fetch timetable:', error);
        return { success: false, error: 'Failed to retrieve timetable.' };
    }
}

export async function getTeacherSchedule(userId: string) {
    try {
        const schedule = await prisma.timetableEntry.findMany({
            where: {
                subject: {
                    teachers: {
                        some: { userId }
                    }
                }
            },
            include: {
                subject: true,
                class: true
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });

        return { success: true, data: schedule };
    } catch (error) {
        console.error('Failed to fetch teacher schedule:', error);
        return { success: false, error: 'Failed to retrieve schedule.' };
    }
}

/**
 * Class Management
 */

export async function getClassList(classId: string) {
    try {
        const students = await prisma.studentProfile.findMany({
            where: { classId },
            include: {
                user: true
            }
        });

        return { success: true, data: students };
    } catch (error) {
        console.error('Failed to fetch class list:', error);
        return { success: false, error: 'Failed to retrieve class list.' };
    }
}

export async function getTeacherClasses(teacherId: string) {
    try {
        const classes = await prisma.class.findMany({
            where: {
                teacherId: teacherId
            }
        });
        return { success: true, data: classes };
    } catch (error) {
        console.error('Failed to fetch teacher classes:', error);
        return { success: false, error: 'Failed to retrieve classes.' };
    }
}

export async function getTeacherSubjects(userId: string) {
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                teachers: {
                    some: { userId }
                }
            },
            include: {
                classes: true
            }
        });
        return { success: true, data: subjects };
    } catch (error) {
        console.error('Failed to fetch teacher subjects:', error);
        return { success: false, error: 'Failed to retrieve subjects.' };
    }
}

export async function getStudentProfile(userId: string) {
    try {
        const student = await prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                class: true,
                user: true
            }
        });
        return { success: true, data: student };
    } catch (error) {
        console.error('Failed to fetch student profile:', error);
        return { success: false, error: 'Failed to retrieve profile.' };
    }
}

export async function getStudentTimetable(classId: string) {
    return getTimetable(classId);
}

export async function getStudentAssignments(studentId: string) {
    try {
        const assignments = await prisma.assessment.findMany({
            where: {
                submissions: {
                    some: { studentId }
                }
            },
            include: {
                subject: true,
                submissions: {
                    where: { studentId }
                }
            },
            orderBy: { dueDate: 'desc' }
        });
        return { success: true, data: assignments };
    } catch (error) {
        console.error('Failed to fetch student assignments:', error);
        return { success: false, error: 'Failed to retrieve assignments.' };
    }
}

/**
 * Behavior & Remarks
 */

export async function getStudentRemarks(classId: string) {
    try {
        // Mocking behavior remarks
        return {
            success: true,
            data: [
                { id: '1', studentName: 'Alice Johnson', conduct: 'EXCELLENT', remark: 'Diligent student with exceptional leadership qualities.', date: '2026-01-02' },
                { id: '2', studentName: 'Bob Smith', conduct: 'GOOD', remark: 'Showing great improvement in mathematics.', date: '2026-01-03' },
            ]
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch remarks.' };
    }
}

export async function submitRemark(data: any) {
    try {
        // Logic to save to DB
        revalidatePath('/dashboard/teacher/remarks');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to save remark.' };
    }
}

/**
 * Scheme of Work
 */

export async function getSchemesOfWork(teacherId: string) {
    try {
        // Mocking schemes
        return {
            success: true,
            data: [
                { id: '1', subject: 'Mathematics', term: '2nd Term', week: 1, topic: 'Algebraic Expressions', status: 'COMPLETED' },
                { id: '2', subject: 'Mathematics', term: '2nd Term', week: 2, topic: 'Quadratic Equations', status: 'IN-PROGRESS' },
            ]
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch schemes.' };
    }
}
