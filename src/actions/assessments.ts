'use server';

import prisma from '@/lib/prisma';
// import { AssessmentType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createAssessment(data: {
    title: string;
    description?: string;
    type: any;
    subjectId: string;
    classId: string;
    teacherId: string; // userId from session
    dueDate?: Date;
    maxScore?: number;
}) {
    try {
        console.log('[createAssessment] Payload:', data);

        if (!data.teacherId) throw new Error("Authentication error: No User ID found");
        if (!data.subjectId) throw new Error("Subject is required");
        if (!data.classId) throw new Error("Class is required");

        // Validate maxScore
        const score = (data.maxScore !== undefined && !isNaN(data.maxScore)) ? data.maxScore : 100;

        // Validate dueDate
        const dueDate = (data.dueDate && !isNaN(data.dueDate.getTime())) ? data.dueDate : null;

        // Generate a secure 6-character token
        const token = crypto.randomBytes(3).toString('hex').toUpperCase();

        const assessment = await (prisma as any).assessment.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                token,
                maxScore: score,
                dueDate: dueDate,
                subject: { connect: { id: data.subjectId } },
                class: { connect: { id: data.classId } },
                teacher: { connect: { userId: data.teacherId } }
            }
        });

        console.log('[createAssessment] Success:', assessment.id);

        // Revalidate all relevant tracks
        const paths = [
            '/dashboard/assignments',
            '/dashboard/teacher/assignments',
            '/dashboard/teacher/exams',
            '/dashboard/teacher/tests',
            '/dashboard/student/assessments'
        ];
        paths.forEach(p => revalidatePath(p));

        return { success: true, data: assessment };
    } catch (error: any) {
        console.error('CRITICAL [createAssessment]:', error);

        if (error.code === 'P2025') {
            return { success: false, error: "Teacher profile not found for this user. Please contact Admin." };
        }

        return {
            success: false,
            error: error.message || 'Failed to create assessment.'
        };
    }
}

export async function getAssessmentsByTeacher(teacherId: string, type?: any) {
    try {
        const assessments = await (prisma as any).assessment.findMany({
            where: {
                teacher: {
                    userId: teacherId
                },
            },
            include: {
                subject: true,
                class: true,
                _count: {
                    select: { submissions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: assessments };
    } catch (error) {
        console.error('Failed to fetch assessments:', error);
        return { success: false, error: 'Failed to fetch assessments.' };
    }
}

export async function deleteAssessment(id: string) {
    try {
        await prisma.assessment.delete({ where: { id } });
        revalidatePath('/dashboard/assignments');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete assessment:', error);
        return { success: false, error: 'Failed to delete assessment.' };
    }
}
