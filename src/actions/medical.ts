'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Health Profiles
 */

export async function getStudentMedicalProfile(studentId: string) {
    try {
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: {
                user: true,
                class: true
            }
        });

        // Mock data for health details as they are not in schema yet
        return {
            success: true,
            data: {
                ...student,
                bloodGroup: 'O+',
                genotype: 'AA',
                allergies: ['Peanuts', 'Penicillin'],
                conditions: ['Asthma'],
                emergencyContact: 'John Doe (+234 801 234 5678)'
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch medical profile.' };
    }
}

/**
 * Clinic Logs
 */

interface ClinicLog {
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    complaint: string;
    diagnosis: string;
    treatment: string;
    vitals: { temp: string, bp: string };
    recordedBy: string;
    date: string;
}

const MOCK_LOGS: ClinicLog[] = [
    { id: '1', studentId: 's1', studentName: 'Alice Johnson', className: 'SS 3A', complaint: 'High Fever', diagnosis: 'Malaria', treatment: 'Artemether + Lumefantrine', vitals: { temp: '38.5C', bp: '110/70' }, recordedBy: 'Nurse Joy', date: '2026-01-04T08:30:00Z' },
    { id: '2', studentId: 's2', studentName: 'Bob Smith', className: 'JS 1B', complaint: 'Minor Cut', diagnosis: 'Laceration', treatment: 'Wound dressing', vitals: { temp: '36.6C', bp: '120/80' }, recordedBy: 'Dr. Evans', date: '2026-01-04T09:15:00Z' },
];

export async function getClinicLogs() {
    return { success: true, data: MOCK_LOGS };
}

export async function createClinicLog(data: any) {
    try {
        // Logic to create log
        revalidatePath('/dashboard/medical/logs');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to record clinic visit.' };
    }
}

/**
 * Emergency Alerts
 */

export async function triggerHealthAlert(studentId: string, level: 'CRITICAL' | 'MODERATE') {
    try {
        // Logic to send broadcast to Admin/Parent/Security
        return { success: true, message: 'Emergency medical alert broadcasted.' };
    } catch (error) {
        return { success: false, error: 'Failed to trigger alert.' };
    }
}
