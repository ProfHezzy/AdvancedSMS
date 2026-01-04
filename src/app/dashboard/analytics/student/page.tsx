'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    Award,
    BookOpen,
    User,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function StudentProgressPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Student Progress
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Detailed academic history and individual growth analysis.
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search student ID..."
                        className="pl-9 h-12 w-64 bg-white border-brand-100 rounded-xl"
                    />
                </div>
            </div>

            {/* Profile Overview */}
            <Card className="glass border-none shadow-soft">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-brand-50 flex items-center justify-center">
                        <User className="w-16 h-16 text-brand-300" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-black text-gray-900">Chioma Adeyemi</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-black uppercase tracking-widest">
                                JSS 1 A
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest">
                                ID: 2024/1001
                            </span>
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest">
                                Status: Active
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">CGPA</p>
                            <p className="text-3xl font-black text-brand-600">4.8</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Position</p>
                            <p className="text-3xl font-black text-gray-900">1st</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Attendance</p>
                            <p className="text-3xl font-black text-green-600">98%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* GPA Trend */}
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Performance Trajectory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-end justify-between px-4 pb-4 gap-4 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                <div className="border-t border-gray-400 w-full" />
                                <div className="border-t border-gray-400 w-full" />
                                <div className="border-t border-gray-400 w-full" />
                                <div className="border-t border-gray-400 w-full" />
                                <div className="border-t border-gray-400 w-full" />
                            </div>

                            {[
                                { term: 'JSS 1 T1', gpa: 4.2 },
                                { term: 'JSS 1 T2', gpa: 4.4 },
                                { term: 'JSS 1 T3', gpa: 4.5 },
                                { term: 'JSS 2 T1', gpa: 4.3 },
                                { term: 'JSS 2 T2', gpa: 4.6 },
                                { term: 'JSS 2 T3', gpa: 4.8 },
                            ].map((point, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 z-10 group">
                                    <div
                                        className="w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white shadow-lg group-hover:scale-125 transition-transform"
                                        style={{ marginBottom: `${(point.gpa / 5) * 200}px` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {point.gpa}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-500">{point.term}</span>
                                </div>
                            ))}

                            {/* Connect lines would ideally use SVG path, simplified here visually */}
                            <div className="absolute bottom-[28px] left-0 right-0 h-[200px] pointer-events-none">
                                <svg className="w-full h-full" preserveAspectRatio="none">
                                    <path
                                        d="M50 160 L 200 150 L 350 145 L 500 155 L 650 140 L 800 130"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="4"
                                        className="drop-shadow-sm"
                                    />
                                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#2563eb" />
                                        <stop offset="100%" stopColor="#4f46e5" />
                                    </linearGradient>
                                </svg>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Achievements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { title: 'Best in Mathematics', date: 'Dec 2025', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
                            { title: 'Most Punctual', date: 'Nov 2025', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
                            { title: 'Library Prefect', date: 'Sep 2025', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50' },
                        ].map((ach, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white/50 hover:bg-white transition-colors">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", ach.bg, ach.color)}>
                                    <ach.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{ach.title}</h3>
                                    <p className="text-xs font-medium text-gray-400">{ach.date}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
