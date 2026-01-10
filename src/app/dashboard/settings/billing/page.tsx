'use client';

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Trash } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getSavedCards, saveCard, deleteCard, setDefaultCard } from '@/actions/cards';
import { initializePayment, verifyPayment } from '@/lib/paystack-service';

export default function CardsPage() {
    const { data: session } = useSession();
    const [cards, setCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchCards();
        }
    }, [session]);

    async function fetchCards() {
        setIsLoading(true);
        const userId = session?.user?.id;
        if (!userId) return;

        // Need parent ID first, but for now we assume we can get cards by parentId
        // We'll fetching via a wrapper or assume we can get the parentId from somewhere
        // For simplicity, let's look up the parent ID on the client or server
        // In a real app we'd probably have a 'getParentByUserId' action or similar available
        // Let's use the pattern from Wallet page

        try {
            const { getParentProfile } = await import('@/actions/academic');
            const parentRes = await getParentProfile(userId);

            if (parentRes.success && parentRes.data) {
                const res = await getSavedCards(parentRes.data.id);
                if (res.success && res.data) {
                    setCards(res.data);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load cards');
        }
        setIsLoading(false);
    }

    async function handleAddCard() {
        setIsAdding(true);
        const userId = session?.user?.id;
        const email = session?.user?.email;

        if (!userId || !email) {
            toast.error('User information missing');
            setIsAdding(false);
            return;
        }

        try {
            // 1. Initialize a small charge (e.g., 50 NGN) to authorize card
            // Note: In production you might want to refund this or use it as verification fee
            const reference = `CARD-ADD-${Date.now()}`;
            const initRes = await initializePayment({
                email,
                amount: 50, // 50 Naira
                reference,
                metadata: {
                    type: 'card_verification',
                    userId
                }
            });

            if (initRes.success && initRes.data) {
                // Open Paystack
                const popup = window.open(initRes.data.authorization_url, 'Paystack', 'width=500,height=600');

                // Poll for completion (simplified) or wait for user to close popup and then verify
                const checkInterval = setInterval(async () => {
                    if (popup?.closed) {
                        clearInterval(checkInterval);
                        toast.info('Verifying card...');

                        // Verify transaction
                        const verifyRes = await verifyPayment(reference);
                        if (verifyRes.success && verifyRes.data) {
                            const auth = verifyRes.data.authorization;

                            // Get parent profile ID again
                            const { getParentProfile } = await import('@/actions/academic');
                            const parentRes = await getParentProfile(userId);

                            if (parentRes.success && parentRes.data && auth) {
                                // Save card
                                await saveCard({
                                    parentId: parentRes.data.id,
                                    authorizationCode: auth.authorization_code,
                                    last4: auth.last4,
                                    brand: auth.brand,
                                    expMonth: auth.exp_month,
                                    expYear: auth.exp_year,
                                    bank: auth.bank,
                                    signature: auth.signature,
                                    email: email
                                });

                                toast.success('Card added successfully!');
                                fetchCards();
                            }
                        } else {
                            toast.error('Card verification failed');
                        }
                        setIsAdding(false);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to initiate card addition');
            setIsAdding(false);
        }
    }

    async function handleDelete(cardId: string) {
        if (!confirm('Are you sure you want to remove this card?')) return;

        try {
            const userId = session?.user?.id;
            const { getParentProfile } = await import('@/actions/academic');
            const parentRes = await getParentProfile(userId!);

            if (parentRes.success && parentRes.data) {
                const res = await deleteCard(cardId, parentRes.data.id);
                if (res.success) {
                    toast.success('Card removed');
                    fetchCards();
                } else {
                    toast.error('Failed to remove card');
                }
            }
        } catch (error) {
            toast.error('Error removing card');
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/settings">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Billing & Cards</h1>
                    <p className="text-slate-500 font-medium">Manage your saved payment methods</p>
                </div>
            </div>

            <Card className="border-slate-200/60 shadow-sm">
                <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-brand-600" />
                            Saved Cards
                        </h2>
                        <Button
                            onClick={handleAddCard}
                            disabled={isAdding}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
                        >
                            {isAdding ? 'Adding...' : 'Add New Card'}
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 text-slate-400">Loading cards...</div>
                    ) : cards.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No saved cards found</p>
                            <p className="text-sm text-slate-400">Add a card to speed up payments</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {cards.map((card) => (
                                <div key={card.id} className="relative group p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-slate-100 p-2 rounded-lg">
                                            {/* Ideally use brand icon */}
                                            <span className="font-bold text-slate-700 uppercase">{card.brand}</span>
                                        </div>
                                        {card.isDefault && (
                                            <Badge variant="secondary" className="bg-brand-50 text-brand-700 hover:bg-brand-100">Default</Badge>
                                        )}
                                    </div>
                                    <div className="space-y-1 mb-4">
                                        <p className="font-mono text-2xl text-slate-800 tracking-wider">•••• {card.last4}</p>
                                        <p className="text-sm text-slate-500 font-medium">Expires {card.expMonth}/{card.expYear}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                        <p className="text-xs text-slate-400 font-medium">{card.bank}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(card.id)}
                                            >
                                                <Trash className="w-4 h-4 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
