'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

export async function createAnnouncement(data: {
    title: string;
    content: string;
    authorId: string;
    classId?: string;
    role?: Role;
}) {
    try {
        const announcement = await prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                authorId: data.authorId,
                classId: data.classId || null,
                role: data.role || null
            }
        });

        revalidatePath('/dashboard');
        return { success: true, announcement };
    } catch (error) {
        console.error('Failed to create announcement:', error);
        return { success: false, error: 'Failed to create announcement.' };
    }
}

export async function getAnnouncements(filters?: { classId?: string; role?: Role }) {
    try {
        const announcements = await prisma.announcement.findMany({
            where: {
                OR: [
                    { classId: null, role: null }, // Global
                    { classId: filters?.classId }, // My Class
                    { role: filters?.role }       // My Role
                ]
            },
            include: {
                author: {
                    select: {
                        username: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return announcements;
    } catch (error) {
        console.error('Failed to fetch announcements:', error);
        return [];
    }
}

export async function sendMessage(data: {
    senderId: string;
    recipientId: string;
    content: string;
}) {
    try {
        const message = await prisma.message.create({
            data: {
                senderId: data.senderId,
                recipientId: data.recipientId,
                content: data.content
            }
        });

        revalidatePath('/dashboard/communication/messages');
        return { success: true, message };
    } catch (error) {
        console.error('Failed to send message:', error);
        return { success: false, error: 'Failed to send message.' };
    }
}

export async function getMessages(userId: string) {
    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { recipientId: userId }
                ]
            },
            include: {
                sender: { select: { username: true, role: true } },
                recipient: { select: { username: true, role: true } }
            },
            orderBy: { createdAt: 'asc' }
        });
        return messages;
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return [];
    }
}
