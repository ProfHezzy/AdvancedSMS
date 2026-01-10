'use server';

import prisma from '@/lib/prisma';

export async function getStudentAvailableAssessments(studentId: string, type?: 'ASSIGNMENT' | 'TEST' | 'EXAM') {
    try {
        // Get student's class
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            select: { classId: true }
        });

        if (!student?.classId) return { success: false, error: 'Student class not found' };

        // Find assessments for this class that the student hasn't submitted yet
        const assessments = await prisma.assessment.findMany({
            where: {
                classId: student.classId,
                ...(type ? { type } : {}),
                submissions: {
                    none: { studentId }
                }
            },
            include: {
                subject: true,
                teacher: {
                    include: { user: true }
                }
            },
            orderBy: { dueDate: 'asc' }
        });

        return { success: true, data: assessments };
    } catch (error) {
        console.error('Failed to fetch available assessments:', error);
        return { success: false, error: 'Failed to retrieve available assessments.' };
    }
}

export async function getStudentSubmittedAssessments(studentId: string, type?: 'ASSIGNMENT' | 'TEST' | 'EXAM', status?: 'PENDING' | 'GRADED') {
    try {
        const assessments = await prisma.assessment.findMany({
            where: {
                ...(type ? { type } : {}),
                submissions: {
                    some: {
                        studentId,
                        ...(status ? { status } : {})
                    }
                }
            },
            include: {
                subject: true,
                teacher: {
                    include: { user: true }
                },
                submissions: {
                    where: { studentId }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return { success: true, data: assessments };
    } catch (error) {
        console.error('Failed to fetch submitted assessments:', error);
        return { success: false, error: 'Failed to retrieve submitted assessments.' };
    }
}

/**
 * Submit assessment answers
 */
export async function submitAssessment(data: {
    assessmentId: string;
    studentId: string;
    answers: Record<string, string>; // questionId -> answer
}) {
    try {
        // Get assessment with questions
        const assessment = await prisma.assessment.findUnique({
            where: { id: data.assessmentId },
            include: {
                questions: true
            }
        });

        if (!assessment) {
            return { success: false, error: 'Assessment not found' };
        }

        // Check if already submitted
        const existing = await prisma.submission.findUnique({
            where: {
                assessmentId_studentId: {
                    assessmentId: data.assessmentId,
                    studentId: data.studentId
                }
            }
        });

        if (existing) {
            return { success: false, error: 'You have already submitted this assessment' };
        }

        // Auto-grade MCQ questions
        let totalScore = 0;
        let maxScore = 0;

        for (const question of assessment.questions) {
            maxScore += question.points;

            if (question.type === 'MULTIPLE_CHOICE') {
                const studentAnswer = data.answers[question.id];
                if (studentAnswer === question.correctAnswer) {
                    totalScore += question.points;
                }
            }
        }

        // Create submission
        const submission = await prisma.submission.create({
            data: {
                assessmentId: data.assessmentId,
                studentId: data.studentId,
                content: JSON.stringify(data.answers),
                score: totalScore > 0 ? totalScore : null,
                status: assessment.questions.some((q: any) => q.type === 'THEORY') ? 'PENDING' : 'GRADED'
            }
        });

        return {
            success: true,
            data: submission,
            score: totalScore,
            maxScore
        };
    } catch (error) {
        console.error('Failed to submit assessment:', error);
        return { success: false, error: 'Failed to submit assessment' };
    }
}

/**
 * Get student's submission for an assessment
 */
export async function getSubmission(assessmentId: string, studentId: string) {
    try {
        const submission = await prisma.submission.findUnique({
            where: {
                assessmentId_studentId: {
                    assessmentId,
                    studentId
                }
            },
            include: {
                assessment: {
                    include: {
                        subject: true,
                        questions: true
                    }
                },
                gradedBy: {
                    include: { user: true }
                }
            }
        });

        if (!submission) {
            return { success: false, error: 'Submission not found' };
        }

        return { success: true, data: submission };
    } catch (error) {
        console.error('Failed to fetch submission:', error);
        return { success: false, error: 'Failed to retrieve submission' };
    }
}
