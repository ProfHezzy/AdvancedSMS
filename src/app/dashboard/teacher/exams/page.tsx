'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    ShieldCheck,
    Key,
    Clock,
    Users,
    Calendar,
    ChevronRight,
    AlertTriangle,
    BadgeCheck,
    Search,
    RefreshCw,
    Settings
} from 'lucide-react';
import { generateExamToken, getRecentAssessments } from '@/actions/results';
import { getTeacherClasses } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function TeacherExamsPage() {
    const { data: session } = useSession();
    const [exams, setExams] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchInitialData();
        }
    }, [session]);

    async function fetchInitialData() {
        setIsLoading(true);
        const userId = (session?.user as any).id;
        const [examsRes, classesRes] = await Promise.all([
            getRecentAssessments(userId, true),
            getTeacherClasses(userId)
        ]);

        if (examsRes.success && examsRes.data) setExams(examsRes.data);
        if (classesRes.success && classesRes.data) setClasses(classesRes.data);
        setIsLoading(false);
    }

    async function handleGenerateToken(examId: string) {
        toast.promise(generateExamToken(examId), {
            loading: 'Generating secure token...',
            success: (res) => {
                if (res.success) {
                    setExams(prev => prev.map(e => e.id === examId ? { ...e, token: res.token } : e));
                    return `Token generated: ${res.token}`;
                }
                throw new Error('Failed');
            },
            error: 'Failed to generate token'
        });
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Exam Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Schedule assessments and manage secure entry tokens.
                    </p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2"
                    onClick={() => setIsCreating(true)}
                >
                    <Plus className="w-5 h-5" />
                    Schedule New Assessment
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Security Status */}
                <Card className="lg:col-span-1 glass border-none shadow-soft text-white overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-900 -z-10" />
                    <CardHeader>
                        <CardTitle className="text-brand-200 text-xs uppercase tracking-widest font-black flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Security Protocol
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-black mb-1">Active Token Vault</h3>
                            <p className="text-xs text-white/50 font-bold">Only students with valid unique tokens can enter examination portals.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase text-white/40">
                                <span>Integrity Check</span>
                                <span className="text-green-400">PASSED</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-full" />
                            </div>
                        </div>
                        <Button className="w-full bg-white text-brand-900 font-black hover:bg-brand-50 rounded-xl h-11 border-none">
                            Audit Security Logs
                        </Button>
                    </CardContent>
                </Card>

                {/* Main Schedule */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-50/50 pb-6">
                            <div>
                                <CardTitle className="text-xl font-black">Upcoming Assessments</CardTitle>
                                <CardDescription>Manage and authorize scheduled examinations.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Filter results..."
                                        className="h-10 pl-10 pr-4 rounded-lg bg-white/50 border border-brand-100 text-xs outline-none focus:ring-2 focus:ring-brand-500 w-48"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-20 text-center animate-pulse font-black text-brand-200 uppercase tracking-widest">
                                    Loading Exam Registry...
                                </div>
                            ) : (
                                <div className="divide-y divide-brand-50/50">
                                    {exams.map((exam, idx) => (
                                        <div
                                            key={exam.id}
                                            className="group flex flex-col md:flex-row md:items-center gap-6 p-6 hover:bg-brand-50/10 transition-all"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                        exam.type === 'EXAM' ? "bg-rose-100 text-rose-700" : "bg-brand-100 text-brand-700"
                                                    )}>
                                                        {exam.type}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{exam.class.name}</span>
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                    {exam.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {exam.dueDate ? new Date(exam.dueDate).toLocaleDateString() : 'No date set'}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-3.5 h-3.5" />
                                                        32 Students
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3">
                                                {exam.type === 'EXAM' && (
                                                    <div className="flex items-center gap-2">
                                                        {exam.token ? (
                                                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                                                <span className="text-[10px] font-black uppercase text-green-600">Secure Token</span>
                                                                <code className="text-lg font-black text-green-700 tracking-[0.2em]">{exam.token}</code>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                className="rounded-xl border-dashed border-2 border-brand-200 text-brand-600 font-black gap-2 h-12"
                                                                onClick={() => handleGenerateToken(exam.id)}
                                                            >
                                                                <Key className="w-4 h-4" />
                                                                Generate Entry Token
                                                            </Button>
                                                        )}
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-brand-300 hover:text-brand-600" onClick={() => handleGenerateToken(exam.id)}>
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex gap-2">
                                                    <Button variant="outline" className="h-10 px-4 rounded-xl border-brand-100 text-brand-700 font-bold hover:bg-brand-50" asChild>
                                                        <Link href={`/dashboard/teacher/assessments/${exam.id}/questions`}>
                                                            <Settings className="w-4 h-4 mr-2" />
                                                            Manage Questions
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" className="text-brand-600 font-bold gap-1 hover:bg-brand-50 px-4">
                                                        Edit Details <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {exams.length === 0 && (
                                        <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4">
                                            <Calendar className="w-12 h-12 text-brand-100" />
                                            <p className="font-bold text-gray-800 uppercase tracking-widest text-sm">No assessments found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
