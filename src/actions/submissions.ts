'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitAssessment(data: {
    studentId: string;
    token: string;
    content: string;
}) {
    try {
        // Find assessment by token
        const assessment = await prisma.assessment.findUnique({
            where: { token: data.token }
        });

        if (!assessment) {
            return { success: false, error: 'Invalid or expired token.' };
        }

        // Check if already submitted
        const existing = await prisma.submission.findUnique({
            where: {
                assessmentId_studentId: {
                    assessmentId: assessment.id,
                    studentId: data.studentId
                }
            }
        });

        if (existing) {
            return { success: false, error: 'You have already submitted this assessment.' };
        }

        // Create submission
        await prisma.submission.create({
            data: {
                assessmentId: assessment.id,
                studentId: data.studentId,
                content: data.content,
                status: 'PENDING'
            }
        });

        revalidatePath('/dashboard/student/assessments');
        return { success: true };
    } catch (error) {
        console.error('Failed to submit assessment:', error);
        return { success: false, error: 'Failed to submit. Please try again.' };
    }
}
