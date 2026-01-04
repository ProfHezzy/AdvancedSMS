'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Eye,
    CheckCircle2,
    Download,
    BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExamSubmissionsPage() {
    const [filterStatus, setFilterStatus] = useState('all');

    const submissions = [
        {
            id: '1',
            student: 'Chioma Adeyemi',
            exam: 'First Term Mathematics Exam',
            submittedAt: '2026-01-02 09:30',
            status: 'GRADED',
            score: 88,
            maxScore: 100,
            avatar: 'Chioma'
        },
        {
            id: '2',
            student: 'David Okafor',
            exam: 'First Term Mathematics Exam',
            submittedAt: '2026-01-02 09:35',
            status: 'PENDING',
            avatar: 'David'
        },
        {
            id: '3',
            student: 'Sarah Ibrahim',
            exam: 'First Term Mathematics Exam',
            submittedAt: '2026-01-02 09:28',
            status: 'GRADED',
            score: 92,
            maxScore: 100,
            avatar: 'Sarah'
        },
        {
            id: '4',
            student: 'Michael Bassey',
            exam: 'First Term Mathematics Exam',
            submittedAt: '2026-01-02 09:40',
            status: 'GRADED',
            score: 85,
            maxScore: 100,
            avatar: 'Michael'
        },
    ];

    const filteredSubmissions = submissions.filter(sub =>
        filterStatus === 'all' || sub.status === filterStatus
    );

    const gradedSubmissions = submissions.filter(s => s.status === 'GRADED');
    const avgScore = gradedSubmissions.length > 0
        ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.score! / s.maxScore! * 100), 0) / gradedSubmissions.length)
        : 0;

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Exam Submissions
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Review and grade final examination submissions.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2">
                    <Download className="w-5 h-5" /> Export Results
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total</p>
                            <p className="text-3xl font-black text-gray-900">{submissions.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Graded</p>
                            <p className="text-3xl font-black text-gray-900">{gradedSubmissions.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Avg Score</p>
                            <p className="text-3xl font-black text-gray-900">{avgScore}%</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Pending</p>
                            <p className="text-3xl font-black text-gray-900">
                                {submissions.filter(s => s.status === 'PENDING').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'PENDING', 'GRADED'].map((status) => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'default' : 'outline'}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                            "font-bold",
                            filterStatus === status ? "bg-brand-600 text-white" : "border-gray-200"
                        )}
                    >
                        {status === 'all' ? 'All' : status}
                    </Button>
                ))}
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="glass border-none shadow-soft hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.avatar}`} />
                                        <AvatarFallback className="text-lg font-black">{submission.student[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-900 text-lg">{submission.student}</h3>
                                        <p className="text-sm font-medium text-gray-500">{submission.exam}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge className={cn(
                                                "font-black text-xs",
                                                submission.status === 'GRADED' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                    "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                            )}>
                                                {submission.status}
                                            </Badge>
                                            <span className="text-xs font-medium text-gray-400">
                                                Submitted: {submission.submittedAt}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {submission.status === 'GRADED' && (
                                        <div className="text-center bg-green-50 px-6 py-3 rounded-xl border border-green-100">
                                            <p className="text-3xl font-black text-green-600">
                                                {submission.score}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400">
                                                / {submission.maxScore} ({Math.round((submission.score! / submission.maxScore!) * 100)}%)
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-black h-12 px-6"
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> {submission.status === 'GRADED' ? 'Review' : 'Grade Now'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
