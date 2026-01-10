'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ChevronLeft,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    FileText,
    ExternalLink,
    Save,
    Loader2,
    BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAssessmentDetails, gradeSubmission } from '@/actions/assessments';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AssessmentSubmissionsPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [assessment, setAssessment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [gradeValue, setGradeValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id) fetchDetails();
    }, [id]);

    async function fetchDetails() {
        setIsLoading(true);
        const res = await getAssessmentDetails(id as string);
        if (res.success) {
            setAssessment(res.data);
        } else {
            toast.error(res.error || 'Failed to load submissions');
        }
        setIsLoading(false);
    }

    const handleGrade = async () => {
        if (!selectedSubmission || !gradeValue) return;

        setIsSaving(true);
        const res = await gradeSubmission({
            submissionId: selectedSubmission.id,
            score: parseFloat(gradeValue),
            graderId: (session?.user as any).id
        });

        if (res.success) {
            toast.success('Grade recorded successfully');
            setSelectedSubmission(null);
            setGradeValue('');
            fetchDetails();
        } else {
            toast.error(res.error || 'Failed to save grade');
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    if (!assessment) return <div className="p-8 text-center">Assessment not found</div>;

    const submissions = assessment.submissions || [];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/teacher/assignments">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{assessment.title}</h1>
                        <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-widest border border-brand-100">
                            {assessment.subject.name}
                        </span>
                    </div>
                    <p className="text-muted-foreground font-medium italic mt-1">
                        {assessment.class.name} • {submissions.length} Submissions
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Submission List */}
                <Card className="lg:col-span-5 glass border-none shadow-soft overflow-hidden">
                    <CardHeader className="bg-brand-50/50 border-b border-brand-50">
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Submission Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-brand-50/50">
                            {submissions.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground font-medium italic">
                                    No submissions yet.
                                </div>
                            ) : (
                                submissions.map((sub: any) => (
                                    <div
                                        key={sub.id}
                                        onClick={() => setSelectedSubmission(sub)}
                                        className={cn(
                                            "p-4 cursor-pointer hover:bg-brand-50/20 transition-all flex items-center justify-between group",
                                            selectedSubmission?.id === sub.id && "bg-brand-50 border-r-4 border-brand-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-500">
                                                {sub.student.user.name?.charAt(0) || sub.student.user.username.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800">{sub.student.user.name || sub.student.user.username}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                                    {new Date(sub.submittedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {sub.status === 'GRADED' ? (
                                                <span className="text-xs font-black text-green-600">{sub.score} / {assessment.maxScore}</span>
                                            ) : (
                                                <span className="text-[10px] font-black text-brand-600 uppercase bg-brand-50 px-2 py-0.5 rounded">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Grading Panel */}
                <div className="lg:col-span-7">
                    {selectedSubmission ? (
                        <Card className="glass border-none shadow-medium animate-in slide-in-from-right-4 duration-300">
                            <CardHeader className="border-b border-brand-50 pb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl font-black uppercase tracking-tight">Grade Submission</CardTitle>
                                        <CardDescription className="font-medium">
                                            Reviewing student: <span className="text-brand-700 font-bold">{selectedSubmission.student.user.name || selectedSubmission.student.user.username}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl border-brand-100 font-bold">
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Logs
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <section className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <BookOpen className="w-3 h-3" /> Submission Content
                                    </h4>
                                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 font-medium text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[150px]">
                                        {selectedSubmission.content || "No text content provided."}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end p-6 rounded-2xl bg-brand-50/30 border border-brand-100">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-700">Assign Score (Max: {assessment.maxScore})</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                max={assessment.maxScore}
                                                className="h-12 text-xl font-black rounded-xl border-brand-200 focus:ring-brand-500/20"
                                                placeholder="0.0"
                                                value={gradeValue || (selectedSubmission.status === 'GRADED' ? selectedSubmission.score : '')}
                                                onChange={e => setGradeValue(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleGrade}
                                        disabled={isSaving || !gradeValue}
                                        className="h-12 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                                    >
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {selectedSubmission.status === 'GRADED' ? 'Update Grade' : 'Finalize Grade'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center mb-6">
                                <User className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Select a Submission</h3>
                            <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2 italic">
                                Click on a student from the list to review their work and award marks.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
