'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Loader2,
    Send,
    Timer,
    AlertCircle,
    CheckCircle2,
    BookOpen,
    HelpCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { getAssessmentByToken } from '@/actions/assessments';
import { submitAssessment } from '@/actions/student-assessments';
import { getStudentProfile } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StudentAssessmentPortal() {
    const { token } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    const [assessment, setAssessment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studentProfile, setStudentProfile] = useState<any>(null);

    useEffect(() => {
        if (session?.user?.id && token) {
            initPortal();
        }
    }, [session, token]);

    async function initPortal() {
        setIsLoading(true);
        const [profRes, assessRes] = await Promise.all([
            getStudentProfile((session?.user as any).id),
            getAssessmentByToken(token as string, '') // studentId handled after profile fetch
        ]);

        if (profRes.success && profRes.data) {
            setStudentProfile(profRes.data);
            const actualAssessRes = await getAssessmentByToken(token as string, profRes.data.id);
            if (actualAssessRes.success) {
                setAssessment(actualAssessRes.data);
            } else {
                toast.error(actualAssessRes.error || 'Failed to load assessment');
            }
        }
        setIsLoading(false);
    }

    const handleSubmit = async () => {
        if (!confirm('Are you sure you want to submit your assessment? This action cannot be undone.')) return;

        setIsSubmitting(true);
        const res = await submitAssessment({
            assessmentId: assessment.id,
            studentId: studentProfile.id,
            answers: answers
        });

        if (res.success) {
            toast.success('Assessment submitted successfully!');
            router.push('/dashboard/student/assignments');
        } else {
            toast.error(res.error || 'Submission failed');
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
                <p className="font-black text-brand-200 uppercase tracking-widest animate-pulse">Initializing Portal...</p>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="p-20 text-center">
                <AlertCircle className="w-16 h-16 text-rose-300 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Access Denied</h2>
                <p className="text-muted-foreground font-medium mt-2">Invalid token or assessment not found.</p>
                <Button className="mt-6 rounded-xl bg-brand-600" asChild>
                    <a href="/dashboard/student/assignments">Return to Assignments</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest">
                                {assessment.type}
                            </span>
                            <span className="text-brand-600 font-black text-sm uppercase tracking-tighter">
                                {assessment.subject.name}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{assessment.title}</h1>
                        <p className="text-muted-foreground font-medium italic">{assessment.description || 'No specific instructions provided.'}</p>
                    </div>

                    <Card className="shadow-soft border-none bg-white p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Timer className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400">Duration</p>
                            <p className="text-sm font-black text-gray-800 tracking-tight">UNTIL DEADLINE</p>
                        </div>
                    </Card>
                </div>

                {/* Questions Section */}
                <div className="space-y-6 pb-24">
                    {assessment.questions.map((q: any, idx: number) => (
                        <Card key={q.id} className="glass border-none shadow-soft overflow-hidden">
                            <CardHeader className="bg-brand-50/30 border-b border-brand-50 pb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-sm">
                                            {idx + 1}
                                        </div>
                                        <CardTitle className="text-lg font-black text-gray-900 leading-tight">
                                            {q.text}
                                        </CardTitle>
                                    </div>
                                    <span className="text-[10px] font-black text-brand-600 bg-brand-100/50 px-2 py-1 rounded uppercase">
                                        {q.points} Points
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                {q.type === 'MULTIPLE_CHOICE' ? (
                                    <RadioGroup
                                        className="space-y-4"
                                        value={answers[q.id]}
                                        onValueChange={(val) => setAnswers({ ...answers, [q.id]: val })}
                                    >
                                        {q.options.map((opt: string, i: number) => (
                                            <div key={i} className={cn(
                                                "flex items-center space-x-3 p-4 rounded-xl border border-brand-50 hover:bg-brand-50/50 transition-all cursor-pointer",
                                                answers[q.id] === opt && "bg-brand-50 border-brand-200"
                                            )}>
                                                <RadioGroupItem value={opt} id={`${q.id}-${i}`} className="text-brand-600 border-brand-300" />
                                                <Label htmlFor={`${q.id}-${i}`} className="text-sm font-bold text-gray-700 flex-1 cursor-pointer">
                                                    {opt}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Type your answer here..."
                                            className="min-h-[120px] rounded-2xl border-brand-100 bg-gray-50/50 focus:ring-brand-500/20 font-medium"
                                            value={answers[q.id] || ''}
                                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Submit Controls (Sticky) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-brand-100 p-6 z-50">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black uppercase text-gray-400">Progress</p>
                            <p className="text-sm font-black text-brand-600 uppercase tracking-tighter">
                                {Object.keys(answers).length} / {assessment.questions.length} Answered
                            </p>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="h-14 px-10 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-xl shadow-brand-600/20 gap-3 btn-shine text-lg"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <Send className="w-6 h-6" />
                            )}
                            {isSubmitting ? 'Syncing Submission...' : 'Finish & Submit Assessment'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
