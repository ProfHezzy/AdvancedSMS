'use server';

import { QuestionType } from '../../prisma/generated-client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAssessmentQuestions(assessmentId: string) {
    try {
        if (!(prisma as any).question) {
            console.error('CRITICAL: Question model missing. Keys:', Object.keys(prisma).filter(k => k[0] !== '$'));
            return { success: false, error: 'Database model synchronization in progress. Please refresh in a moment.' };
        }
        const questions = await (prisma as any).question.findMany({
            where: { assessmentId },
            orderBy: { createdAt: 'asc' }
        });
        return { success: true, data: questions };
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        return { success: false, error: 'Failed to retrieve questions.' };
    }
}

export async function createQuestion(data: {
    assessmentId: string;
    text: string;
    type: any;
    options?: string[];
    correctAnswer?: string;
    points?: number;
}) {
    try {
        console.log('[createQuestion] Payload:', JSON.stringify(data, null, 2));
        console.log('[createQuestion] Prisma Models:', Object.keys(prisma).filter(k => k[0] !== '$'));

        if (!data.assessmentId) throw new Error("Assessment ID is required.");
        if (!data.text) throw new Error("Question text is required.");

        if (!(prisma as any).question) {
            throw new Error(`CRITICAL: 'question' model missing in prisma client. Models found: ${Object.keys(prisma).filter(k => k[0] !== '$').join(', ')}`);
        }

        const question = await (prisma as any).question.create({
            data: {
                assessmentId: data.assessmentId,
                text: data.text,
                type: data.type,
                options: data.options || [],
                correctAnswer: data.correctAnswer,
                points: data.points || 1.0
            }
        });

        console.log('[createQuestion] Success:', question.id);
        revalidatePath(`/dashboard/teacher/assessments/${data.assessmentId}/questions`);
        return { success: true, data: question };
    } catch (error: any) {
        console.error('CRITICAL [createQuestion]:', error);
        return {
            success: false,
            error: error.message || 'Failed to create question. Please check if the assessment still exists.'
        };
    }
}

export async function updateQuestion(id: string, data: any) {
    try {
        const question = await prisma.question.update({
            where: { id },
            data
        });

        revalidatePath(`/dashboard/teacher/assessments/${question.assessmentId}/questions`);
        return { success: true, data: question };
    } catch (error) {
        console.error('Failed to update question:', error);
        return { success: false, error: 'Failed to update question.' };
    }
}

export async function deleteQuestion(id: string) {
    try {
        const question = await prisma.question.delete({
            where: { id }
        });

        revalidatePath(`/dashboard/teacher/assessments/${question.assessmentId}/questions`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete question:', error);
        return { success: false, error: 'Failed to delete question.' };
    }
}

export async function importQuestions(assessmentId: string, questions: any[]) {
    try {
        // Use a transaction for bulk import
        const createdQuestions = await prisma.$transaction(
            questions.map(q => prisma.question.create({
                data: {
                    assessmentId,
                    text: q.text,
                    type: q.type || 'MULTIPLE_CHOICE',
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    points: q.points || 1.0
                }
            }))
        );

        revalidatePath(`/dashboard/teacher/assessments/${assessmentId}/questions`);
        return { success: true, count: createdQuestions.length };
    } catch (error) {
        console.error('Bulk import failed:', error);
        return { success: false, error: 'Bulk import failed. Please check your data format.' };
    }
}
