'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Fetch Students
export async function getStudentsForManagement(filters: { classId?: string; role?: string; userId?: string }) {
    try {
        const { classId, role, userId } = filters;

        // Base where clause
        let where: any = {
            user: { role: 'STUDENT' } // Ensure we only get students
        };

        // Permission check: If Class Teacher, restricted to their classes
        if (role === 'TEACHER' && userId) {
            const teacherProfile = await prisma.teacherProfile.findUnique({
                where: { userId },
                include: { classes: true }
            });

            if (!teacherProfile || !teacherProfile.classes.length) {
                return { success: true, data: [] }; // No classes assigned
            }

            const assignedClassIds = teacherProfile.classes.map(c => c.id);

            // If a specific class is requested, verify ownership
            if (classId) {
                if (!assignedClassIds.includes(classId)) {
                    return { success: false, error: 'Unauthorized access to this class' };
                }
                where.classId = classId;
            } else {
                where.classId = { in: assignedClassIds };
            }
        }
        // If Admin, allow any class or specific class
        else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            if (classId) where.classId = classId;
        }

        const students = await prisma.studentProfile.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true, username: true, isActive: true, image: true } },
                class: { select: { id: true, name: true } },
                parent: {
                    include: {
                        user: { select: { id: true, name: true, email: true, isActive: true } }
                    }
                }
            },
            orderBy: { user: { name: 'asc' } }
        });

        return { success: true, data: students };
    } catch (error) {
        console.error('Error fetching students:', error);
        return { success: false, error: 'Failed to fetch students' };
    }
}

// Toggle Status (Disable/Enable)
export async function toggleStudentStatus(studentId: string, isActive: boolean) {
    try {
        // Update Student User
        const student = await prisma.studentProfile.findUnique({
            where: { id: studentId },
            include: { user: true, parent: { include: { user: true } } }
        });

        if (!student) return { success: false, error: 'Student not found' };

        await prisma.$transaction([
            // Toggle Student
            prisma.user.update({
                where: { id: student.userId },
                data: { isActive }
            }),
            // Toggle Parent (if exists) - Optional: logic might vary if parent has other kids?
            // User requirement: "Parent and teachers profile can also be disabled"
            // For now, let's keep it simple: Disable Parent too if disabling student?
            // Actually, a parent might have another active child. 
            // Disabling the *Parent User* blocks access to ALL children.
            // Let's assume for now we toggle the Student. 
            // If the user explicity requested parent disabling, we can add a separate action or flag.
            // Requirement says: "student and parent profile should be created automatically... also the particular student ckass teacher and admin can also disable student profile... The parent and teachers profile can also be dissabled by the admin."
            // So disabling *student profile* implies disabling the student user.
        ]);

        revalidatePath('/dashboard/teacher/students/admission');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

// Toggle Parent Status
export async function toggleParentStatus(parentId: string, isActive: boolean) {
    try {
        const parent = await prisma.parentProfile.findUnique({ where: { id: parentId } });
        if (!parent) return { success: false, error: 'Parent not found' };

        await prisma.user.update({
            where: { id: parent.userId },
            data: { isActive }
        });

        revalidatePath('/dashboard/teacher/students/admission');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update parent status' };
    }
}


// Promote Student
export async function promoteStudent(studentId: string, newClassId: string) {
    try {
        await prisma.studentProfile.update({
            where: { id: studentId },
            data: { classId: newClassId }
        });

        revalidatePath('/dashboard/teacher/students/admission');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to promote student' };
    }
}
