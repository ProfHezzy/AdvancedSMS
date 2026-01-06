'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { saveResults } from '@/actions/results';

import { getClasses, getSubjects } from '@/actions/admin';

export default function ResultsPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [clsRes, subRes] = await Promise.all([
            getClasses(),
            getSubjects()
        ]);
        if (clsRes.success && clsRes.data) setClasses(clsRes.data);
        if (subRes.success && subRes.data) setSubjects(subRes.data);
    };

    const handleSearch = () => {
        if (!selectedClass || !selectedSubject) return;
        setLoading(true);
        // Simulate fetch for students for now as we don't have getStudentsByClassSubject in current results actions
        setTimeout(() => {
            const mockStudents = [
                { id: '1', name: 'John Doe', caScore: 25, examScore: 55 },
                { id: '2', name: 'Jane Smith', caScore: 28, examScore: 62 },
                { id: '3', name: 'Robert Johnson', caScore: 15, examScore: 45 },
            ];
            setStudents(mockStudents.map(s => ({ ...s })));
            setLoading(false);
        }, 1000);
    };

    const handleScoreChange = (id: string, field: 'caScore' | 'examScore', value: string) => {
        const numValue = parseFloat(value) || 0;
        setStudents(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, [field]: numValue };
            }
            return s;
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);

        // In real app, we'd use the selectedTermId
        const termId = 'default-term-id';

        const dataToSave = students.map(s => ({
            studentId: s.id,
            subjectId: selectedSubject,
            termId,
            caScore: s.caScore,
            examScore: s.examScore
        }));

        const result = await saveResults(dataToSave);

        if (result.success) {
            setStatus({ type: 'success', message: 'Results saved successfully!' });
        } else {
            setStatus({ type: 'error', message: 'Failed to save results. Please try again.' });
        }
        setSaving(false);
    };

    const calculateGrade = (ca: number, exam: number) => {
        const total = ca + exam;
        if (total >= 70) return { grade: 'A', class: 'text-green-600' };
        if (total >= 60) return { grade: 'B', class: 'text-blue-600' };
        if (total >= 50) return { grade: 'C', class: 'text-yellow-600' };
        if (total >= 45) return { grade: 'D', class: 'text-orange-600' };
        if (total >= 40) return { grade: 'E', class: 'text-red-400' };
        return { grade: 'F', class: 'text-red-600' };
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Result Entry</h1>
                <p className="text-muted-foreground">Manage and record student performance for the current term.</p>
            </div>

            <Card className="glass border-white/20">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Class</label>
                            <select
                                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Choose Class...</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Subject</label>
                            <select
                                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-brand-500 outline-none"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Choose Subject...</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <Button
                            className="w-full gap-2 h-10"
                            onClick={handleSearch}
                            disabled={!selectedClass || !selectedSubject || loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Load Students
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {students.length > 0 && (
                <Card className="glass border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="border-b border-white/10 bg-white/5">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Student Scores</CardTitle>
                                <CardDescription>Enter scores out of 30 for CA and 70 for Exams.</CardDescription>
                            </div>
                            <Button
                                variant="gradient"
                                className="gap-2"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save All Results
                            </Button>
                        </div>
                        {status && (
                            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm animate-in zoom-in-95 ${status.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'
                                }`}>
                                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {status.message}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-white/5 text-left border-b border-white/10">
                                        <th className="p-4 font-semibold uppercase tracking-wider text-xs">Student Name</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-xs w-32">CA (30)</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-xs w-32">Exam (70)</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-xs w-32">Total</th>
                                        <th className="p-4 font-semibold uppercase tracking-wider text-xs w-32">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {students.map((student) => {
                                        const result = calculateGrade(student.caScore, student.examScore);
                                        return (
                                            <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-medium">{student.name}</td>
                                                <td className="p-4">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="30"
                                                        value={student.caScore}
                                                        onChange={(e) => handleScoreChange(student.id, 'caScore', e.target.value)}
                                                        className="h-9 glass border-white/20 focus:ring-brand-500"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="70"
                                                        value={student.examScore}
                                                        onChange={(e) => handleScoreChange(student.id, 'examScore', e.target.value)}
                                                        className="h-9 glass border-white/20 focus:ring-brand-500"
                                                    />
                                                </td>
                                                <td className="p-4 font-bold text-base">
                                                    {student.caScore + student.examScore}
                                                </td>
                                                <td className={`p-4 font-bold text-base ${result.class}`}>
                                                    {result.grade}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
