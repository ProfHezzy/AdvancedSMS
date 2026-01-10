'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const TimetableEntrySchema = z.object({
    classId: z.string().uuid(),
    subjectId: z.string().uuid(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),   // HH:MM
    room: z.string().optional()
});

export async function createTimetableEntry(data: z.infer<typeof TimetableEntrySchema>) {
    try {
        const validated = TimetableEntrySchema.parse(data);

        // Convert enum string to Int dayOfWeek?
        // Schema says dayOfWeek is Int (1-7).
        // Let's map MONDAY=1, TUESDAY=2, etc.
        const dayMap: { [key: string]: number } = {
            'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7
        };

        const dayInt = dayMap[validated.dayOfWeek];

        const entry = await prisma.timetableEntry.create({
            data: {
                classId: validated.classId,
                subjectId: validated.subjectId,
                dayOfWeek: dayInt,
                startTime: validated.startTime,
                endTime: validated.endTime,
                room: validated.room
            }
        });

        revalidatePath('/dashboard/admin/timetable');
        revalidatePath('/dashboard/student/timetable');
        revalidatePath('/dashboard/teacher/timetable');

        return { success: true, data: entry };
    } catch (error) {
        console.error('Failed to create timetable entry:', error);
        return { success: false, error: 'Failed to create entry.' };
    }
}

export async function deleteTimetableEntry(id: string) {
    try {
        await prisma.timetableEntry.delete({
            where: { id }
        });

        revalidatePath('/dashboard/admin/timetable');
        revalidatePath('/dashboard/student/timetable');
        revalidatePath('/dashboard/teacher/timetable');

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete entry.' };
    }
}

export async function getAllClasses() {
    try {
        const classes = await prisma.class.findMany({
            include: { subjects: true },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: classes };
    } catch (error) {
        return { success: false, error: 'Failed to fetch classes.' };
    }
}

export async function getAllSubjects() {
    try {
        const subjects = await prisma.subject.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: subjects };
    } catch (error) {
        return { success: false, error: 'Failed to fetch subjects.' };
    }
}
