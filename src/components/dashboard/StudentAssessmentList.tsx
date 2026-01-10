'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    PenTool,
    Calendar,
    ChevronRight,
    AlertCircle,
    Target,
    FileText,
    ClipboardList,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AssessmentListProps {
    title: string;
    description: string;
    assessments: any[];
    isLoading: boolean;
    type: 'ASSIGNMENT' | 'TEST' | 'EXAM';
    emptyMessage?: string;
}

export default function StudentAssessmentList({
    title,
    description,
    assessments,
    isLoading,
    type,
    emptyMessage = "No assessments found in this category."
}: AssessmentListProps) {

    const getIcon = () => {
        switch (type) {
            case 'ASSIGNMENT': return <ClipboardList className="w-6 h-6" />;
            case 'TEST': return <Target className="w-6 h-6" />;
            case 'EXAM': return <FileText className="w-6 h-6" />;
            default: return <PenTool className="w-6 h-6" />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    {title}
                </h1>
                <p className="text-muted-foreground font-medium">{description}</p>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="border-b border-brand-50/50">
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        {getIcon()}
                        Assessment Explorer
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-20 text-center animate-pulse font-black text-brand-200">
                            SYNCING DATA...
                        </div>
                    ) : assessments.length > 0 ? (
                        <div className="divide-y divide-brand-50/50">
                            {assessments.map((a) => {
                                const submission = a.submissions?.[0];
                                return (
                                    <div
                                        key={a.id}
                                        className="group flex items-start gap-6 p-6 hover:bg-brand-50/10 transition-all border-l-4 border-transparent hover:border-brand-600"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 shadow-sm border border-brand-100">
                                            {getIcon()}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest leading-none mb-1">{a.subject?.name}</p>
                                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                        {a.title}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                        submission?.status === 'GRADED' ? "bg-green-100 text-green-700" :
                                                            submission ? "bg-brand-100 text-brand-700" : "bg-rose-100 text-rose-700 shadow-sm shadow-rose-100"
                                                    )}>
                                                        {submission?.status || 'PENDING ACTION'}
                                                    </span>
                                                    {submission?.score && (
                                                        <span className="text-xs font-black text-green-700">
                                                            Score: {submission.score}/{a.points || a.maxScore || 100}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                <span className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Due: {new Date(a.dueDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-gray-500">
                                                    <UserCircle className="w-3.5 h-3.5 text-brand-400" />
                                                    Tutor: {a.teacher?.user?.name || 'Assigned Staff'}
                                                </span>
                                            </div>

                                            <div className="pt-2">
                                                <Link href={`/dashboard/student/assessments/${a.id}`}>
                                                    <Button size="sm" className="h-9 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2">
                                                        {submission ? 'View Feedback' : 'Launch Portal'}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-20 text-center text-muted-foreground bg-brand-50/5">
                            <PenTool className="w-16 h-16 text-brand-100 mx-auto mb-4 opacity-50" />
                            <p className="font-bold text-gray-800 tracking-tight text-xl">Assessment Deck Clear!</p>
                            <p className="text-sm font-medium mt-1 uppercase tracking-widest opacity-60">{emptyMessage}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function UserCircle(props: any) {
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
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
        </svg>
    )
}
