'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

/**
 * Assessment & Exam Management
 */

export async function createAssessment(data: {
    title: string;
    description?: string;
    type: 'ASSIGNMENT' | 'PROJECT' | 'TEST' | 'EXAM';
    subjectId: string;
    classId: string;
    teacherId: string;
    dueDate?: Date;
    maxScore?: number;
}) {
    try {
        const assessment = await prisma.assessment.create({
            data: {
                ...data,
                token: data.type === 'EXAM' ? uuidv4().slice(0, 8).toUpperCase() : null
            }
        });

        revalidatePath('/dashboard/teacher/assessments');
        return { success: true, data: assessment };
    } catch (error) {
        console.error('Failed to create assessment:', error);
        return { success: false, error: 'Failed to create assessment.' };
    }
}

export async function generateExamToken(assessmentId: string) {
    try {
        const token = uuidv4().slice(0, 8).toUpperCase();
        await prisma.assessment.update({
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
        const total = data.caScore + data.examScore;
        let grade = 'F';

        if (total >= 70) grade = 'A';
        else if (total >= 60) grade = 'B';
        else if (total >= 50) grade = 'C';
        else if (total >= 45) grade = 'D';
        else if (total >= 40) grade = 'E';

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
        await Promise.all(results.map(r => compileResults(r)));
        revalidatePath('/dashboard/teacher/results');
        revalidatePath('/dashboard/results');
        return { success: true };
    } catch (error) {
        console.error('Failed to save bulk results:', error);
        return { success: false, error: 'Failed to save bulk results.' };
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
        const assessments = await prisma.assessment.findMany({
            where: isTeacher ? { teacherId: roleId } : { class: { students: { some: { id: roleId } } } },
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

        const formatted = students.map(s => ({
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
