'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Rating } from '@prisma/client';

export interface RemarkInput {
    studentId: string;
    teacherId: string;
    termId: string;
    rating: Rating;
    observation: string;
    tags: string[];
}

/**
 * Fetch students that a teacher can remark on.
 * This includes students in classes where the teacher is a form teacher
 * or students in classes the teacher teaches subjects for.
 */
export async function getStudentsForTeacher(userId: string) {
    try {
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId },
            select: { id: true }
        });

        if (!teacherProfile) {
            return { success: false, error: 'Teacher profile not found.' };
        }

        // Find classes where teacher is the form teacher or taught subjects
        const classes = await prisma.class.findMany({
            where: {
                OR: [
                    { teacherId: teacherProfile.id },
                    { subjects: { some: { teachers: { some: { userId } } } } }
                ]
            },
            include: {
                students: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                username: true
                            }
                        }
                    }
                }
            }
        });

        // Flatten and unique students
        const studentsMap = new Map();
        classes.forEach(c => {
            c.students.forEach(s => {
                studentsMap.set(s.id, {
                    id: s.id,
                    name: s.user.name || s.user.username,
                    class: c.name
                });
            });
        });

        const students = Array.from(studentsMap.values());

        return { success: true, data: students };
    } catch (error) {
        console.error('Failed to fetch students for teacher:', error);
        return { success: false, error: 'Failed to retrieve students list.' };
    }
}

/**
 * Fetch a behavioral remark for a student and term.
 */
export async function getStudentRemark(studentId: string, termId: string) {
    try {
        const remark = await prisma.behavioralRemark.findUnique({
            where: {
                studentId_termId: {
                    studentId,
                    termId
                }
            }
        });

        return { success: true, data: remark };
    } catch (error) {
        console.error('Failed to fetch student remark:', error);
        return { success: false, error: 'Failed to retrieve remark.' };
    }
}

/**
 * Create or update a behavioral remark.
 */
export async function upsertBehavioralRemark(data: RemarkInput) {
    try {
        const remark = await prisma.behavioralRemark.upsert({
            where: {
                studentId_termId: {
                    studentId: data.studentId,
                    termId: data.termId
                }
            },
            update: {
                rating: data.rating,
                observation: data.observation,
                tags: data.tags,
                teacherId: data.teacherId
            },
            create: {
                studentId: data.studentId,
                termId: data.termId,
                teacherId: data.teacherId,
                rating: data.rating,
                observation: data.observation,
                tags: data.tags
            }
        });

        revalidatePath('/dashboard/teacher/remarks');
        revalidatePath('/dashboard/student/results');

        return { success: true, data: remark };
    } catch (error) {
        console.error('Failed to save behavioral remark:', error);
        return { success: false, error: 'Failed to save remark.' };
    }
}

/**
 * Get the current term.
 */
export async function getCurrentTerm() {
    try {
        const term = await prisma.term.findFirst({
            where: { isCurrent: true },
            include: { session: true }
        });
        return { success: true, data: term };
    } catch (error) {
        return { success: false, error: 'Failed to fetch current term.' };
    }
}
