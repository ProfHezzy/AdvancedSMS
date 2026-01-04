'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Layers,
    CheckCircle2,
    ChevronRight,
    Search,
    Download,
    Eye,
    Library,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SchemeOfWorkPage() {
    const subjects = [
        { name: 'Physics II', term: '2nd Term', weeks: 12, covered: 4 },
        { name: 'Mathematics', term: '2nd Term', weeks: 12, covered: 6 },
        { name: 'Further Maths', term: '2nd Term', weeks: 12, covered: 3 },
    ];

    const weeks = [
        { week: 1, topic: 'Dynamics & Motion', status: 'Completed' },
        { week: 2, topic: 'Forces & Equilibrium', status: 'Completed' },
        { week: 3, topic: 'Work, Energy, Power', status: 'Completed' },
        { week: 4, topic: 'Machine Efficiency', status: 'Completed' },
        { week: 5, topic: 'Elasticity & Stress', status: 'In-Progress' },
        { week: 6, topic: 'Mid-term Assessment', status: 'Upcoming' },
        { week: 7, topic: 'Fluid Mechanics', status: 'Upcoming' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Scheme of Work
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track curriculum coverage and term objectives for your subjects.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Export all
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subjects Selector */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Library className="w-4 h-4" />
                        Subjects Overview
                    </h2>
                    {subjects.map((s, i) => (
                        <Card key={i} className={cn(
                            "glass border-none shadow-soft cursor-pointer transition-all hover:scale-[1.02]",
                            i === 0 ? "ring-2 ring-brand-500" : ""
                        )}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black text-gray-900">{s.name}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground">{s.term} | {s.weeks} Weeks</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-brand-600">{Math.round((s.covered / s.weeks) * 100)}% Covered</p>
                                    <div className="h-1 w-20 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-brand-500" style={{ width: `${(s.covered / s.weeks) * 100}%` }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Button variant="ghost" className="w-full text-brand-600 font-bold gap-2">
                        View Archive <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Detailed Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b border-brand-50/50">
                            <div>
                                <CardTitle className="text-xl font-black">Curriculum Breakdown</CardTitle>
                                <CardDescription>Physics II - 2nd Term 2026</CardDescription>
                            </div>
                            <Button size="sm" className="bg-brand-600 hover:bg-brand-700 font-bold rounded-lg gap-2">
                                <Plus className="w-4 h-4" />
                                Add Objective
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-brand-50/50">
                                {weeks.map((w, idx) => (
                                    <div
                                        key={idx}
                                        className="group flex items-center gap-6 p-6 hover:bg-brand-50/20 transition-all"
                                    >
                                        <div className="w-16 flex-shrink-0 text-center">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">Week</p>
                                            <p className="text-2xl font-black text-brand-700">{w.week}</p>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-900 text-lg leading-tight group-hover:text-brand-700 transition-colors">
                                                {w.topic}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                                                    w.status === 'Completed' ? "bg-green-100 text-green-700" :
                                                        w.status === 'In-Progress' ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-700"
                                                )}>
                                                    {w.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="text-brand-400 hover:text-brand-600">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-brand-400 hover:text-brand-600">
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Plus(props: any) {
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
