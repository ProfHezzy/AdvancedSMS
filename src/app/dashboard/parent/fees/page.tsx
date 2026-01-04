'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CreditCard,
    Download,
    Wallet,
    ChevronRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    TrendingUp,
    FileText,
    Receipt
} from 'lucide-react';
import { getWardInvoices, payFee } from '@/actions/parent';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ParentFeesPage({ searchParams }: { searchParams: { ward?: string } }) {
    const { data: session } = useSession();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const wardId = searchParams.ward || 'ward-1'; // Default or from params

    useEffect(() => {
        fetchInvoices();
    }, [wardId]);

    async function fetchInvoices() {
        setIsLoading(true);
        const res = await getWardInvoices(wardId);
        if (res.success && res.data) {
            setInvoices(res.data);
        }
        setIsLoading(false);
    }

    const handlePay = async (invoiceId: string, amount: number) => {
        toast.promise(payFee(wardId, invoiceId, amount), {
            loading: 'Processing payment...',
            success: 'Fee paid successfully!',
            error: 'Payment failed'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        School Fees & Wallet
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your school commitments and view payment history.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Receipt className="w-4 h-4" />
                        Transactions
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2">
                        <Wallet className="w-5 h-5" />
                        Fund Wallet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Wallet & Quick Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass border-none shadow-soft text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800 -z-10" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-brand-100 text-[10px] uppercase tracking-widest font-black">Available Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">$1,240.50</div>
                            <div className="flex items-center gap-2 mt-4 text-xs font-bold text-brand-100/80">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Last funded: Dec 20, 2025
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Payment Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Tuition</span>
                                <span className="text-sm font-black text-gray-900">$450.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Science Lab</span>
                                <span className="text-sm font-black text-gray-900">$50.00</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-brand-50 pt-4">
                                <span className="text-xs font-black text-brand-600">Total Outstanding</span>
                                <span className="text-sm font-black text-rose-600">$450.00</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoices List */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="border-b border-brand-50/50 pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black">Active Invoices</CardTitle>
                                    <CardDescription>Termly disbursements for Alice Johnson</CardDescription>
                                </div>
                                <Button variant="ghost" className="text-brand-600 font-bold gap-2">
                                    <FileText className="w-4 h-4" />
                                    Download Statement
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-20 text-center animate-pulse font-black text-brand-200">
                                    SYNCHRONIZING FINANCIALS...
                                </div>
                            ) : (
                                <div className="divide-y divide-brand-50/50">
                                    {invoices.map((inv, idx) => (
                                        <div
                                            key={inv.id}
                                            className="group flex flex-col md:flex-row md:items-center gap-6 p-6 hover:bg-brand-50/10 transition-all"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-black border border-brand-100 shadow-inner group-hover:scale-110 transition-transform">
                                                <Receipt className="w-6 h-6" />
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
                                                    <span className={cn(
                                                        inv.status === 'PAID' ? "text-green-600" : "text-rose-500"
                                                    )}>{inv.status}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-gray-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                    {inv.description}
                                                </h3>
                                                <p className="text-sm font-bold text-gray-500">Invoice ID: {inv.id.toUpperCase()}</p>
                                            </div>

                                            <div className="w-full md:w-auto flex flex-col md:items-end gap-3">
                                                <div className="text-2xl font-black text-gray-900">${inv.amount.toFixed(2)}</div>
                                                {inv.status === 'PENDING' ? (
                                                    <Button
                                                        className="w-full md:w-auto h-11 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                                                        onClick={() => handlePay(inv.id, inv.amount)}
                                                    >
                                                        Pay Now
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-green-600 font-black bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-xs">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Payment Confirmed
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
                        <div>
                            <p className="font-black text-rose-900">Late Payment Warning</p>
                            <p className="text-sm font-medium text-rose-700 mt-1">
                                Invoices overdue by more than 30 days attract a 5% institutional maintenance charge.
                                Please ensure all balances are settled before the start of the final exams.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
