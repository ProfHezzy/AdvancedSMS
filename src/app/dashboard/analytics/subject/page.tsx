'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    PieChart,
    TrendingUp,
    BookOpen,
    Users,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

export default function SubjectPerformancePage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Subject Analysis
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Cross-class performance metrics by subject.
                    </p>
                </div>
                <Select className="w-64 h-12 rounded-xl font-bold bg-white border-brand-100">
                    <option>Mathematics</option>
                    <option>English Language</option>
                    <option>Basic Science</option>
                    <option>Civic Education</option>
                </Select>
            </div>

            {/* Subject Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft bg-indigo-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Global Average</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-3xl font-black text-gray-900">72.4%</h3>
                                <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-0.5 rounded flex items-center">
                                    <ArrowUpRight className="w-3 h-3" /> 1.2%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-pink-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Student Count</p>
                            <h3 className="text-3xl font-black text-gray-900">245</h3>
                            <p className="text-xs font-medium text-gray-400">Across 6 Classes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-cyan-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Highest Score</p>
                            <h3 className="text-3xl font-black text-gray-900">98%</h3>
                            <p className="text-xs font-medium text-gray-400">Achieved by JSS 2 A</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Comparative Performance */}
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Performance by Class</CardTitle>
                        <CardDescription>Average Mathematics scores across different streams.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 pt-4">
                            {[
                                { label: 'JSS 1 A', val: 78, color: 'bg-blue-500' },
                                { label: 'JSS 1 B', val: 72, color: 'bg-indigo-500' },
                                { label: 'JSS 2 A', val: 82, color: 'bg-purple-500' },
                                { label: 'JSS 2 B', val: 68, color: 'bg-pink-500' },
                                { label: 'SS 1 Science', val: 88, color: 'bg-amber-500' },
                                { label: 'SS 1 Arts', val: 75, color: 'bg-orange-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold text-gray-700">
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all duration-1000", item.color)}
                                            style={{ width: `${item.val}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Grade Distribution */}
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Global Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-6 p-8 w-full">
                            {[
                                { grade: 'A', range: '70-100', count: 85, color: 'bg-green-500 text-green-50' },
                                { grade: 'B', range: '60-69', count: 92, color: 'bg-blue-500 text-blue-50' },
                                { grade: 'C', range: '50-59', count: 48, color: 'bg-yellow-500 text-yellow-50' },
                                { grade: 'F', range: '0-49', count: 20, color: 'bg-red-500 text-red-50' },
                            ].map((g, i) => (
                                <div key={i} className={cn("p-6 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-sm", g.color)}>
                                    <span className="text-4xl font-black">{g.grade}</span>
                                    <span className="text-sm font-medium opacity-80">{g.range}%</span>
                                    <span className="mt-2 text-2xl font-bold bg-white/20 px-4 py-1 rounded-full">{g.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
