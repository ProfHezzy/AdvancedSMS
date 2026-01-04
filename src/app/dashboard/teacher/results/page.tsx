'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calculator,
    Save,
    ChevronRight,
    Search,
    CheckCircle2,
    Users,
    FileText,
    History
} from 'lucide-react';
import { getTeacherClasses, getClassList } from '@/actions/academic';
import { compileResults } from '@/actions/results';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ResultCompilationPage() {
    const { data: session } = useSession();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resultsData, setResultsData] = useState<Record<string, { ca: number, exam: number }>>({});

    useEffect(() => {
        if (session?.user?.id) {
            fetchClasses();
        }
    }, [session]);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
        }
    }, [selectedClass]);

    async function fetchClasses() {
        const res = await getTeacherClasses((session?.user as any).id);
        if (res.success && res.data) {
            setClasses(res.data);
            if (res.data.length > 0) setSelectedClass(res.data[0].id);
        }
    }

    async function fetchStudents() {
        setIsLoading(true);
        const res = await getClassList(selectedClass!);
        if (res.success && res.data) {
            setStudents(res.data);
            // Initialize results map if needed
        }
        setIsLoading(false);
    }

    const handleScoreChange = (studentId: string, type: 'ca' | 'exam', value: string) => {
        const numValue = Math.min(type === 'ca' ? 40 : 60, Math.max(0, parseInt(value) || 0));
        setResultsData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [type]: numValue
            }
        }));
    };

    const handleSaveResult = async (studentId: string) => {
        const data = resultsData[studentId];
        if (!data) return;

        toast.promise(compileResults({
            studentId,
            subjectId: 'default-subject-id', // In a real app, this would be selected
            termId: 'default-term-id',
            caScore: data.ca || 0,
            examScore: data.exam || 0
        }), {
            loading: 'Saving result...',
            success: 'Result compiled successfully!',
            error: 'Failed to save result'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Result Compilation
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Enter and compile student performance for the current assessment period.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            className="h-11 px-4 pr-10 rounded-xl border border-brand-100 bg-white/50 backdrop-blur shadow-sm appearance-none cursor-pointer focus:ring-2 focus:ring-brand-500 transition-all font-bold text-brand-800"
                            value={selectedClass || ''}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 rotate-90 pointer-events-none" />
                    </div>
                    <Button className="h-11 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2">
                        <Calculator className="w-4 h-4" />
                        Bulk Calculate
                    </Button>
                </div>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="border-b border-brand-50/50 flex flex-row items-center justify-between pb-6">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-600" />
                            Score Entry: {classes.find(c => c.id === selectedClass)?.name || 'Class'}
                        </CardTitle>
                        <CardDescription>Enter scores for CA (40) and Exams (60).</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 rounded-lg border-brand-100 text-brand-600 font-bold gap-2">
                            <History className="w-4 h-4" />
                            Import History
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-20 text-center animate-pulse font-black text-brand-200">
                            SYNCING GRADEBOOK...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-50/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-brand-50">
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">CA (40)</th>
                                        <th className="px-6 py-4">Exam (60)</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Grade</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-50/50">
                                    {students.map((student, idx) => {
                                        const data = resultsData[student.id] || { ca: 0, exam: 0 };
                                        const total = (data.ca || 0) + (data.exam || 0);
                                        let grade = 'F';
                                        if (total >= 70) grade = 'A';
                                        else if (total >= 60) grade = 'B';
                                        else if (total >= 50) grade = 'C';
                                        else if (total >= 45) grade = 'D';

                                        return (
                                            <tr key={student.id} className="group hover:bg-brand-50/20 transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center font-black text-brand-700 text-xs">
                                                            {student.user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900">{student.user.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        max={40}
                                                        className="w-20 h-9 rounded-lg border border-brand-100 bg-white px-3 text-sm font-black text-brand-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                                        value={data.ca}
                                                        onChange={(e) => handleScoreChange(student.id, 'ca', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        max={60}
                                                        className="w-20 h-9 rounded-lg border border-brand-100 bg-white px-3 text-sm font-black text-brand-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                                        value={data.exam}
                                                        onChange={(e) => handleScoreChange(student.id, 'exam', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-black text-gray-900">{total}</td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[10px] font-black",
                                                        grade === 'A' ? "bg-green-100 text-green-700" :
                                                            grade === 'B' ? "bg-brand-100 text-brand-700" : "bg-rose-100 text-rose-700"
                                                    )}>
                                                        {grade}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        className="h-9 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 font-bold gap-2"
                                                        onClick={() => handleSaveResult(student.id)}
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        Save
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
