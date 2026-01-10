'use server';

import prisma from '@/lib/prisma';
import { calculateCGPA } from '@/lib/grade-calculator';

export async function getStudentResults(studentId: string) {
    try {
        const results = await prisma.result.findMany({
            where: { studentId },
            include: {
                subject: true,
                term: true
            },
            orderBy: {
                term: {
                    name: 'asc'
                }
            }
        });
        return results;
    } catch (error) {
        console.error('Failed to fetch student results:', error);
        throw new Error('Failed to fetch results.');
    }
}

/**
 * Get student results for a specific term
 */
export async function getStudentResultsByTerm(studentId: string, termId: string) {
    try {
        const results = await prisma.result.findMany({
            where: { studentId, termId },
            include: {
                subject: true,
                term: {
                    include: { session: true }
                }
            },
            orderBy: {
                subject: { name: 'asc' }
            }
        });

        // Calculate CGPA using our utility
        const cgpa = calculateCGPA(
            results.map(r => ({
                total: r.total,
                coefficient: r.subject.coefficient
            }))
        );

        return {
            success: true,
            data: results,
            cgpa
        };
    } catch (error) {
        console.error('Failed to fetch student results:', error);
        return { success: false, error: 'Failed to fetch results.' };
    }
}

export async function getStudentPerformanceStats(studentId: string) {
    try {
        const results = await prisma.result.findMany({
            where: { studentId },
            select: {
                total: true,
                grade: true,
                subject: {
                    select: { name: true, coefficient: true }
                }
            }
        });

        // Use our grade calculator utility
        const cgpa = calculateCGPA(
            results.map(r => ({
                total: r.total,
                coefficient: r.subject.coefficient
            }))
        );

        return {
            gpa: cgpa,
            totalSubjects: results.length,
            results: results.map(r => ({
                subject: r.subject.name,
                score: r.total,
                grade: r.grade
            }))
        };
    } catch (error) {
        console.error('Failed to fetch performance stats:', error);
        throw new Error('Failed to fetch stats.');
    }
}
