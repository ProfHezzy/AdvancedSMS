'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BookOpen,
    ClipboardCheck,
    TrendingUp,
    Clock,
    Star,
    Target,
    Megaphone,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentDashboard({ stats: dynamicStats, isLoading }: { stats?: any, isLoading?: boolean }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
            </div>
        );
    }

    const stats = [
        {
            title: 'Current GPA',
            value: dynamicStats?.gpa?.toString() || '0.0',
            change: 'Overall average',
            icon: Star,
            color: 'from-amber-400 to-amber-500',
        },
        {
            title: 'Attendance',
            value: `${dynamicStats?.attendanceRate || 0}%`,
            change: 'Attendance standing',
            icon: Clock,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Assignments',
            value: dynamicStats?.assignmentCount?.toString() || '0',
            change: 'Pending items',
            icon: ClipboardCheck,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Subjects',
            value: dynamicStats?.subjectCount?.toString() || '0',
            change: 'Active this term',
            icon: BookOpen,
            color: 'from-purple-500 to-purple-600',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in p-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        My Learning
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Keep track of your academic progress and upcoming tests.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="relative h-10 w-10 glass" asChild>
                        <Link href="/dashboard/communication/announcements">
                            <Megaphone className="w-5 h-5 text-brand-600" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="relative h-10 w-10 glass" asChild>
                        <Link href="/dashboard/communication/messages">
                            <MessageSquare className="w-5 h-5 text-brand-600" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">1</span>
                        </Link>
                    </Button>
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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Upcoming Assessments</CardTitle>
                            <CardDescription>Don't miss these deadlines</CardDescription>
                        </div>
                        <Target className="w-5 h-5 text-brand-500" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { title: 'Mathematics Quiz', type: 'Quiz', date: 'Tomorrow, 10:00 AM', color: 'bg-amber-100 text-amber-700' },
                            { title: 'Physics Project', type: 'Project', date: 'Friday, 4:00 PM', color: 'bg-blue-100 text-blue-700' },
                            { title: 'English Mock Exam', type: 'Exam', date: 'Jan 15, 2026', color: 'bg-red-100 text-red-700' },
                        ].map((task, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-white/60 hover:border-brand-200 transition-all cursor-pointer"
                            >
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.color}`}>
                                    {task.type}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{task.title}</p>
                                    <p className="text-sm text-muted-foreground">{task.date}</p>
                                </div>
                                <Link href="/dashboard/student/assessments" className="text-brand-600 font-semibold text-sm hover:underline">
                                    Enter Token
                                </Link>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start gap-3 h-11 border-brand-100 text-brand-800" variant="outline" asChild>
                            <Link href="/dashboard/student/performance">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                My Performance
                            </Link>
                        </Button>
                        <Button className="w-full justify-start gap-3 h-11 border-brand-100 text-brand-800" variant="outline" asChild>
                            <Link href="/dashboard/communication/messages">
                                <MessageSquare className="w-4 h-4 text-brand-600" />
                                Contact Teachers
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
