'use client';

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wallet, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { getStudentFees, payFeeFromWallet } from "@/actions/fees";
import { getParentProfile } from "@/actions/academic";
import { format } from "date-fns";

export default function FeesPage() {
    const { data: session } = useSession();
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [children, setChildren] = useState<any[]>([]);
    const [paying, setPaying] = useState<string | null>(null); // feeId being paid
    const [parentProfile, setParentProfile] = useState<any>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    async function fetchData() {
        setLoading(true);
        try {
            const userId = session?.user?.id;
            if (!userId) return;

            const parentRes = await getParentProfile(userId);
            if (parentRes.success && parentRes.data) {
                setParentProfile(parentRes.data);
                const wards = parentRes.data.students || []; // Note: Ensure 'students' is correct relation now
                setChildren(wards);

                if (wards.length > 0) {
                    setSelectedChild(wards[0].id);
                    fetchFees(wards[0].id);
                } else {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load data');
            setLoading(false);
        }
    }

    async function fetchFees(studentId: string) {
        setLoading(true);
        try {
            const res = await getStudentFees(studentId);
            if (res.success && res.data) {
                setFees(res.data);
            }
        } catch (error) {
            toast.error('Failed to fetch fees');
        }
        setLoading(false);
    }

    const handleChildChange = (childId: string) => {
        setSelectedChild(childId);
        fetchFees(childId);
    };

    const handlePay = async (fee: any) => {
        if (!parentProfile?.wallet) {
            // Should probably check wallet existence better, or rely on payFeeFromWallet error
            // Actually currently we don't have wallet loaded in state here, assumed handled in backend
        }

        if (!confirm(`Pay ₦${(fee.amount - fee.amountPaid).toLocaleString()} for ${fee.title}?`)) return;

        setPaying(fee.id);

        // Ensure wallet exists, get ID. 
        // We need wallet ID for the action. 
        // Let's assume we can get it from an action or passed parent profile (if updated to include wallet)
        // For now, let's fetch wallet ID if missing

        let walletId = parentProfile?.wallet?.id;
        if (!walletId) {
            const { getOrCreateWallet } = await import('@/actions/wallet');
            const wRes = await getOrCreateWallet(parentProfile.id);
            if (wRes.success && wRes.data) {
                walletId = wRes.data.id;
            } else {
                toast.error('Wallet not found. Please fund your wallet first.');
                setPaying(null);
                return;
            }
        }

        const res = await payFeeFromWallet({
            walletId,
            studentId: selectedChild!,
            feeId: fee.id,
            amount: fee.amount - fee.amountPaid
        });

        if (res.success) {
            toast.success('Fee payment successful!');
            fetchFees(selectedChild!);
        } else {
            toast.error(res.error || 'Payment failed');
        }
        setPaying(null);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6 pb-20">
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">School Fees</h1>
                <p className="text-slate-500 font-medium">View and pay outstanding fees for your wards</p>
            </div>

            {/* Child Selector */}
            {children.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {children.map(child => (
                        <Button
                            key={child.id}
                            onClick={() => handleChildChange(child.id)}
                            variant={selectedChild === child.id ? "default" : "outline"}
                            className="rounded-full"
                        >
                            {child.user?.name || 'Student'}
                        </Button>
                    ))}
                </div>
            )}

            {children.length === 0 && !loading && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No wards linked to your profile.</p>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {fees.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
                            <AlertCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                            <p className="text-slate-600 font-medium">No active fees for this term!</p>
                        </div>
                    ) : (
                        fees.map(fee => (
                            <Card key={fee.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-slate-800">{fee.title}</h3>
                                            {fee.mandatory && <Badge variant="secondary" className="text-xs">Mandatory</Badge>}
                                        </div>
                                        <p className="text-slate-500 text-sm mb-2">{fee.description || 'School Fee'}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Due: {fee.dueDate ? format(new Date(fee.dueDate), 'MMM d, yyyy') : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="mb-2">
                                            <p className="text-sm text-slate-400 font-medium">Amount Due</p>
                                            <p className="text-2xl font-black text-slate-900">
                                                ₦{(fee.amount - fee.amountPaid).toLocaleString()}
                                            </p>
                                            {fee.amountPaid > 0 && (
                                                <p className="text-xs text-green-600 font-medium">
                                                    Paid: ₦{fee.amountPaid.toLocaleString()}
                                                </p>
                                            )}
                                        </div>

                                        {fee.status === 'COMPLETED' || fee.status === 'PAID' ? (
                                            <Button disabled className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                                Paid
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handlePay(fee)}
                                                disabled={paying === fee.id}
                                                className="bg-brand-600 hover:bg-brand-700 w-full md:w-auto"
                                            >
                                                {paying === fee.id ? 'Processing...' : 'Pay Now'}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
