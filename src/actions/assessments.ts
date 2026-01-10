'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { generateAssessmentToken } from '@/lib/token-generator';

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

        // Generate a secure token using our utility
        const token = generateAssessmentToken(data.type);

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

/**
 * Validate assessment token
 */
export async function validateAssessmentToken(token: string) {
    try {
        const assessment = await prisma.assessment.findUnique({
            where: { token },
            include: {
                subject: true,
                class: true,
                teacher: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!assessment) {
            return { success: false, error: 'Invalid token' };
        }

        // Check if assessment is past due date
        if (assessment.dueDate && new Date() > assessment.dueDate) {
            return { success: false, error: 'This assessment has expired' };
        }

        return { success: true, data: assessment };
    } catch (error) {
        console.error('Failed to validate token:', error);
        return { success: false, error: 'Token validation failed' };
    }
}

/**
 * Get assessment by token (for students)
 */
export async function getAssessmentByToken(token: string, studentId: string) {
    try {
        const assessment = await prisma.assessment.findUnique({
            where: { token },
            include: {
                subject: true,
                class: true,
                questions: {
                    orderBy: { createdAt: 'asc' }
                },
                submissions: {
                    where: { studentId }
                }
            }
        });

        if (!assessment) {
            return { success: false, error: 'Assessment not found' };
        }

        // Check if student already submitted
        if (assessment.submissions.length > 0) {
            return { success: false, error: 'You have already submitted this assessment' };
        }

        return { success: true, data: assessment };
    } catch (error) {
        console.error('Failed to fetch assessment:', error);
        return { success: false, error: 'Failed to load assessment' };
    }
}

/**
 * Get assessment details (for teachers)
 */
export async function getAssessmentDetails(id: string) {
    try {
        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: {
                subject: true,
                class: true,
                teacher: {
                    include: { user: true }
                },
                questions: {
                    orderBy: { createdAt: 'asc' }
                },
                submissions: {
                    include: {
                        student: {
                            include: { user: true }
                        }
                    }
                },
                _count: {
                    select: { submissions: true, questions: true }
                }
            }
        });

        if (!assessment) {
            return { success: false, error: 'Assessment not found' };
        }

        return { success: true, data: assessment };
    } catch (error) {
        console.error('Failed to fetch assessment details:', error);
        return { success: false, error: 'Failed to load assessment details' };
    }
}

/**
 * Grade a student submission
 */
export async function gradeSubmission(data: {
    submissionId: string;
    score: number;
    feedback?: string;
    graderId: string; // userId from session
}) {
    try {
        const submission = await prisma.submission.update({
            where: { id: data.submissionId },
            data: {
                score: data.score,
                status: 'GRADED',
                gradedBy: {
                    connect: {
                        userId: data.graderId
                    }
                }
            }
        });

        // Revalidate submission related paths
        revalidatePath('/dashboard/teacher/assignments');
        revalidatePath(`/dashboard/teacher/assignments/${submission.assessmentId}/submissions`);

        return { success: true, data: submission };
    } catch (error: any) {
        console.error('Failed to grade submission:', error);
        return { success: false, error: error.message || 'Failed to grade submission' };
    }
}

/**
 * Add question to assessment
 */
export async function addQuestion(data: {
    assessmentId: string;
    type: 'MULTIPLE_CHOICE' | 'THEORY';
    text: string;
    options?: string[];
    correctAnswer?: string;
    points: number;
}) {
    try {
        const question = await prisma.question.create({
            data: {
                assessmentId: data.assessmentId,
                type: data.type,
                text: data.text,
                options: data.options || [],
                correctAnswer: data.correctAnswer,
                points: data.points
            }
        });

        revalidatePath(`/dashboard/teacher/assessments/${data.assessmentId}`);
        return { success: true, data: question };
    } catch (error) {
        console.error('Failed to add question:', error);
        return { success: false, error: 'Failed to add question' };
    }
}

/**
 * Update question
 */
export async function updateQuestion(id: string, data: {
    text?: string;
    options?: string[];
    correctAnswer?: string;
    points?: number;
}) {
    try {
        const question = await prisma.question.update({
            where: { id },
            data
        });

        revalidatePath('/dashboard/teacher/assessments');
        return { success: true, data: question };
    } catch (error) {
        console.error('Failed to update question:', error);
        return { success: false, error: 'Failed to update question' };
    }
}

/**
 * Delete question
 */
export async function deleteQuestion(id: string) {
    try {
        await prisma.question.delete({ where: { id } });
        revalidatePath('/dashboard/teacher/assessments');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete question:', error);
        return { success: false, error: 'Failed to delete question' };
    }
}
