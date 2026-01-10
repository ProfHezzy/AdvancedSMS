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

export async function getTerms() {
    try {
        const terms = await prisma.term.findMany({
            include: { session: true },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: terms };
    } catch (error) {
        console.error('getTerms error:', error);
        return { success: false, error: 'Failed to fetch terms.' };
    }
}

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
                teacher: {
                    userId: teacherId // renamed parameter internally but it's userId from session
                }
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

export async function getTeacherProfileByUserId(userId: string) {
    try {
        const profile = await prisma.teacherProfile.findUnique({
            where: { userId }
        });
        return { success: true, data: profile };
    } catch (error) {
        console.error('getTeacherProfileByUserId error:', error);
        return { success: false, error: 'Failed to fetch teacher profile.' };
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

export async function getParentProfile(userId: string) {
    try {
        const parent = await prisma.parentProfile.findUnique({
            where: { userId },
            include: {
                user: true,
                students: {
                    include: {
                        user: true,
                        class: true
                    }
                }
            }
        });
        return { success: true, data: parent };
    } catch (error) {
        console.error('Failed to fetch parent profile:', error);
        return { success: false, error: 'Failed to retrieve parent profile.' };
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

export async function getSchemesOfWork(teacherUserId: string) {
    try {
        const schemes = await (prisma as any).schemeOfWork.findMany({
            where: {
                teacher: { userId: teacherUserId }
            },
            include: {
                subject: true,
                term: true
            },
            orderBy: [
                { term: { name: 'desc' } },
                { week: 'asc' }
            ]
        });
        return { success: true, data: schemes };
    } catch (error) {
        console.error('getSchemesOfWork error:', error);
        return { success: false, error: 'Failed to fetch schemes of work.' };
    }
}

export async function upsertSchemeOfWork(data: {
    id?: string;
    subjectId: string;
    teacherId: string;
    termId: string;
    week: number;
    topic: string;
    objectives?: string;
    status: string;
}) {
    try {
        if (data.id) {
            await (prisma as any).schemeOfWork.update({
                where: { id: data.id },
                data: {
                    week: data.week,
                    topic: data.topic,
                    objectives: data.objectives,
                    status: data.status
                }
            });
        } else {
            await (prisma as any).schemeOfWork.create({
                data: {
                    subjectId: data.subjectId,
                    teacherId: data.teacherId,
                    termId: data.termId,
                    week: data.week,
                    topic: data.topic,
                    objectives: data.objectives,
                    status: data.status
                }
            });
        }
        revalidatePath('/dashboard/teacher/scheme-of-work');
        return { success: true };
    } catch (error) {
        console.error('upsertSchemeOfWork error:', error);
        return { success: false, error: 'Failed to save scheme of work.' };
    }
}
