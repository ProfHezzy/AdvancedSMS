'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    Save,
    Search,
    GraduationCap,
    BookOpen,
    Filter,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import { getResultsBySubject, saveResults } from '@/actions/results';
import { getTeacherSubjects } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ContinuousAssessmentPage() {
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
        // Using sample data for termId and classId if not readily available
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
        if (score > 40) return; // CA max is usually 40
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, caScore: score } : s
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
            toast.success('CA scores synchronized successfully!');
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
                        Continuous Assessment
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Log and monitor student performance benchmarks throughout the academic term.
                    </p>
                </div>
                <Button
                    className="h-12 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    onClick={handleSave}
                    disabled={isSaving || students.length === 0}
                >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Sychronizing...' : 'Save Changes'}
                </Button>
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
                                        <BookOpen className={cn("w-5 h-5", selectedSubject === sub.id ? "text-brand-100" : "text-brand-400")} />
                                        <span className="font-black text-sm uppercase tracking-tight">{sub.name}</span>
                                    </div>
                                    <ChevronRight className={cn("w-4 h-4 transition-transform", selectedSubject === sub.id ? "translate-x-1" : "text-gray-300 group-hover:translate-x-1")} />
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-none mb-1">Grading Alert</p>
                            <p className="text-xs font-bold text-amber-700/80 leading-relaxed">
                                Continuous Assessment scores are capped at <span className="text-amber-900">40 marks</span> as per institutional standards.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Score Entry Table */}
                <div className="lg:col-span-3">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <div className="bg-white/50 backdrop-blur border-b border-brand-100 p-6 flex items-center justify-between">
                            <h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-5 h-5 text-brand-500" />
                                Student Roster
                            </h3>
                            <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                {students.length} Students Assigned
                            </span>
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
                                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-black text-xs border border-brand-100 shadow-inner">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">{student.name}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">STD-ID: {student.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">CA Score (Max 40)</p>
                                                    <input
                                                        type="number"
                                                        className="w-24 h-12 bg-white border border-brand-100 rounded-xl px-4 font-black text-center text-brand-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
                                                        value={student.caScore}
                                                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                        min="0"
                                                        max="40"
                                                    />
                                                </div>
                                                <div className="w-12 h-12 rounded-xl bg-brand-50/50 border border-brand-100 flex items-center justify-center text-brand-400 group-hover:bg-white group-hover:text-brand-600 transition-all">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {students.length === 0 && (
                                        <div className="p-20 text-center flex flex-col items-center gap-6">
                                            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-200">
                                                <BarChart3 className="w-8 h-8" />
                                            </div>
                                            <p className="text-muted-foreground font-bold italic">No students found for this subject selection.</p>
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
