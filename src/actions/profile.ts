'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    image?: string;
}) {
    try {
        // Fetch current user to compare and avoid redundant updates
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, name: true }
        });

        if (!currentUser) throw new Error("User not found");

        const updateData: any = {};

        // Only update if changed and valid
        if (data.name && data.name.trim() !== '' && data.name !== currentUser.name) {
            updateData.name = data.name.trim();
        }

        // Only update email if changed, valid, and different
        if (data.email && data.email.trim() !== '' && data.email !== currentUser.email) {
            updateData.email = data.email.trim();
        }

        // Update image if provided
        if (data.image && data.image.trim() !== '') {
            updateData.image = data.image;
        }

        // If nothing to update, return success immediately
        if (Object.keys(updateData).length === 0) {
            return { success: true, data: currentUser }; // Return current state
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        revalidatePath('/dashboard/settings/profile');
        return { success: true, data: user };
    } catch (error: any) {
        console.error('Profile update error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
        });

        // Return user-friendly error
        if (error.code === 'P2002') {
            return { success: false, error: 'This email is already in use by another account.' };
        }
        return { success: false, error: error.message || 'Failed to update profile.' };
    }
}

export async function getUserProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                image: true,
                role: true,
            }
        });
        return { success: true, data: user };
    } catch (error: any) {
        return { success: false, error: 'Failed to fetch profile' };
    }
}
