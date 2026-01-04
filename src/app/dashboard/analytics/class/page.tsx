'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

export default function ClassPerformancePage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Class Performance
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Analytical insights into academic progression and attendance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select className="w-40 h-12 rounded-xl font-bold bg-white border-brand-100">
                        <option>JSS 1 A</option>
                        <option>JSS 1 B</option>
                        <option>SS 3 Science</option>
                    </Select>
                    <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                        <Calendar className="w-4 h-4" /> 2025/2026 Term 1
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'Class Average', value: '68.5%', trend: '+2.4%', up: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Pass Rate', value: '92.1%', trend: '-0.5%', up: false, icon: PieChart, color: 'text-green-600', bg: 'bg-green-50' },
                    { title: 'Attendance', value: '95.4%', trend: '+1.2%', up: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { title: 'Top Subject', value: 'Math', sub: '85% Avg', up: true, icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map((kpi, i) => (
                    <Card key={i} className="glass border-none shadow-soft hover:scale-[1.02] transition-transform">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", kpi.bg, kpi.color)}>
                                    <kpi.icon className="w-6 h-6" />
                                </div>
                                <div className={cn("px-2 py-1 rounded text-xs font-black flex items-center gap-1", kpi.up ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700")}>
                                    {kpi.trend && (kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />)}
                                    {kpi.trend || 'N/A'}
                                </div>
                            </div>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">{kpi.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{kpi.value}</h3>
                            {kpi.sub && <p className="text-sm font-medium text-gray-400 mt-1">{kpi.sub}</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Subject Performance Distribution</CardTitle>
                        <CardDescription>Average scores across all subjects for this class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-end justify-between gap-4 px-4 pb-4">
                            {[
                                { label: 'Math', val: 85, h: '85%' },
                                { label: 'Eng', val: 72, h: '72%' },
                                { label: 'Sci', val: 64, h: '64%' },
                                { label: 'Civic', val: 78, h: '78%' },
                                { label: 'Geo', val: 55, h: '55%' },
                                { label: 'Hist', val: 68, h: '68%' },
                                { label: 'Agri', val: 90, h: '90%' },
                            ].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                    <div className="relative w-full bg-brand-50 rounded-t-xl overflow-hidden h-[250px] flex items-end">
                                        <div
                                            className="w-full bg-brand-600 opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-t-xl relative"
                                            style={{ height: bar.h }}
                                        >
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {bar.val}%
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-8">
                        <div className="relative w-48 h-48 rounded-full border-[16px] border-brand-50 flex items-center justify-center">
                            {/* Mock Pie Placeholder with Segments using CSS clip-path or simple conic-gradient */}
                            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#22c55e 0% 35%, #3b82f6 35% 60%, #eab308 60% 85%, #f43f5e 85% 100%)' }} />
                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center z-10">
                                <span className="text-3xl font-black text-gray-900">45</span>
                                <span className="text-xs uppercase font-bold text-gray-400">Students</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-8">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm font-bold text-gray-600">A (35%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm font-bold text-gray-600">B (25%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-sm font-bold text-gray-600">C (25%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-sm font-bold text-gray-600">F (15%)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
