'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Users,
    BookOpen,
    Clock,
    CheckCircle2,
    Plus,
    Calendar,
    Megaphone,
    MessageSquare
} from 'lucide-react';

const stats = [
    { title: 'My Students', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Subjects', value: '4', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Pending Gradings', value: '18', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Class Attendance', value: '94%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
];

const pendingGradings = [
    { id: '1', student: 'John Doe', subject: 'Mathematics', type: 'Assignment 1', date: '2 hours ago' },
    { id: '2', student: 'Jane Smith', subject: 'Mathematics', type: 'Algebra Quiz', date: '5 hours ago' },
];

export default function TeacherDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-8">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-700 to-brand-900 bg-clip-text text-transparent">
                        Teacher Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Academic Year 2025/2026 • First Term
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="relative h-10 w-10 glass">
                        <Megaphone className="w-5 h-5 text-brand-600" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
                    </Button>
                    <Button variant="outline" size="icon" className="relative h-10 w-10 glass">
                        <MessageSquare className="w-5 h-5 text-brand-600" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">5</span>
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="glass border-white/20 hover:shadow-hard transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                                <p className="text-xs text-muted-foreground pt-1">
                                    <span className="text-green-600 font-medium">↑ 4%</span> vs last month
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                {/* Recent Submissions */}
                <Card className="lg:col-span-4 glass border-white/20 shadow-hard">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pending Gradings</CardTitle>
                            <CardDescription>Assessments waiting for your review.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/assignments">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {pendingGradings.map((grading) => (
                                <div key={grading.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                                            {grading.student.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{grading.student}</p>
                                            <p className="text-sm text-muted-foreground">{grading.subject} • {grading.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground mb-2">{grading.date}</p>
                                        <Button size="sm" variant="outline" className="h-8 border-brand-200 text-brand-700">Grade Now</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="lg:col-span-2 glass border-white/20 shadow-hard">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Shortcut to common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
                            <Link href="/dashboard/results">
                                <Plus className="w-5 h-5 text-brand-600" />
                                Record Results
                            </Link>
                        </Button>
                        <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
                            <Link href="/dashboard/assignments">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                                Create Assignment
                            </Link>
                        </Button>
                        <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
                            <Link href="/dashboard/communication/announcements">
                                <Megaphone className="w-5 h-5 text-blue-500" />
                                Announcements
                            </Link>
                        </Button>
                        <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
                            <Link href="/dashboard/communication/messages">
                                <MessageSquare className="w-5 h-5 text-green-500" />
                                Messages
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
