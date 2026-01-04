'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    PieChart,
    Save,
    Search,
    GraduationCap,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    FileText,
    TrendingUp,
    Users
} from 'lucide-react';
import { getResultsBySubject, saveResults } from '@/actions/results';
import { getTeacherSubjects } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ExaminationScoresPage() {
    const { data: session } = useSession();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchSubjects();
        }
    }, [session]);

    async function fetchSubjects() {
        const res = await getTeacherSubjects((session?.user as any).id);
        if (res.success && res.data) {
            setSubjects(res.data);
            if (res.data.length > 0) {
                setSelectedSubject(res.data[0].id);
            }
        }
    }

    useEffect(() => {
        if (selectedSubject) {
            fetchStudents();
        }
    }, [selectedSubject]);

    async function fetchStudents() {
        setIsLoading(true);
        const termId = 'default-term-id';
        const subject = subjects.find(s => s.id === selectedSubject);
        const classId = subject?.classes?.[0]?.id || 'default-class-id';

        const res = await getResultsBySubject(selectedSubject, termId, classId);
        if (res.success && res.data) {
            setStudents(res.data);
        }
        setIsLoading(false);
    }

    const handleScoreChange = (studentId: string, value: string) => {
        const score = parseFloat(value) || 0;
        if (score > 60) return; // Exam max is usually 60
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, examScore: score, total: s.caScore + score } : s
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const termId = 'default-term-id';
        const dataToSave = students.map(s => ({
            studentId: s.id,
            subjectId: selectedSubject,
            termId,
            caScore: s.caScore,
            examScore: s.examScore
        }));

        const res = await saveResults(dataToSave);
        if (res.success) {
            toast.success('Exam scores synchronized successfully!');
        } else {
            toast.error('Failed to save scores. Ensure all fields are valid.');
        }
        setIsSaving(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Examination Scores
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Finalize academic evaluations by recording summative examination outcomes.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="h-12 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                        onClick={handleSave}
                        disabled={isSaving || students.length === 0}
                    >
                        <Save className="w-5 h-5" />
                        {isSaving ? 'Synchronizing...' : 'Save Results'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Subject Selection Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50 pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Select Subject</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-2">
                            {subjects.map((sub) => (
                                <button
                                    key={sub.id}
                                    className={cn(
                                        "w-full p-4 rounded-xl flex items-center justify-between transition-all group border text-left",
                                        selectedSubject === sub.id
                                            ? "bg-brand-600 border-brand-600 text-white shadow-lg"
                                            : "bg-white border-brand-50 text-gray-700 hover:border-brand-200 hover:bg-brand-50/50"
                                    )}
                                    onClick={() => setSelectedSubject(sub.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className={cn("w-5 h-5", selectedSubject === sub.id ? "text-brand-100" : "text-brand-400")} />
                                        <span className="font-black text-sm uppercase tracking-tight">{sub.name}</span>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                        <CardContent className="p-6">
                            <TrendingUp className="w-8 h-8 mb-4 text-brand-200" />
                            <h3 className="text-lg font-black leading-tight">Automated Grading</h3>
                            <p className="text-xs font-bold text-brand-100/70 mt-2">
                                System will automatically combine CA and Exam scores to generate grade letters and performance metrics.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Score Entry Table */}
                <div className="lg:col-span-3">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <div className="bg-white/50 backdrop-blur border-b border-brand-100 p-6 flex items-center justify-between">
                            <h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-5 h-5 text-brand-500" />
                                Student Roster
                            </h3>
                            <div className="flex gap-4">
                                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    CA: 40%
                                </span>
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                    EXAM: 60%
                                </span>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-12 space-y-4">
                                    {Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="h-16 rounded-xl bg-brand-50/50 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="divide-y divide-brand-50">
                                    {students.map((student, idx) => (
                                        <div key={student.id} className="p-6 flex items-center justify-between group hover:bg-brand-50/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-700 font-black text-lg border border-brand-100 shadow-inner">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">{student.name}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2 py-0.5 rounded bg-white">CA: {student.caScore}</span>
                                                        <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest px-2 py-0.5 rounded bg-brand-50">Total: {student.total}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Exam Score (Max 60)</p>
                                                    <input
                                                        type="number"
                                                        className="w-24 h-12 bg-white border border-brand-100 rounded-xl px-4 font-black text-center text-brand-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
                                                        value={student.examScore}
                                                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                        min="0"
                                                        max="60"
                                                    />
                                                </div>
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all border",
                                                    student.total >= 70 ? "bg-green-50 text-green-600 border-green-100" :
                                                        student.total >= 50 ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                            "bg-rose-50 text-rose-600 border-rose-100"
                                                )}>
                                                    {student.grade || 'F'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
