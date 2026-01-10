'use server';

import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

interface OnboardingData {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth?: string;
    role: Role;
    department: string;
    jobTitle: string;
    employmentType: string;
    category: string;
    dutyUnit?: string;
    shiftType?: string;
    phone: string;
    email: string;
    address?: string;
    employmentStartDate?: string;
    notes?: string;
    // Teacher specific
    classIds?: string[];
    subjectIds?: string[];
    isClassTeacher?: boolean;
}

export async function registerStaff(data: OnboardingData) {
    try {
        const {
            firstName,
            lastName,
            gender,
            dateOfBirth,
            role,
            department,
            jobTitle,
            employmentType,
            category,
            dutyUnit,
            shiftType,
            phone,
            email,
            address,
            employmentStartDate,
            notes,
            classIds,
            subjectIds,
            isClassTeacher
        } = data;

        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: email } // username is usually email
                ]
            }
        });

        if (existingUser) {
            return { success: false, error: 'A user with this email already exists.' };
        }

        // 2. Generate Staff ID (e.g., STF/2026/001)
        const year = new Date().getFullYear();
        const staffCount = await (prisma.staffProfile as any).count();
        const staffId = `STF/${year}/${(staffCount + 1).toString().padStart(3, '0')}`;

        // 3. Generate secure default password (e.g., Staff@Lastname)
        const defaultPassword = `${firstName.charAt(0).toUpperCase()}${lastName.toLowerCase()}@${year}`;
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // 4. Create User and Profiles in a transaction
        const result = await (prisma as any).$transaction(async (tx: any) => {
            // Create User
            const user = await tx.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    email: email,
                    username: email,
                    password: hashedPassword,
                    role: role,
                }
            });

            // Create Staff Profile
            const staffProfile = await tx.staffProfile.create({
                data: {
                    userId: user.id,
                    staffId: staffId,
                    role: role,
                    gender: gender,
                    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                    phone: phone,
                    address: address,
                    department: department,
                    jobTitle: jobTitle,
                    employmentType: employmentType,
                    category: category,
                    dutyUnit: dutyUnit,
                    shiftType: shiftType,
                    employmentStartDate: employmentStartDate ? new Date(employmentStartDate) : new Date(),
                    profileCompletion: 30,
                    firstLoginReset: true
                }
            });

            // If Teacher, create Teacher Profile and assignments
            if (role === 'TEACHER') {
                const teacherProfile = await tx.teacherProfile.create({
                    data: {
                        userId: user.id,
                    }
                });

                // Handle Class/Subject assignments if any
                // This would involve updating Class or Subject records
                if (classIds && classIds.length > 0) {
                    // Update classes to set this teacher if isClassTeacher is true
                    if (isClassTeacher) {
                        await tx.class.updateMany({
                            where: { id: { in: classIds } },
                            data: { teacherId: teacherProfile.id }
                        });
                    }
                }

                if (subjectIds && subjectIds.length > 0) {
                    // Correct many-to-many subject to teacher profile
                    for (const subjectId of subjectIds) {
                        await tx.subject.update({
                            where: { id: subjectId },
                            data: {
                                teachers: {
                                    connect: { id: teacherProfile.id }
                                }
                            }
                        });
                    }
                }
            }

            return { user, staffId, password: defaultPassword };
        });

        revalidatePath('/dashboard/admin/users');
        return {
            success: true,
            data: {
                name: result.user.name,
                username: email,
                password: result.password,
                staffId: result.staffId
            }
        };

    } catch (error: any) {
        console.error('Staff Onboarding Error:', error);
        return { success: false, error: `Onboarding Error: ${error.message || 'Unknown error'}` };
    }
}
