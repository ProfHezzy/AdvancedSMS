'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Briefcase,
    TrendingUp,
    UserPlus,
    Clock,
    PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HRMetricsPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Staff Metrics
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Human potential and workforce analysis.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Staff', val: '142', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'New Hires', val: '12', icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Retention Rate', val: '94%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Avg Attendance', val: '96%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none shadow-soft hover:scale-[1.02] transition-transform">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.val}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Department Distribution</CardTitle>
                        <CardDescription>Staff allocation across school departments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: 'Teaching Staff', count: 85, pct: 60, color: 'bg-brand-600' },
                            { name: 'Administration', count: 20, pct: 14, color: 'bg-blue-500' },
                            { name: 'Maintenance', count: 18, pct: 12, color: 'bg-amber-500' },
                            { name: 'Security', count: 12, pct: 8, color: 'bg-gray-600' },
                            { name: 'Medical', count: 7, pct: 6, color: 'bg-rose-500' },
                        ].map((dept, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-gray-700">
                                    <span>{dept.name}</span>
                                    <span>{dept.count} Staff ({dept.pct}%)</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", dept.color)}
                                        style={{ width: `${dept.pct}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Attendance Trend</CardTitle>
                        <CardDescription>30-day staff punctuality and presence overview.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-end justify-between px-2 gap-2">
                            {Array.from({ length: 15 }).map((_, i) => {
                                const height = Math.floor(Math.random() * (100 - 60 + 1) + 60);
                                return (
                                    <div key={i} className="flex-1 bg-brand-100 rounded-t-sm h-full flex items-end group relative">
                                        <div
                                            className="w-full bg-brand-400 group-hover:bg-brand-600 transition-colors rounded-t-sm"
                                            style={{ height: `${height}%` }}
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {height}% Present
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
