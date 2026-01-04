'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    BookOpen,
    Award,
    Target,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function StudentPerformancePage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Academic Summary
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Your personal academic performance hub.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft bg-brand-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Target className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 relative z-10">
                        <p className="text-xs font-black uppercase tracking-widest opacity-80">Current CGPA</p>
                        <h2 className="text-5xl font-black mt-2">4.82</h2>
                        <div className="mt-4 flex items-center gap-2">
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none gap-1">
                                <ArrowUpRight className="w-3 h-3" /> +0.15
                            </Badge>
                            <span className="text-sm font-medium opacity-80">vs Last Term</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-8">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Best Subject</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">Mathematics</h2>
                        <p className="text-sm font-medium text-gray-400 mt-1">98% Average Score</p>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-8">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                            <Award className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Class Position</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1">1st</h2>
                        <p className="text-sm font-medium text-gray-400 mt-1">Out of 45 Students</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Subject Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: 'Mathematics', score: 98, color: 'bg-blue-500' },
                            { name: 'English Language', score: 85, color: 'bg-green-500' },
                            { name: 'Basic Science', score: 92, color: 'bg-indigo-500' },
                            { name: 'Civic Education', score: 88, color: 'bg-amber-500' },
                            { name: 'Social Studies', score: 79, color: 'bg-rose-500' },
                        ].map((sub, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-gray-700">
                                    <span>{sub.name}</span>
                                    <span>{sub.score}%</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full", sub.color)}
                                        style={{ width: `${sub.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {[
                            { title: 'Math Assignment 4', type: 'Score', val: '20/20', date: '2 hrs ago', icon: Target, c: 'text-green-600', b: 'bg-green-50' },
                            { title: 'English Test 2', type: 'Result', val: 'Pending', date: 'Yesterday', icon: BookOpen, c: 'text-blue-600', b: 'bg-blue-50' },
                            { title: 'Civic Ed Project', type: 'Submission', val: 'Submitted', date: '2 days ago', icon: TrendingUp, c: 'text-purple-600', b: 'bg-purple-50' },
                        ].map((act, i) => (
                            <div key={i} className="p-6 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", act.b, act.c)}>
                                        <act.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{act.title}</h4>
                                        <p className="text-xs font-medium text-gray-400">{act.date}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className={cn("font-bold", act.val === 'Pending' ? 'bg-gray-50 text-gray-500' : 'bg-white text-brand-700')}>
                                    {act.val}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
