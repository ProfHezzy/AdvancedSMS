'use server';

import prisma from '@/lib/prisma';

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

export async function getStudentPerformanceStats(studentId: string) {
    try {
        const results = await prisma.result.findMany({
            where: { studentId },
            select: {
                total: true,
                grade: true,
                subject: {
                    select: { name: true }
                }
            }
        });

        // Simple GPA calculation (4.0 scale)
        const gradeToPoints: Record<string, number> = {
            'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'E': 0.5, 'F': 0.0
        };

        let totalPoints = 0;
        results.forEach(r => {
            if (r.grade) {
                totalPoints += gradeToPoints[r.grade] || 0;
            }
        });

        const gpa = results.length > 0 ? (totalPoints / results.length).toFixed(2) : '0.00';

        return {
            gpa: parseFloat(gpa),
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
