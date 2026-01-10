'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Calculator,
    Save,
    Download,
    Users,
    FileText,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { getClassResults, saveResults } from '@/actions/results';
import { getTeacherSubjects } from '@/actions/academic';
import { getCurrentTerm } from '@/actions/admin';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { calculateGrade } from '@/lib/grade-calculator';

interface ResultRow {
    studentId: string;
    studentName: string;
    caScore: number;
    examScore: number;
    total: number;
    grade: string;
}

export default function ResultCompilationPage() {
    const { data: session } = useSession();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [termId, setTermId] = useState<string>('');
    const [results, setResults] = useState<ResultRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchInitialData();
        }
    }, [session]);

    useEffect(() => {
        if (selectedSubject && selectedClass && termId) {
            fetchResults();
        }
    }, [selectedSubject, selectedClass, termId]);

    async function fetchInitialData() {
        // Fetch teacher's subjects
        const subjectsRes = await getTeacherSubjects((session?.user as any).id);
        if (subjectsRes.success && subjectsRes.data) {
            setSubjects(subjectsRes.data);
        }

        // Fetch current term
        const termRes = await getCurrentTerm();
        if (termRes.success && termRes.data) {
            setTermId(termRes.data.id);
        }
    }

    async function fetchResults() {
        setIsLoading(true);
        const res = await getClassResults(selectedClass, selectedSubject, termId);
        if (res.success && res.data) {
            setResults(res.data);
        }
        setIsLoading(false);
    }

    const handleScoreChange = (studentId: string, field: 'caScore' | 'examScore', value: string) => {
        const numValue = parseFloat(value) || 0;
        const maxValue = field === 'caScore' ? 40 : 60;
        const validValue = Math.min(maxValue, Math.max(0, numValue));

        setResults(prev => prev.map(r => {
            if (r.studentId === studentId) {
                const updated = { ...r, [field]: validValue };
                updated.total = updated.caScore + updated.examScore;
                updated.grade = calculateGrade(updated.total).grade;
                return updated;
            }
            return r;
        }));
    };

    const handleBulkSave = async () => {
        if (results.length === 0) {
            toast.error('No results to save');
            return;
        }

        setIsSaving(true);
        const resultsToSave = results.map(r => ({
            studentId: r.studentId,
            subjectId: selectedSubject,
            termId: termId,
            caScore: r.caScore,
            examScore: r.examScore
        }));

        const res = await saveResults(resultsToSave);
        if (res.success) {
            toast.success(res.message || 'All results saved successfully!');
        } else {
            toast.error(res.error || 'Failed to save results');
        }
        setIsSaving(false);
    };

    const handleExportToExcel = () => {
        // TODO: Implement Excel export using xlsx library
        toast.info('Excel export coming soon!');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Result Compilation
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Enter and compile student performance for the current assessment period.
                    </p>
                </div>
            </div>

            {/* Selection Controls */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="font-black text-gray-800 uppercase tracking-widest">Select Class & Subject</CardTitle>
                    <CardDescription>Choose the class and subject to enter results</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase">Subject</label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="h-11 rounded-xl border-brand-100">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(subject => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-gray-600 mb-2 block uppercase">Class</label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="h-11 rounded-xl border-brand-100">
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects
                                    .find(s => s.id === selectedSubject)
                                    ?.classes?.map((cls: any) => (
                                        <SelectItem key={cls.id} value={cls.id}>
                                            {cls.name}
                                        </SelectItem>
                                    )) || []}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end gap-2">
                        <Button
                            onClick={handleBulkSave}
                            disabled={isSaving || results.length === 0}
                            className="h-11 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save All Results
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportToExcel}
                            className="h-11 px-6 rounded-xl border-brand-100 font-bold gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Table */}
            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="border-b border-brand-50/50 flex flex-row items-center justify-between pb-6">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand-600" />
                            Score Entry
                        </CardTitle>
                        <CardDescription>Enter scores for CA (40) and Exams (60)</CardDescription>
                    </div>
                    {results.length > 0 && (
                        <div className="flex items-center gap-2 text-sm font-bold text-brand-600">
                            <CheckCircle2 className="w-4 h-4" />
                            {results.length} Students
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-20 text-center">
                            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
                            <p className="font-black text-brand-200 uppercase tracking-widest">Loading Students...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-20 text-center">
                            <FileText className="w-16 h-16 text-brand-200 mx-auto mb-4" />
                            <p className="font-bold text-gray-500">Select a subject and class to begin</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-50/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-brand-50">
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">CA (40)</th>
                                        <th className="px-6 py-4">Exam (60)</th>
                                        <th className="px-6 py-4">Total (100)</th>
                                        <th className="px-6 py-4">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-50/50">
                                    {results.map((result, idx) => (
                                        <tr key={result.studentId} className="group hover:bg-brand-50/20 transition-all">
                                            <td className="px-6 py-4 font-bold text-gray-500">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center font-black text-brand-700 text-xs">
                                                        {result.studentName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">{result.studentName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={40}
                                                    step={0.5}
                                                    className="w-24 h-10 rounded-lg border border-brand-100 bg-white px-3 text-sm font-black text-brand-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                                    value={result.caScore}
                                                    onChange={(e) => handleScoreChange(result.studentId, 'caScore', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={60}
                                                    step={0.5}
                                                    className="w-24 h-10 rounded-lg border border-brand-100 bg-white px-3 text-sm font-black text-brand-700 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                                                    value={result.examScore}
                                                    onChange={(e) => handleScoreChange(result.studentId, 'examScore', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-gray-900 text-lg">{result.total.toFixed(1)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-xs font-black uppercase",
                                                    result.grade === 'A+' || result.grade === 'A' ? "bg-green-100 text-green-700" :
                                                        result.grade === 'B' ? "bg-blue-100 text-blue-700" :
                                                            result.grade === 'C' ? "bg-yellow-100 text-yellow-700" :
                                                                result.grade === 'D' || result.grade === 'E' ? "bg-orange-100 text-orange-700" :
                                                                    "bg-red-100 text-red-700"
                                                )}>
                                                    {result.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
