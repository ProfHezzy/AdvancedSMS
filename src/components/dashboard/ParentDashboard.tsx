'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Wallet,
    CreditCard,
    History,
    UserCheck,
    Bell,
    ArrowUpRight,
    Megaphone,
    MessageSquare,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ParentDashboard() {
    const stats = [
        {
            title: 'Wallet Balance',
            value: '₦54,200',
            change: 'Available funds',
            icon: Wallet,
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            title: 'Wards Enrolled',
            value: '2',
            change: 'Active students',
            icon: UserCheck,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Pending Fees',
            value: '₦12,000',
            change: 'Due in 5 days',
            icon: CreditCard,
            color: 'from-rose-500 to-rose-600',
        },
        {
            title: 'Unread Alerts',
            value: '3',
            change: 'Messages & Results',
            icon: Bell,
            color: 'from-amber-500 to-amber-600',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Parent Portal
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor your wards' performance and manage financial contributions.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-2 mr-4">
                        <Button variant="outline" size="icon" className="relative h-11 w-11 glass" asChild>
                            <Link href="/dashboard/communication/announcements">
                                <Megaphone className="w-5 h-5 text-brand-600" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">4</span>
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="relative h-11 w-11 glass" asChild>
                            <Link href="/dashboard/communication/messages">
                                <MessageSquare className="w-5 h-5 text-brand-600" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
                            </Link>
                        </Button>
                    </div>
                    <Link href="/dashboard/parent/wallet" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/20 active:scale-95">
                        <Wallet className="w-4 h-4" />
                        Fund Wallet
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.title}
                            className="overflow-hidden animate-scale-in border-none shadow-soft hover:shadow-medium transition-all duration-300 glass"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle>Ward Progress</CardTitle>
                        <CardDescription>Academic snapshot of your children</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: 'John Smith', class: 'JSS 2B', performance: 88, status: 'Top 5%', color: 'from-blue-400 to-blue-600' },
                            { name: 'Sarah Smith', class: 'SS 1A', performance: 76, status: 'Improving', color: 'from-purple-400 to-purple-600' },
                        ].map((ward, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{ward.name}</h3>
                                        <p className="text-xs text-muted-foreground">{ward.class}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-brand-600">{ward.performance}%</p>
                                        <p className="text-[10px] text-green-600 font-semibold px-2 py-0.5 rounded-full bg-green-50">{ward.status}</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full bg-gradient-to-r ${ward.color}`} style={{ width: `${ward.performance}%` }}></div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button className="text-xs font-semibold text-brand-600 hover:text-brand-700">View Report Sheet</button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Payments</CardTitle>
                        <History className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { title: 'First Term Fees', amount: '-₦45,000', date: 'Jan 2, 2026', type: 'debit' },
                            { title: 'Wallet Funding', amount: '+₦50,000', date: 'Jan 1, 2026', type: 'credit' },
                            { title: 'Sport Levy', amount: '-₦5,000', date: 'Dec 20, 2025', type: 'debit' },
                        ].map((tx, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{tx.title}</p>
                                    <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                                </div>
                                <div className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.amount}
                                </div>
                            </div>
                        ))}
                        <Link href="/dashboard/parent/wallet" className="w-full mt-2 flex items-center justify-center gap-1 text-xs font-bold text-brand-600 hover:bg-brand-50 py-2 rounded-lg transition-colors">
                            Full Transaction History
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
