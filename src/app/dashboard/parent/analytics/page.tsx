'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    TrendingUp,
    BookOpen,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

export default function ParentAnalyticsPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Academic Progress
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Detailed performance metrics for your wards.
                    </p>
                </div>
                <Select className="w-64 h-12 rounded-xl font-bold bg-white border-brand-100">
                    <option>Chioma Adeyemi (JSS 1 A)</option>
                    <option>Emeka Adeyemi (Basic 4)</option>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Term Average', val: '82.5%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Class Position', val: '1st', icon: AwardIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Attendance', val: '98%', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Best Subject', val: 'Math', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none shadow-soft hover:scale-[1.02] transition-transform">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> Good
                                </span>
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
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Performance Trend</CardTitle>
                        <CardDescription>Average score progression over last 3 terms.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-end justify-between px-8 pb-4 gap-8 relative">
                            {/* Simplified Chart Bars */}
                            {[
                                { term: '1st Term', val: 78, h: '78%' },
                                { term: '2nd Term', val: 80, h: '80%' },
                                { term: '3rd Term', val: 82.5, h: '82.5%' },
                            ].map((bar, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                    <div className="w-full max-w-[80px] bg-brand-100 rounded-t-xl overflow-hidden h-[250px] flex items-end relative">
                                        <div
                                            className="w-full bg-brand-600 opacity-90 group-hover:opacity-100 transition-all duration-500 rounded-t-xl relative"
                                            style={{ height: bar.h }}
                                        >
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {bar.val}%
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">{bar.term}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Subject Strengths</CardTitle>
                        <CardDescription>Comparative performance across key subjects.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: 'Mathematics', score: 98, avg: 75, color: 'bg-blue-500' },
                            { name: 'English', score: 85, avg: 72, color: 'bg-green-500' },
                            { name: 'Science', score: 92, avg: 68, color: 'bg-purple-500' },
                            { name: 'Civic Ed', score: 88, avg: 80, color: 'bg-amber-500' },
                        ].map((sub, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-gray-700">
                                    <span>{sub.name}</span>
                                    <div className="flex gap-4">
                                        <span className="text-brand-600">You: {sub.score}%</span>
                                        <span className="text-gray-400">Class Avg: {sub.avg}%</span>
                                    </div>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                                    {/* Class Avg Marker */}
                                    <div
                                        className="absolute top-0 bottom-0 w-1 bg-gray-400 z-10"
                                        style={{ left: `${sub.avg}%` }}
                                    />
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", sub.color)}
                                        style={{ width: `${sub.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AwardIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
    )
}
