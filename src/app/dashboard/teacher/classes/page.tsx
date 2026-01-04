'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    BookOpen,
    Calendar,
    CheckCircle2,
    BarChart3,
    ArrowRight,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TeacherClassesPage() {
    const classes = [
        {
            id: '1',
            name: 'JSS 1 A',
            students: 35,
            subjects: ['Mathematics', 'Basic Science'],
            attendance: 94,
            avgPerformance: 78,
            nextClass: 'Today, 10:00 AM',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: '2',
            name: 'JSS 1 B',
            students: 32,
            subjects: ['Mathematics'],
            attendance: 91,
            avgPerformance: 72,
            nextClass: 'Tomorrow, 8:00 AM',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: '3',
            name: 'SS 2 Science',
            students: 28,
            subjects: ['Mathematics', 'Physics'],
            attendance: 96,
            avgPerformance: 85,
            nextClass: 'Today, 2:00 PM',
            color: 'from-green-500 to-green-600'
        },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        My Classes
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Overview of all classes you teach this term.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/teacher/timetable">
                        <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                            <Calendar className="w-4 h-4" /> View Timetable
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Classes</p>
                                <h3 className="text-4xl font-black text-gray-900 mt-2">{classes.length}</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Users className="w-7 h-7" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Students</p>
                                <h3 className="text-4xl font-black text-gray-900 mt-2">{classes.reduce((sum, c) => sum + c.students, 0)}</h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <BookOpen className="w-7 h-7" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Avg Attendance</p>
                                <h3 className="text-4xl font-black text-gray-900 mt-2">
                                    {Math.round(classes.reduce((sum, c) => sum + c.attendance, 0) / classes.length)}%
                                </h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Class Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {classes.map((cls) => (
                    <Card key={cls.id} className="group glass border-none shadow-soft hover:shadow-lg transition-all overflow-hidden">
                        <div className={cn("h-2 w-full bg-gradient-to-r", cls.color)} />
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                        {cls.name}
                                    </CardTitle>
                                    <div className="flex gap-2 mt-2">
                                        {cls.subjects.map((subject, i) => (
                                            <Badge key={i} variant="secondary" className="font-bold text-xs">
                                                {subject}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Badge className="bg-white/50 hover:bg-white/80 text-gray-700 border border-gray-200 font-black">
                                    {cls.students} Students
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Attendance Rate</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{cls.attendance}%</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Avg Performance</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{cls.avgPerformance}%</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <Clock className="w-4 h-4 text-amber-600" />
                                <span className="font-bold">Next Class: {cls.nextClass}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <Link href={`/dashboard/teacher/attendance?class=${cls.id}`}>
                                    <Button variant="outline" className="w-full font-bold border-gray-200 hover:bg-gray-50">
                                        <CheckCircle2 className="w-4 h-4 mr-2" /> Attendance
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/analytics/class?class=${cls.id}`}>
                                    <Button className="w-full bg-gray-900 text-white font-bold hover:bg-black">
                                        <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/teacher/class-lists?class=${cls.id}`} className="col-span-2">
                                    <Button variant="outline" className="w-full font-bold border-brand-200 text-brand-700 hover:bg-brand-50 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                        View Class List <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
