'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Wallet,
    Search,
    Filter,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Fingerprint,
    MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function WalletReconciliationPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleReconcile = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Wallet reconciliation completed successfully!');
        }, 2000);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Wallet Registry
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Monitor virtual accounts and reconcile parent wallet balances.
                    </p>
                </div>
                <Button
                    onClick={handleReconcile}
                    disabled={isLoading}
                    className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                >
                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    {isLoading ? 'Reconciling...' : 'Run Global Reconciliation'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Pooled Funds</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-black text-emerald-600">₦4,240,500.00</h2>
                        <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Fully Reconciled
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending Settlements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-black text-amber-600">₦12,400.00</h2>
                        <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-500" />
                            3 Transactions processing
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Virtual VAs Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-black text-brand-600">142</h2>
                        <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1">
                            <Fingerprint className="w-3 h-3 text-brand-500" />
                            Provisioned via Monnify/Paystack
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white/50 backdrop-blur rounded-3xl border border-brand-100 shadow-soft overflow-hidden">
                <div className="p-6 border-b border-brand-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by Parent Name or VA..."
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-brand-100 bg-white/50 outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-11 rounded-xl border-brand-100 font-bold gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Parent / Profile</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Virtual Account</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Wallet Balance</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Last Activity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-50">
                            {[
                                { name: 'Sarah Jenkins', email: 'sarah.j@example.com', va: '9928374821', balance: '₦54,200', time: '2 mins ago', status: 'Active' },
                                { name: 'Michael Obinna', email: 'm.obinna@example.com', va: '1029384756', balance: '₦120,400', time: '1 hour ago', status: 'Active' },
                                { name: 'David Wilson', email: 'david.w@example.com', va: '5544332211', balance: '₦5,000', time: '3 hours ago', status: 'Low' },
                                { name: 'Elizabeth Okafor', email: 'e.okafor@example.com', va: '8877665544', balance: '₦45,000', time: '1 day ago', status: 'Active' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-brand-50/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center font-black text-brand-700 text-sm">
                                                {row.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{row.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-medium">{row.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-1 rounded tracking-widest">{row.va}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={cn(
                                            "text-sm font-black",
                                            row.status === 'Low' ? "text-rose-600" : "text-emerald-600"
                                        )}>{row.balance}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-400">{row.time}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
