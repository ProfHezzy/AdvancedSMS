'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { calculateGrade, calculateTotal, validateScore, calculateCGPA } from '@/lib/grade-calculator';

/**
 * Assessment & Exam Management
 */

export async function generateExamToken(assessmentId: string) {
    try {
        const token = uuidv4().slice(0, 8).toUpperCase();
        await (prisma as any).assessment.update({
            where: { id: assessmentId },
            data: { token }
        });
        return { success: true, token };
    } catch (error) {
        console.error('Failed to generate token:', error);
        return { success: false, error: 'Failed to generate token.' };
    }
}

export async function verifyExamToken(assessmentId: string, token: string) {
    try {
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId }
        });

        if (assessment?.token === token) {
            return { success: true };
        }
        return { success: false, error: 'Invalid examination token.' };
    } catch (error) {
        return { success: false, error: 'Verification failed.' };
    }
}

/**
 * Result Compilation
 */

export async function compileResults(data: {
    studentId: string;
    subjectId: string;
    termId: string;
    caScore: number;
    examScore: number;
}) {
    try {
        // Validate CA score (max 40)
        const caValidation = validateScore(data.caScore, 40, 'CA Score');
        if (!caValidation.valid) {
            return { success: false, error: caValidation.error };
        }

        // Validate Exam score (max 60)
        const examValidation = validateScore(data.examScore, 60, 'Exam Score');
        if (!examValidation.valid) {
            return { success: false, error: examValidation.error };
        }

        const total = calculateTotal(data.caScore, data.examScore);
        const { grade } = calculateGrade(total);

        const result = await prisma.result.upsert({
            where: {
                studentId_subjectId_termId: {
                    studentId: data.studentId,
                    subjectId: data.subjectId,
                    termId: data.termId
                }
            },
            update: {
                caScore: data.caScore,
                examScore: data.examScore,
                total,
                grade
            },
            create: {
                studentId: data.studentId,
                subjectId: data.subjectId,
                termId: data.termId,
                caScore: data.caScore,
                examScore: data.examScore,
                total,
                grade
            }
        });

        revalidatePath('/dashboard/teacher/results');
        revalidatePath('/dashboard/results');
        return { success: true, data: result };
    } catch (error) {
        console.error('Failed to compile results:', error);
        return { success: false, error: 'Failed to compile results.' };
    }
}

export async function saveResults(results: any[]) {
    try {
        const resultPromises = results.map(r => compileResults(r));
        const responses = await Promise.all(resultPromises);

        // Check if any failed
        const failed = responses.filter(r => !r.success);
        if (failed.length > 0) {
            return {
                success: false,
                error: `${failed.length} result(s) failed to save`,
                details: failed
            };
        }

        revalidatePath('/dashboard/teacher/results');
        revalidatePath('/dashboard/results');
        return { success: true, message: `${results.length} results saved successfully` };
    } catch (error) {
        console.error('Failed to save bulk results:', error);
        return { success: false, error: 'Failed to save bulk results.' };
    }
}

/**
 * Get class results for a specific subject and term
 */
export async function getClassResults(classId: string, subjectId: string, termId: string) {
    try {
        const students = await prisma.studentProfile.findMany({
            where: { classId },
            include: {
                user: true,
                results: {
                    where: { subjectId, termId }
                }
            },
            orderBy: {
                user: { name: 'asc' }
            }
        });

        const formatted = students.map((s: any) => ({
            studentId: s.id,
            studentName: s.user.name || s.user.username,
            caScore: s.results[0]?.caScore || 0,
            examScore: s.results[0]?.examScore || 0,
            total: s.results[0]?.total || 0,
            grade: s.results[0]?.grade || '-'
        }));

        return { success: true, data: formatted };
    } catch (error) {
        console.error('Failed to fetch class results:', error);
        return { success: false, error: 'Failed to retrieve class results.' };
    }
}

export async function getStudentReport(studentId: string, termId: string) {
    try {
        const results = await prisma.result.findMany({
            where: { studentId, termId },
            include: {
                subject: true,
                term: { include: { session: true } }
            }
        });
        return { success: true, data: results };
    } catch (error) {
        return { success: false, error: 'Failed to fetch report.' };
    }
}

export async function getRecentAssessments(roleId: string, isTeacher: boolean) {
    try {
        const assessments = await (prisma as any).assessment.findMany({
            where: isTeacher ? { teacher: { userId: roleId } } : { class: { students: { some: { userId: roleId } } } },
            include: {
                subject: true,
                class: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        return { success: true, data: assessments };
    } catch (error) {
        return { success: false, error: 'Failed to fetch recent assessments.' };
    }
}
export async function getResultsBySubject(subjectId: string, termId: string, classId: string) {
    try {
        const students = await prisma.studentProfile.findMany({
            where: { classId },
            include: {
                user: true,
                results: {
                    where: { subjectId, termId }
                }
            }
        });

        const formatted = students.map((s: any) => ({
            id: s.id,
            name: s.user.username,
            caScore: s.results[0]?.caScore || 0,
            examScore: s.results[0]?.examScore || 0,
            total: s.results[0]?.total || 0,
            grade: s.results[0]?.grade || '-'
        }));

        return { success: true, data: formatted };
    } catch (error) {
        console.error('Failed to fetch subject results:', error);
        return { success: false, error: 'Failed to retrieve results.' };
    }
}
