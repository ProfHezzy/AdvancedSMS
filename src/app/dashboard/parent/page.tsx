'use client';

import { useState, useEffect } from 'react';
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
    Info,
    GraduationCap,
    TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWards } from '@/actions/parent';
import { getParentDashboardStats } from '@/actions/dashboard'; // NEW IMPORT
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export default function ParentDashboardPage() {
    const { data: session } = useSession();
    const [wards, setWards] = useState<any[]>([]);
    const [statsData, setStatsData] = useState<any>(null); // NEW STATE
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchDashboardData();
        }
    }, [session]);

    async function fetchDashboardData() {
        setIsLoading(true);
        try {
            const userId = (session?.user as any).id;
            const [wardsRes, statsRes] = await Promise.all([
                getWards(userId),
                getParentDashboardStats(userId)
            ]);

            if (wardsRes.success && wardsRes.data) {
                setWards(wardsRes.data);
            }
            if (statsRes.success && statsRes.data) {
                setStatsData(statsRes.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
        setIsLoading(false);
    }

    const stats = [
        {
            title: 'Wallet Balance',
            value: statsData ? `₦${statsData.balance.toLocaleString()}` : '...',
            change: 'Available funds',
            icon: Wallet,
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            title: 'Wards Enrolled',
            value: statsData ? statsData.wardsCount.toString() : wards.length.toString(),
            change: 'Active students',
            icon: UserCheck,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Pending Fees',
            value: statsData ? `₦${statsData.pendingFeesAmount.toLocaleString()}` : '...',
            change: statsData ? `${statsData.pendingFeesCount} invoices due` : 'Checking...',
            icon: CreditCard,
            color: 'from-rose-500 to-rose-600',
        },
        {
            title: 'Unread Alerts',
            value: statsData ? statsData.unreadAlerts.toString() : '0',
            change: 'Messages & Results',
            icon: Bell,
            color: 'from-amber-500 to-amber-600',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-8 text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Parent Portal
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Monitor your wards' performance and manage financial contributions.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-2 mr-4">
                        <Button variant="outline" size="icon" className="relative h-11 w-11 glass border-brand-100" asChild>
                            <Link href="/dashboard/communication/announcements">
                                <Megaphone className="w-5 h-5 text-brand-600" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-sm">4</span>
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="relative h-11 w-11 glass border-brand-100" asChild>
                            <Link href="/dashboard/communication/messages">
                                <MessageSquare className="w-5 h-5 text-brand-600" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-[10px] flex items-center justify-center rounded-full font-black shadow-sm">2</span>
                            </Link>
                        </Button>
                    </div>
                    <Link href="/dashboard/parent/wallet" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-black hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/20 active:scale-95 btn-shine">
                        <Wallet className="w-4 h-4" />
                        Fund Wallet
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (

                        <Link href={stat.title === 'Pending Fees' ? '/dashboard/parent/fees' : '#'} key={stat.title} className={stat.title !== 'Pending Fees' ? 'cursor-default pointer-events-none' : ''}>
                            <Card
                                className="overflow-hidden animate-scale-in border-none shadow-soft hover:shadow-medium transition-all duration-300 glass group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-gray-800">{stat.value}</div>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">
                                        {stat.change}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Ward Progress</CardTitle>
                        <CardDescription className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Academic snapshot of your children</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isLoading ? (
                            Array(2).fill(0).map((_, i) => (
                                <div key={i} className="h-24 rounded-2xl bg-brand-50/50 animate-pulse border border-brand-100" />
                            ))
                        ) : wards.length > 0 ? (
                            wards.map((ward, i) => (
                                <div key={ward.id} className="p-5 rounded-2xl bg-white/40 border border-brand-100/50 space-y-4 hover:bg-white/60 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100 text-brand-700 font-black">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-800 uppercase tracking-tight">{ward.user.username}</h3>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{ward.class?.name || 'Class Not Assigned'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-brand-600">88% (Avg)</p>
                                            <p className="text-[10px] font-bold text-green-600 px-2 py-0.5 rounded-full bg-green-50 inline-block uppercase tracking-widest">Top 5%</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r from-blue-400 to-blue-600 w-[88%]`}></div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="link" className="text-xs font-black text-brand-600 hover:text-brand-700 p-0 h-auto gap-1">
                                            View Report Sheet
                                            <ArrowUpRight className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground italic font-medium">No wards linked to your profile.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Recent Payments</CardTitle>
                        <History className="w-5 h-5 text-brand-300" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(statsData?.recentTransactions || []).length > 0 ? (
                            statsData.recentTransactions.map((tx: any, i: number) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
                                    <div>
                                        <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{tx.title}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground">{tx.date}</p>
                                    </div>
                                    <div className={`text-xs font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-rose-600'}`}>
                                        {tx.amount}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-muted-foreground text-xs font-medium">No recent transactions</div>
                        )}
                        <Link href="/dashboard/parent/wallet" className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-black text-brand-600 hover:bg-brand-50 py-3 rounded-xl border border-brand-100 transition-all uppercase tracking-widest">
                            Full Transaction History
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
