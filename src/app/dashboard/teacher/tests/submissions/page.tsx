'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Target,
    Eye,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TestSubmissionsPage() {
    const [filterStatus, setFilterStatus] = useState('all');

    const submissions = [
        {
            id: '1',
            student: 'Chioma Adeyemi',
            test: 'Mid-Term Mathematics Test',
            submittedAt: '2026-01-03 10:30',
            status: 'GRADED',
            score: 45,
            maxScore: 50,
            autoGraded: true,
            avatar: 'Chioma'
        },
        {
            id: '2',
            student: 'David Okafor',
            test: 'Mid-Term Mathematics Test',
            submittedAt: '2026-01-03 10:35',
            status: 'PENDING',
            autoGraded: false,
            avatar: 'David'
        },
        {
            id: '3',
            student: 'Sarah Ibrahim',
            test: 'Mid-Term Mathematics Test',
            submittedAt: '2026-01-03 10:28',
            status: 'GRADED',
            score: 42,
            maxScore: 50,
            autoGraded: true,
            avatar: 'Sarah'
        },
    ];

    const filteredSubmissions = submissions.filter(sub =>
        filterStatus === 'all' || sub.status === filterStatus
    );

    const handleGrade = (id: string) => {
        toast.success('Test graded successfully!');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Test Submissions
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Review and grade student test submissions.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Target className="w-6 h-6" />
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
                            <p className="text-3xl font-black text-gray-900">
                                {submissions.filter(s => s.status === 'GRADED').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Avg Score</p>
                            <p className="text-3xl font-black text-gray-900">
                                {Math.round(submissions.filter(s => s.score).reduce((sum, s) => sum + (s.score! / s.maxScore! * 100), 0) / submissions.filter(s => s.score).length)}%
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
                                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.avatar}`} />
                                        <AvatarFallback>{submission.student[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{submission.student}</h3>
                                        <p className="text-sm font-medium text-gray-500">{submission.test}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge className={cn(
                                                "font-black text-xs",
                                                submission.status === 'GRADED' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                    "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                            )}>
                                                {submission.status}
                                            </Badge>
                                            {submission.autoGraded && (
                                                <Badge variant="outline" className="font-bold text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                    Auto-Graded
                                                </Badge>
                                            )}
                                            <span className="text-xs font-medium text-gray-400">
                                                {submission.submittedAt}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {submission.status === 'GRADED' && (
                                        <div className="text-right mr-4">
                                            <p className="text-2xl font-black text-green-600">
                                                {submission.score}/{submission.maxScore}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400">
                                                {Math.round((submission.score! / submission.maxScore!) * 100)}%
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => handleGrade(submission.id)}
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> {submission.status === 'GRADED' ? 'View' : 'Grade'}
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
