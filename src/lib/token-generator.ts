/**
 * Token Generator Utility
 * Generates secure tokens for assessments
 */

/**
 * Generate a random alphanumeric token
 */
export function generateToken(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return token;
}

/**
 * Generate a unique token with prefix
 */
export function generateAssessmentToken(
    type: 'ASSIGNMENT' | 'TEST' | 'EXAM' | 'PROJECT'
): string {
    const prefix = {
        ASSIGNMENT: 'ASG',
        TEST: 'TST',
        EXAM: 'EXM',
        PROJECT: 'PRJ',
    }[type];

    const randomPart = generateToken(6);
    return `${prefix}-${randomPart}`;
}

/**
 * Validate token format
 */
export function validateTokenFormat(token: string): boolean {
    // Format: XXX-XXXXXX (3 letter prefix, dash, 6 alphanumeric)
    const tokenRegex = /^[A-Z]{3}-[A-Z0-9]{6}$/;
    return tokenRegex.test(token);
}

/**
 * Generate virtual account number (11 digits)
 */
export function generateVirtualAccountNumber(): string {
    let accountNumber = '';

    for (let i = 0; i < 11; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }

    return accountNumber;
}
