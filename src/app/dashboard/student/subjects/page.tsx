'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    BookOpen,
    MoreHorizontal,
    Clock,
    FileText,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function StudentSubjectsPage() {
    const subjects = [
        { name: 'Mathematics', code: 'MTH', teacher: 'Mrs. Okon', periods: 4, progress: 65, color: 'bg-blue-500' },
        { name: 'English Language', code: 'ENG', teacher: 'Mr. David', periods: 4, progress: 72, color: 'bg-green-500' },
        { name: 'Basic Science', code: 'BSC', teacher: 'Dr. Sarah', periods: 3, progress: 45, color: 'bg-purple-500' },
        { name: 'Civic Education', code: 'CVE', teacher: 'Mr. James', periods: 2, progress: 80, color: 'bg-amber-500' },
        { name: 'Social Studies', code: 'SOS', teacher: 'Mrs. Justina', periods: 2, progress: 55, color: 'bg-rose-500' },
        { name: 'Physical Health Ed.', code: 'PHE', teacher: 'Coach P.', periods: 2, progress: 90, color: 'bg-indigo-500' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    My Subjects
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Enrolled courses and syllabus tracking.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((sub, i) => (
                    <Card key={i} className="group glass border-none shadow-soft hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden">
                        <div className={cn("h-2 w-full", sub.color)} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Badge variant="secondary" className="font-black text-xs uppercase tracking-widest bg-gray-100 text-gray-600">
                                {sub.code}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                    {sub.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-4">
                                    <Avatar className="w-8 h-8 border border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sub.teacher}`} />
                                        <AvatarFallback>{sub.teacher[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Teacher</p>
                                        <p className="text-sm font-bold text-gray-800">{sub.teacher}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-brand-500" />
                                    <span>{sub.periods} Periods/Wk</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <span>Syllabus Covered</span>
                                    <span>{sub.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", sub.color)}
                                        style={{ width: `${sub.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <Button className="flex-1 bg-gray-900 text-white font-bold h-10 rounded-lg hover:bg-black group-hover:bg-brand-600 transition-colors">
                                    <BookOpen className="w-4 h-4 mr-2" /> Resources
                                </Button>
                                <Button variant="outline" className="flex-1 font-bold h-10 rounded-lg border-gray-200 hover:bg-gray-50">
                                    <FileText className="w-4 h-4 mr-2" /> Assignments
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
