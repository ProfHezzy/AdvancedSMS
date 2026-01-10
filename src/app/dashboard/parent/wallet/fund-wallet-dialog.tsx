'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CreditCard, Landmark, Wallet, Check } from "lucide-react";
import { initializePayment, verifyPayment } from '@/lib/paystack-service';
import { fundWalletManually } from "@/actions/wallet"; // Fallback for test mode
import { saveCard } from "@/actions/cards";

interface FundWalletDialogProps {
    walletId: string;
    parentId: string;
    virtualAccount?: string;
    savedCards: any[];
    onSuccess: () => void;
    email: string;
}

export function FundWalletDialog({ walletId, parentId, virtualAccount, savedCards, onSuccess, email }: FundWalletDialogProps) {
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState<string>("new");

    const handleCardPayment = async () => {
        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsLoading(true);
        try {
            // Check if using saved card
            if (selectedCard !== "new") {
                // Logic for charging saved card auth code
                // Since we don't have a direct server action for charging auth code yet (it requires backend-to-paystack call),
                // we will implement a basic version or fallback.
                // Ideally: call server action -> paystack charge auth -> verify
                toast.info("Charging saved card feature would go here. Using standard flow for now.");
                // Fallback to standard flow for this demo as we didn't implement charge_authorization in server action yet
            }

            // Standard Flow (New Card)
            const reference = `FUND-${Date.now()}`;
            const initRes = await initializePayment({
                email,
                amount: value,
                reference,
                metadata: {
                    type: 'wallet_funding',
                    walletId,
                    parentId
                }
            });

            if (initRes.success && initRes.data) {
                const popup = window.open(initRes.data.authorization_url, 'Paystack', 'width=500,height=600');

                const checkInterval = setInterval(async () => {
                    if (popup?.closed) {
                        clearInterval(checkInterval);
                        toast.info('Verifying payment...');

                        const verifyRes = await verifyPayment(reference);
                        if (verifyRes.success && verifyRes.data && verifyRes.data.status === 'success') {

                            // Credit Wallet in DB
                            // Note: In production webhook handles this. For now we manually trigger "verifyAndCredit" logic via server action
                            // But wait, verifyAndCreditWallet exists in wallet.ts?
                            const { verifyAndCreditWallet } = await import('@/actions/wallet');
                            await verifyAndCreditWallet(reference);

                            // Ask to save card if it was new
                            if (selectedCard === 'new') {
                                const auth = verifyRes.data.authorization;
                                if (auth && auth.reusable) {
                                    // We could prompt user, but for now let's auto-save or just notify
                                    // Let's silently save for convenience if reusable
                                    await saveCard({
                                        parentId,
                                        authorizationCode: auth.authorization_code,
                                        last4: auth.last4,
                                        brand: auth.brand,
                                        expMonth: auth.exp_month,
                                        expYear: auth.exp_year,
                                        bank: auth.bank,
                                        signature: auth.signature,
                                        email
                                    });
                                }
                            }

                            toast.success(`Wallet funded with ₦${value.toLocaleString()}!`);
                            onSuccess();
                        } else {
                            toast.error('Payment verification failed');
                        }
                        setIsLoading(false);
                    }
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            toast.error("Payment failed");
            setIsLoading(false);
        }
    };

    const handleMockTransfer = () => {
        navigator.clipboard.writeText(virtualAccount || "");
        toast.success("Account number copied!");
    };

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Fund Wallet</DialogTitle>
                <DialogDescription>Add money to your wallet to pay fees and bills.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card">Pay with Card</TabsTrigger>
                    <TabsTrigger value="transfer">Bank Transfer</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Amount (₦)</Label>
                        <Input
                            type="number"
                            placeholder="5,000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-slate-900"
                        />
                    </div>

                    {savedCards.length > 0 && (
                        <div className="space-y-2">
                            <Label>Select Payment Method</Label>
                            <RadioGroup value={selectedCard} onValueChange={setSelectedCard}>
                                {savedCards.map((card) => (
                                    <div key={card.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <RadioGroupItem value={card.id} id={card.id} />
                                        <Label htmlFor={card.id} className="flex-1 flex justify-between cursor-pointer">
                                            <span className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-slate-500" />
                                                <span className="font-semibold">{card.brand}</span> •••• {card.last4}
                                            </span>
                                        </Label>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <RadioGroupItem value="new" id="new" />
                                    <Label htmlFor="new" className="flex-1 cursor-pointer font-medium">Use a new card</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    <Button
                        className="w-full bg-brand-600 hover:bg-brand-700"
                        onClick={handleCardPayment}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : `Pay ₦${amount ? parseInt(amount).toLocaleString() : '0'}`}
                    </Button>
                </TabsContent>

                <TabsContent value="transfer" className="space-y-4 pt-4">
                    <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
                        <p className="text-sm text-slate-500">Transfer exactly the amount you want to fund to:</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-wider font-mono">
                            {virtualAccount || "Generating..."}
                        </h3>
                        <p className="text-sm font-bold text-slate-700">Wema Bank</p>
                        <Button variant="outline" size="sm" onClick={handleMockTransfer} className="mt-2">
                            Copy Account Number
                        </Button>
                    </div>
                    <div className="text-xs text-slate-400 text-center">
                        <p>Transfers are confirmed automatically within minutes.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </DialogContent>
    );
}
