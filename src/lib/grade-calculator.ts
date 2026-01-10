/**
 * Grade Calculator Utility
 * Handles grade calculation based on total scores
 */

export interface GradeConfig {
    min: number;
    max: number;
    grade: string;
    remark: string;
}

// Standard grading system (can be customized per school)
export const DEFAULT_GRADE_SCALE: GradeConfig[] = [
    { min: 90, max: 100, grade: 'A+', remark: 'Excellent' },
    { min: 80, max: 89, grade: 'A', remark: 'Very Good' },
    { min: 70, max: 79, grade: 'B', remark: 'Good' },
    { min: 60, max: 69, grade: 'C', remark: 'Credit' },
    { min: 50, max: 59, grade: 'D', remark: 'Pass' },
    { min: 40, max: 49, grade: 'E', remark: 'Fair' },
    { min: 0, max: 39, grade: 'F', remark: 'Fail' },
];

/**
 * Calculate grade based on total score
 */
export function calculateGrade(
    total: number,
    gradeScale: GradeConfig[] = DEFAULT_GRADE_SCALE
): { grade: string; remark: string } {
    // Ensure total is within valid range
    const normalizedTotal = Math.max(0, Math.min(100, total));

    const gradeConfig = gradeScale.find(
        (config) => normalizedTotal >= config.min && normalizedTotal <= config.max
    );

    return {
        grade: gradeConfig?.grade || 'F',
        remark: gradeConfig?.remark || 'Fail',
    };
}

/**
 * Calculate total from CA and Exam scores
 */
export function calculateTotal(caScore: number, examScore: number): number {
    return Math.round((caScore + examScore) * 100) / 100; // Round to 2 decimal places
}

/**
 * Validate score is within acceptable range
 */
export function validateScore(
    score: number,
    maxScore: number,
    fieldName: string = 'Score'
): { valid: boolean; error?: string } {
    if (isNaN(score)) {
        return { valid: false, error: `${fieldName} must be a valid number` };
    }

    if (score < 0) {
        return { valid: false, error: `${fieldName} cannot be negative` };
    }

    if (score > maxScore) {
        return {
            valid: false,
            error: `${fieldName} cannot exceed ${maxScore}`,
        };
    }

    return { valid: true };
}

/**
 * Calculate CGPA from results
 */
export function calculateCGPA(
    results: Array<{ total: number; coefficient: number }>
): number {
    if (results.length === 0) return 0;

    const totalWeightedScore = results.reduce(
        (sum, result) => sum + result.total * result.coefficient,
        0
    );

    const totalCoefficients = results.reduce(
        (sum, result) => sum + result.coefficient,
        0
    );

    if (totalCoefficients === 0) return 0;

    const cgpa = totalWeightedScore / totalCoefficients;
    return Math.round(cgpa * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate class position based on total scores
 */
export function calculatePosition(
    studentTotal: number,
    allTotals: number[]
): number {
    const sortedTotals = [...allTotals].sort((a, b) => b - a);
    return sortedTotals.indexOf(studentTotal) + 1;
}

/**
 * Get performance category based on CGPA
 */
export function getPerformanceCategory(cgpa: number): {
    category: string;
    color: string;
} {
    if (cgpa >= 90) return { category: 'Outstanding', color: 'text-green-600' };
    if (cgpa >= 80) return { category: 'Excellent', color: 'text-blue-600' };
    if (cgpa >= 70) return { category: 'Very Good', color: 'text-indigo-600' };
    if (cgpa >= 60) return { category: 'Good', color: 'text-purple-600' };
    if (cgpa >= 50) return { category: 'Average', color: 'text-yellow-600' };
    if (cgpa >= 40) return { category: 'Fair', color: 'text-orange-600' };
    return { category: 'Poor', color: 'text-red-600' };
}
