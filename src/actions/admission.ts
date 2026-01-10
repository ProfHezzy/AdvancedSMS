'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';

const admissionSchema = z.object({
    student: z.object({
        name: z.string().min(2, "Student name is required"),
        username: z.string().optional(),
        password: z.string().optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
        dateOfBirth: z.string(),
        admissionSessionId: z.string().optional(),
        admissionTermId: z.string().optional(),
        admissionType: z.string().optional(),
        classId: z.string().min(1, "Class is required"),
        arm: z.string().optional(),
        category: z.string().optional(),
        admissionStatus: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
    }),
    parent: z.object({
        mode: z.enum(['EXISTING', 'NEW']),
        existingParentId: z.string().optional(),
        name: z.string().optional(),
        relationship: z.string().optional(),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().optional(),
        address: z.string().optional(),
        username: z.string().optional(),
        password: z.string().optional(),
    })
});

export type AdmissionData = z.infer<typeof admissionSchema>;

export async function registerStudentWithParent(data: AdmissionData) {
    try {
        const session = await auth();
        if (!session?.user) return { success: false, error: "Unauthorized" };
        const userRole = (session.user as any).role;
        const currentUserId = session.user.id;

        const validated = admissionSchema.parse(data);
        const { student, parent } = validated;

        // RBAC: Teachers can only admit to their assigned classes
        if (userRole === 'TEACHER' && student.classId) {
            const hasClass = await prisma.class.findFirst({
                where: {
                    id: student.classId,
                    teacher: { userId: currentUserId }
                }
            });
            if (!hasClass) return { success: false, error: "Access denied. You can only admit students to your assigned class." };
        }

        // Generate Student Credentials if not provided
        const studentUsername = student.username || `stu_${student.name.split(' ')[0].toLowerCase()}_${Math.random().toString(36).slice(-4)}`;
        const studentPassword = student.password || Math.random().toString(36).slice(-8);

        // Generate Parent Credentials if NEW
        let parentUsername = parent.username;
        let parentPassword = parent.password;
        if (parent.mode === 'NEW') {
            parentUsername = parent.username || `par_${parent.name?.split(' ')[0].toLowerCase()}_${Math.random().toString(36).slice(-4)}`;
            parentPassword = parent.password || Math.random().toString(36).slice(-8);
        }

        // Check if student username exists
        const existingStudent = await prisma.user.findUnique({
            where: { username: studentUsername }
        });

        if (existingStudent) return { success: false, error: 'Student username already taken' };

        return await prisma.$transaction(async (tx) => {
            let parentProfileId: string;

            if (parent.mode === 'EXISTING') {
                const existingParent = await tx.parentProfile.findUnique({
                    where: { id: parent.existingParentId }
                });
                if (!existingParent) throw new Error("Selected parent not found");
                parentProfileId = existingParent.id;
            } else {
                const existingUser = await tx.user.findFirst({
                    where: {
                        OR: [
                            { username: parentUsername },
                            { email: parent.email && parent.email.length > 0 ? parent.email : undefined }
                        ].filter(Boolean) as any
                    }
                });
                if (existingUser) throw new Error("Parent username or email already exists");

                const hashedParentPassword = await bcrypt.hash(parentPassword!, 10);
                const newParentUser = await (tx.user as any).create({
                    data: {
                        username: parentUsername!,
                        email: parent.email || null,
                        password: hashedParentPassword,
                        name: parent.name,
                        role: 'PARENT',
                        parentProfile: {
                            create: {
                                phone: parent.phone,
                                address: parent.address,
                                relationship: parent.relationship,
                                wallet: {
                                    create: {
                                        balance: 0,
                                        virtualAccount: Math.random().toString().slice(2, 12)
                                    }
                                }
                            }
                        }
                    },
                    include: { parentProfile: true }
                });
                if (!(newParentUser as any).parentProfile) throw new Error("Failed to create parent profile");
                parentProfileId = (newParentUser as any).parentProfile.id;
            }

            const currentYear = new Date().getFullYear();
            const count = await tx.studentProfile.count();
            const schoolId = `ASMS/${currentYear}/${(count + 1).toString().padStart(3, '0')}`;

            const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
            const newStudentUser = await (tx.user as any).create({
                data: {
                    username: studentUsername,
                    password: hashedStudentPassword,
                    name: student.name,
                    role: 'STUDENT',
                    studentProfile: {
                        create: {
                            studentId: schoolId,
                            parentId: parentProfileId,
                            classId: student.classId || null,
                            gender: student.gender,
                            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
                            address: student.address,
                            phone: student.phone,
                            admissionSessionId: student.admissionSessionId,
                            admissionTermId: student.admissionTermId,
                            admissionType: student.admissionType,
                            admissionStatus: student.admissionStatus || 'ADMITTED',
                            category: student.category || 'DAY',
                            arm: student.arm,
                            admittedById: currentUserId,
                            profileCompletion: 40, // Initial completion
                        }
                    }
                }
            });

            revalidatePath('/dashboard/admin/admission');
            return {
                success: true,
                data: {
                    student: { id: schoolId, username: studentUsername, password: studentPassword },
                    parent: parent.mode === 'NEW' ? { username: parentUsername, password: parentPassword } : null
                }
            };
        });
    } catch (error: any) {
        console.error("Admission Error:", error);
        return { success: false, error: error.message || "Failed to register student" };
    }
}

export async function searchParents(query: string) {
    if (query.length < 2) return { success: true, data: [] };

    try {
        const parents = await prisma.parentProfile.findMany({
            where: {
                user: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { username: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } }
                    ]
                }
            },
            include: {
                user: {
                    select: { name: true, username: true, email: true }
                }
            },
            take: 5
        });

        return { success: true, data: parents };
    } catch (error) {
        return { success: false, error: "Failed to search parents" };
    }
}

/**
 * Legacy Adapter for Teacher Dashboard admission
 */
export async function admitStudent(formData: any) {
    try {
        const payload: AdmissionData = {
            student: {
                name: formData.studentName,
                username: formData.studentEmail ? formData.studentEmail.split('@')[0] : `student_${Date.now()}`,
                password: 'student123', // Default
                gender: (formData.gender as any) || 'MALE',
                dateOfBirth: formData.dateOfBirth || new Date().toISOString(),
                classId: formData.classId,
                admissionType: 'NEW',
                admissionStatus: 'ADMITTED',
                category: 'DAY'
            },
            parent: {
                mode: 'NEW',
                name: formData.parentName,
                username: formData.parentEmail ? formData.parentEmail.split('@')[0] : `parent_${Date.now()}`,
                email: formData.parentEmail,
                phone: formData.parentPhone,
                password: 'parent123', // Default
                relationship: 'Guardian'
            }
        };

        const result = await registerStudentWithParent(payload);

        if (result.success) {
            return {
                success: true,
                data: {
                    student: { email: (result.data as any).student.username, password: (result.data as any).student.password },
                    parent: (result.data as any).parent ? { email: (result.data as any).parent.username, password: (result.data as any).parent.password } : null
                }
            };
        }
        return result;

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function bulkAdmitStudents(classId: string, students: any[]) {
    // Stub implementation for now to fix build
    // In future, this should loop through registerStudentWithParent
    return { success: false, error: "Bulk admission temporarily disabled for upgrade.", count: 0 };
}
