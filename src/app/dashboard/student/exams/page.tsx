'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Key,
    ShieldCheck,
    Clock,
    AlertCircle,
    BookOpen,
    ChevronRight,
    Search,
    Lock
} from 'lucide-react';
import { getRecentAssessments, verifyExamToken } from '@/actions/results';
import { getStudentProfile } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function StudentExamsPage() {
    const { data: session } = useSession();
    const [exams, setExams] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tokenEntries, setTokenEntries] = useState<Record<string, string>>({});

    useEffect(() => {
        if (session?.user?.id) {
            fetchExams();
        }
    }, [session]);

    async function fetchExams() {
        setIsLoading(true);
        const profileRes = await getStudentProfile((session?.user as any).id);
        if (profileRes.success && profileRes.data) {
            const examsRes = await getRecentAssessments(profileRes.data.id, false);
            if (examsRes.success && examsRes.data) {
                setExams(examsRes.data.filter((a: any) => a.type === 'EXAM' || a.type === 'TEST'));
            }
        }
        setIsLoading(false);
    }

    const handleJoinExam = async (examId: string) => {
        const token = tokenEntries[examId];
        if (!token) {
            toast.error('Please enter the examination token');
            return;
        }

        toast.promise(verifyExamToken(examId, token), {
            loading: 'Verifying token...',
            success: (data) => {
                if (data.success) {
                    return 'Token verified! Redirecting to exam...';
                }
                throw new Error(data.error);
            },
            error: (err) => err.message || 'Invalid token'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent text-balance">
                        Examination Portal
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Enter your secure token to begin your scheduled assessments.
                    </p>
                </div>
                <div className="flex bg-rose-50 border border-rose-100 p-4 rounded-2xl items-start gap-3 max-w-md">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-black text-rose-800 uppercase tracking-widest leading-none">Integrity Warning</p>
                        <p className="text-[10px] font-bold text-rose-600 mt-1">Screen recording and multi-tab browsing are strictly prohibited during active exams.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active/Upcoming List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="border-b border-brand-50/50">
                            <CardTitle className="text-xl font-black">Scheduled Assessments</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-20 text-center animate-pulse font-black text-brand-200">
                                    SYNCHRONIZING PORTAL...
                                </div>
                            ) : exams.length > 0 ? (
                                <div className="divide-y divide-brand-50/50">
                                    {exams.map((exam, idx) => (
                                        <div
                                            key={exam.id}
                                            className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 hover:bg-brand-50/10 transition-all"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex flex-col items-center justify-center text-brand-700 font-black shrink-0">
                                                <span className="text-[10px] uppercase text-brand-400">Week</span>
                                                <span className="text-2xl">08</span>
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[10px] font-black text-rose-700 uppercase tracking-widest">{exam.type}</span>
                                                    <span className="text-xs font-bold text-gray-400">{exam.subject.name}</span>
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                    {exam.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground pt-1">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Duration: 1h 30m
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        Hardware Monitoring Active
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto space-y-3">
                                                <div className="relative">
                                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Token"
                                                        maxLength={8}
                                                        className="w-full md:w-40 h-11 pl-10 pr-4 rounded-xl border border-brand-100 bg-white font-black text-brand-700 placeholder:text-gray-300 placeholder:font-bold tracking-[0.2em] outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                                        value={tokenEntries[exam.id] || ''}
                                                        onChange={(e) => setTokenEntries(prev => ({ ...prev, [exam.id]: e.target.value.toUpperCase() }))}
                                                    />
                                                </div>
                                                <Button
                                                    className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold shadow-lg shadow-brand-600/20 gap-2"
                                                    onClick={() => handleJoinExam(exam.id)}
                                                >
                                                    Start Assessment
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center text-muted-foreground">
                                    <ShieldCheck className="w-12 h-12 text-brand-100 mx-auto mb-4" />
                                    <p className="font-black text-gray-800 uppercase tracking-widest text-sm">Portal Locked</p>
                                    <p className="text-sm mt-1">No active examinations scheduled for your class today.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Secure Guidelines */}
                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                            <CardTitle className="text-white/60 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                <Key className="w-3.5 h-3.5" />
                                Secure Token Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-sm text-gray-600 space-y-4">
                            <p className="font-bold">How to join an exam:</p>
                            <ol className="space-y-3 list-decimal list-inside font-medium">
                                <li>Obtain your unique token from your subject teacher.</li>
                                <li>Locate your exam in the list and enter the 8-character token.</li>
                                <li>Ensure your internet connection is stable before launching.</li>
                                <li>The portal will automatically lock upon session start.</li>
                            </ol>
                            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-brand-600" />
                                <span className="text-xs font-black text-brand-800">Token expires 15 mins after session start.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
