'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Save a new card after successful transaction
 */
export async function saveCard(data: {
    parentId: string;
    authorizationCode: string;
    last4: string;
    brand: string;
    expMonth: string;
    expYear: string;
    bank?: string;
    signature?: string;
    email: string;
}) {
    try {
        // Check if card exists
        const existingCard = await prisma.savedCard.findUnique({
            where: {
                parentId_signature: {
                    parentId: data.parentId,
                    signature: data.signature || ''
                }
            }
        });

        if (existingCard) {
            return { success: true, message: 'Card already saved' };
        }

        const card = await prisma.savedCard.create({
            data: {
                parentId: data.parentId,
                authorizationCode: data.authorizationCode,
                last4: data.last4,
                brand: data.brand,
                expMonth: data.expMonth,
                expYear: data.expYear,
                bank: data.bank,
                signature: data.signature,
                email: data.email,
                isDefault: false
            }
        });

        revalidatePath('/dashboard/settings/billing');
        return { success: true, data: card };
    } catch (error) {
        console.error('Failed to save card:', error);
        return { success: false, error: 'Failed to save card details' };
    }
}

/**
 * Get all saved cards for a parent
 */
export async function getSavedCards(parentId: string) {
    try {
        const cards = await prisma.savedCard.findMany({
            where: { parentId },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: cards };
    } catch (error) {
        console.error('Failed to fetch cards:', error);
        return { success: false, error: 'Failed to retrieve cards' };
    }
}

/**
 * Delete a saved card
 */
export async function deleteCard(cardId: string, parentId: string) {
    try {
        await prisma.savedCard.delete({
            where: {
                id: cardId,
                parentId // Ensure ownership
            }
        });

        revalidatePath('/dashboard/settings/billing');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete card:', error);
        return { success: false, error: 'Failed to delete card' };
    }
}

/**
 * Set default card
 */
export async function setDefaultCard(cardId: string, parentId: string) {
    try {
        await prisma.$transaction([
            // Remove default from all other cards
            prisma.savedCard.updateMany({
                where: { parentId },
                data: { isDefault: false }
            }),
            // Set new default
            prisma.savedCard.update({
                where: { id: cardId, parentId },
                data: { isDefault: true }
            })
        ]);

        revalidatePath('/dashboard/settings/billing');
        return { success: true };
    } catch (error) {
        console.error('Failed to set default card:', error);
        return { success: false, error: 'Failed to update default card' };
    }
}
