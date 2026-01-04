'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    PenTool,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronRight,
    Search,
    BookOpen
} from 'lucide-react';
import { getStudentProfile, getStudentAssignments } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export default function StudentAssignmentsPage() {
    const { data: session } = useSession();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

    useEffect(() => {
        if (session?.user?.id) {
            fetchAssignments();
        }
    }, [session]);

    async function fetchAssignments() {
        setIsLoading(true);
        const profileRes = await getStudentProfile((session?.user as any).id);
        if (profileRes.success && profileRes.data) {
            const assignRes = await getStudentAssignments(profileRes.data.id);
            if (assignRes.success && assignRes.data) {
                setAssignments(assignRes.data);
            }
        }
        setIsLoading(false);
    }

    const filteredAssignments = assignments.filter(a => {
        if (filter === 'all') return true;
        const submission = a.submissions?.[0];
        if (filter === 'pending') return !submission;
        if (filter === 'submitted') return submission && submission.status === 'PENDING';
        if (filter === 'graded') return submission && submission.status === 'GRADED';
        return true;
    });

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        My Assignments
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track your academic tasks, submissions, and feedback.
                    </p>
                </div>
                <div className="flex bg-white/50 backdrop-blur p-1 rounded-xl border border-brand-100 shadow-sm">
                    {['all', 'pending', 'submitted', 'graded'].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'ghost'}
                            size="sm"
                            className={cn(
                                "rounded-lg font-bold px-4 capitalize",
                                filter === f && "bg-brand-600 shadow-md"
                            )}
                            onClick={() => setFilter(f as any)}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="border-b border-brand-50/50">
                            <CardTitle className="text-xl font-black">Assessment Tracker</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-20 text-center animate-pulse font-black text-brand-200">
                                    SYNCING ASSIGNMENTS...
                                </div>
                            ) : filteredAssignments.length > 0 ? (
                                <div className="divide-y divide-brand-50/50">
                                    {filteredAssignments.map((a, idx) => {
                                        const submission = a.submissions?.[0];
                                        return (
                                            <div
                                                key={a.id}
                                                className="group flex items-start gap-6 p-6 hover:bg-brand-50/10 transition-all border-l-4 border-transparent hover:border-brand-600"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                                                    <PenTool className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest">{a.subject.name}</p>
                                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                                {a.title}
                                                            </h3>
                                                        </div>
                                                        <span className={cn(
                                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                            submission?.status === 'GRADED' ? "bg-green-100 text-green-700" :
                                                                submission ? "bg-brand-100 text-brand-700" : "bg-rose-100 text-rose-700 shadow-sm shadow-rose-100"
                                                        )}>
                                                            {submission?.status || 'NOT SUBMITTED'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                        <span className="flex items-center gap-1.5 text-rose-500">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            Due: {new Date(a.dueDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <AlertCircle className="w-3.5 h-3.5 text-brand-400" />
                                                            Max Score: {a.maxScore}
                                                        </span>
                                                    </div>

                                                    <div className="pt-2 flex gap-2">
                                                        <Button size="sm" className="h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2">
                                                            {submission ? 'View Submission' : 'Launch Portal'}
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                        {submission?.score && (
                                                            <div className="h-9 px-4 rounded-xl bg-green-50 text-green-700 font-black flex items-center text-sm border border-green-100">
                                                                Score: {submission.score}/{a.maxScore}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-20 text-center text-muted-foreground">
                                    <BookOpen className="w-16 h-16 text-brand-50 mx-auto mb-4" />
                                    <p className="font-bold text-gray-800">Clear! No assignments found.</p>
                                    <p className="text-sm">Check back later for new uploads.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-gradient-to-br from-rose-500 to-rose-700 text-white">
                            <CardTitle className="text-white/60 text-[10px] uppercase font-black tracking-widest">Urgent Hand-in</CardTitle>
                            <div className="text-xl font-black mt-1">Physics Lab Report</div>
                            <p className="text-xs font-bold text-white/80 mt-1">Ends in 4 Hours, 22 Mins</p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Button className="w-full h-11 rounded-xl bg-white text-rose-600 hover:bg-white/90 font-black border-none shadow-lg">
                                Complete Now
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Submission Quality</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                    <span className="text-gray-400">On-Time Rate</span>
                                    <span className="text-brand-600 font-black">98%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500" style={{ width: '98%' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                    <span className="text-gray-400">Completion Rate</span>
                                    <span className="text-green-600 font-black">100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <p className="text-xs font-bold text-muted-foreground pt-4 border-t border-brand-50">
                                You are among the top 5% of students in consistent submissions. Keep it up!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
