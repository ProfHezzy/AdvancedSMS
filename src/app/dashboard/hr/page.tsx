'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Briefcase,
    Calendar,
    UserPlus,
    Clock,
    Banknote,
    TrendingUp,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getHRDashboardStats } from '@/actions/staff';

export default function HRDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        setIsLoading(true);
        const res = await getHRDashboardStats();
        if (res.success && res.data) {
            setStats(res.data);
        }
        setIsLoading(false);
    }

    const statCards = [
        {
            title: 'Total Staff',
            value: stats?.totalStaff || '0',
            change: 'Active employees',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Departments',
            value: Object.keys(stats?.departmentCounts || {}).length || '0',
            change: 'Active units',
            icon: Briefcase,
            color: 'bg-purple-500'
        },
        {
            title: 'On Leave',
            value: stats?.onLeave || '0',
            change: 'Returning soon',
            icon: Calendar,
            color: 'bg-amber-500'
        },
        {
            title: 'Payroll',
            value: stats?.payrollStatus || 'Pending',
            change: 'Due in 3 days',
            icon: Banknote,
            color: 'bg-green-500'
        },
    ];

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Human Resources
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage workforce dynamics, recruitment, and staff welfare.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Clock className="w-4 h-4" />
                        Attendance Log
                    </Button>
                    <Link href="/dashboard/hr/staff">
                        <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                            <UserPlus className="w-4 h-4" />
                            Manage Staff
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => {
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
                                        <p className="text-[10px] font-bold text-brand-600 mt-1 uppercase tracking-wider">{stat.change}</p>
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
                            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Department Breakdown</CardTitle>
                            <Link href="/dashboard/hr/staff">
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-600">View Directory</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {Object.entries(stats?.departmentCounts || {}).map(([role, count]: [string, any]) => (
                            <div key={role} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-brand-400 group-hover:scale-150 transition-all" />
                                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wider">{role}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-500 rounded-full"
                                            style={{ width: `${(count / (stats?.totalStaff || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="font-black text-gray-900 w-8 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft bg-gradient-to-br from-brand-700 to-brand-900 text-white">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <TrendingUp className="w-8 h-8 text-brand-200" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Performance Review</h3>
                            <p className="text-sm font-medium text-brand-100/80 mt-2">
                                Q1 Reviews are pending for some staff members.
                            </p>
                        </div>
                        <Button className="w-full bg-white text-brand-900 hover:bg-brand-50 font-black">
                            Start Reviews
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
