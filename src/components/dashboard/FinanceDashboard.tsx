'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Wallet,
    CreditCard,
    TrendingUp,
    Receipt,
    ArrowUpRight,
    ArrowDownRight,
    History,
    ShieldCheck,
    AlertCircle,
    DollarSign,
    PiggyBank,
    Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function FinanceDashboard() {
    const stats = [
        {
            title: 'Total Revenue',
            value: '₦12.8M',
            change: '+14% this term',
            icon: DollarSign,
            color: 'bg-emerald-500',
            trend: 'up'
        },
        {
            title: 'Wallet Balances',
            value: '₦4.2M',
            change: 'Across 142 parents',
            icon: Wallet,
            color: 'bg-blue-500',
            trend: 'up'
        },
        {
            title: 'Pending Fees',
            value: '₦1.5M',
            change: '12 outstanding',
            icon: Receipt,
            color: 'bg-amber-500',
            trend: 'down'
        },
        {
            title: 'Reconciled',
            value: '98%',
            change: 'All clear today',
            icon: ShieldCheck,
            color: 'bg-indigo-500',
            trend: 'up'
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-8 text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Financial Management
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Track institutional revenue, manage parent wallets, and fee reconciliation.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2" asChild>
                        <Link href="/dashboard/finance/reports">
                            <History className="w-4 h-4" />
                            Financial History
                        </Link>
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine" asChild>
                        <Link href="/dashboard/finance/wallets/reconcile">
                            <ShieldCheck className="w-4 h-4" />
                            Perform Reconciliation
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="glass border-none shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className={`absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/2 -translate-y-1/2`}>
                                    <Icon className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            {stat.trend === 'up' ?
                                                <ArrowUpRight className="w-3 h-3 text-emerald-600" /> :
                                                <ArrowDownRight className="w-3 h-3 text-rose-600" />
                                            }
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                stat.trend === 'up' ? "text-emerald-600" : "text-rose-600"
                                            )}>{stat.change}</p>
                                        </div>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass border-none shadow-soft overflow-hidden">
                    <CardHeader className="bg-brand-50/50 pb-4 border-b border-brand-50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Recent Transactions</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-600" asChild>
                                <Link href="/dashboard/finance/payments">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {[
                            { parent: 'Sarah Jenkins', type: 'Fee Payment', amount: '+₦45,000', time: '2 mins ago', status: 'Success' },
                            { parent: 'James Wilson', type: 'Wallet Funding', amount: '+₦100,000', time: '15 mins ago', status: 'Success' },
                            { parent: 'David Smith', type: 'Library Fine', amount: '+₦2,500', time: '1 hour ago', status: 'Pending' },
                            { parent: 'Maria Garcia', type: 'Uniform Fee', amount: '+₦15,000', time: '2 hours ago', status: 'Success' },
                        ].map((tx, i) => (
                            <div key={i} className="p-4 flex items-center justify-between border-b border-brand-50 last:border-0 hover:bg-brand-50/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm border border-gray-200">
                                        {tx.parent.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{tx.parent}</p>
                                        <p className="text-xs text-muted-foreground">{tx.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-emerald-600 text-sm">{tx.amount}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-indigo-700 to-indigo-900 text-white">
                        <CardContent className="p-6">
                            <PiggyBank className="w-8 h-8 mb-4 text-indigo-200" />
                            <h3 className="text-lg font-black leading-tight">Virtual Accounts</h3>
                            <p className="text-xs font-bold text-indigo-100/70 mt-2 mb-4">
                                142/150 parents have active virtual accounts provisioned.
                            </p>
                            <Button className="w-full bg-white text-indigo-900 hover:bg-white/90 font-black" asChild>
                                <Link href="/dashboard/finance/virtual-accounts">
                                    Manage Accounts
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">Fee Collection Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {[
                                { label: 'Tuition Fees', progress: 85, color: 'bg-emerald-500' },
                                { label: 'Facility Levy', progress: 62, color: 'bg-blue-500' },
                                { label: 'Bus Services', progress: 45, color: 'bg-amber-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-gray-700 uppercase tracking-tight">{item.label}</span>
                                        <span className="text-brand-700">{item.progress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full transition-all duration-1000", item.color)}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
