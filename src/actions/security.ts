'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Visitor Management
 */

interface VisitorLog {
    id: string;
    name: string;
    phone: string;
    purpose: string;
    hostName: string;
    checkIn: string;
    checkOut?: string;
    status: 'ON-CAMPUS' | 'EXITED';
}

const MOCK_VISITORS: VisitorLog[] = [
    { id: '1', name: 'Mark Stevens', phone: '+234 812 345 6789', purpose: 'Maintenance', hostName: 'Admin Office', checkIn: '2026-01-04T08:00:00Z', status: 'ON-CAMPUS' },
    { id: '2', name: 'Sarah Phillips', phone: '+234 803 111 2222', purpose: 'Parent Meeting', hostName: 'Mrs. Bello', checkIn: '2026-01-04T09:30:00Z', checkOut: '2026-01-04T10:45:00Z', status: 'EXITED' },
];

export async function getVisitorLogs() {
    return { success: true, data: MOCK_VISITORS };
}

export async function logVisitorEntry(data: { name: string, phone: string, purpose: string, hostName: string }) {
    try {
        // Logic to create log
        revalidatePath('/dashboard/security/visitors');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to log visitor entry.' };
    }
}

export async function logVisitorExit(logId: string) {
    try {
        revalidatePath('/dashboard/security/visitors');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to process exit.' };
    }
}

/**
 * Incident Reporting
 */

interface Incident {
    id: string;
    type: 'DISCIPLINARY' | 'SECURITY' | 'MEDICAL' | 'OTHER';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    location: string;
    description: string;
    involved: string[];
    reportedBy: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
    date: string;
}

const MOCK_INCIDENTS: Incident[] = [
    { id: '1', type: 'SECURITY', priority: 'HIGH', location: 'Gate 2', description: 'Unauthorized individual attempted entry.', involved: ['Unknown'], reportedBy: 'Officer Dan', status: 'INVESTIGATING', date: '2026-01-04T07:15:00Z' },
    { id: '2', type: 'DISCIPLINARY', priority: 'MEDIUM', location: 'Main Hall', description: 'Vandalism on corridor walls.', involved: ['Group of JS3 Students'], reportedBy: 'Bursar', status: 'OPEN', date: '2026-01-04T11:00:00Z' },
];

export async function getIncidents() {
    return { success: true, data: MOCK_INCIDENTS };
}

export async function reportIncident(data: any) {
    try {
        revalidatePath('/dashboard/security/incidents');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to report incident.' };
    }
}
