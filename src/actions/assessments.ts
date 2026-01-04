'use server';

import prisma from '@/lib/prisma';
import { AssessmentType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createAssessment(data: {
    title: string;
    description?: string;
    type: AssessmentType;
    subjectId: string;
    classId: string;
    teacherId: string;
    dueDate?: Date;
    maxScore?: number;
}) {
    try {
        // Generate a secure 6-character token
        const token = crypto.randomBytes(3).toString('hex').toUpperCase();

        const assessment = await prisma.assessment.create({
            data: {
                ...data,
                token,
            }
        });

        revalidatePath('/dashboard/assignments');
        return { success: true, assessment };
    } catch (error) {
        console.error('Failed to create assessment:', error);
        return { success: false, error: 'Failed to create assessment.' };
    }
}

export async function getAssessmentsByTeacher(teacherId: string, type?: AssessmentType) {
    try {
        const assessments = await prisma.assessment.findMany({
            where: {
                teacherId,
                ...(type && { type })
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
