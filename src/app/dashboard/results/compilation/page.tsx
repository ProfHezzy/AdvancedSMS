'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    Download,
    Search,
    BookOpen,
    Filter,
    CheckCircle2,
    Trophy,
    TrendingUp,
    AlertCircle,
    Printer
} from 'lucide-react';
import { getResultsBySubject } from '@/actions/results';
import { getTeacherSubjects } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ResultCompilationPage() {
    const { data: session } = useSession();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const calculateStats = () => {
        if (students.length === 0) return { pass: 0, fail: 0, avg: 0 };
        const total = students.reduce((acc, s) => acc + s.total, 0);
        const pass = students.filter(s => s.total >= 50).length; // Assuming 50 is Pass
        return {
            pass,
            fail: students.length - pass,
            avg: (total / students.length).toFixed(1)
        };
    };

    const stats = calculateStats();

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Result Compilation
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Comprehensive master sheet and academic performance analytics.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Printer className="w-4 h-4" />
                        Print Sheet
                    </Button>
                    <Button
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                        onClick={() => toast.success('Exporting master sheet to PDF...')}
                    >
                        <Download className="w-4 h-4" />
                        Export Master Sheet
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Subject & Stats Sidebar */}
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
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50 pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Performance Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500">Class Average</span>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="text-xl font-black text-brand-700">{stats.avg}%</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-center">
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Pass</p>
                                    <p className="text-xl font-black text-green-700">{stats.pass}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Fail</p>
                                    <p className="text-xl font-black text-rose-700">{stats.fail}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Master Sheet Table */}
                <div className="lg:col-span-3">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <div className="bg-white/50 backdrop-blur border-b border-brand-100 p-6">
                            <h3 className="font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-brand-500" />
                                Term Results Master Sheet
                            </h3>
                        </div>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-12 space-y-4">
                                    {Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="h-16 rounded-xl bg-brand-50/50 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-brand-50/50 border-b border-brand-100 text-gray-500">
                                            <tr>
                                                <th className="p-6 font-black text-xs uppercase tracking-widest">Student</th>
                                                <th className="p-6 font-black text-xs uppercase tracking-widest text-center">CA (40)</th>
                                                <th className="p-6 font-black text-xs uppercase tracking-widest text-center">Exam (60)</th>
                                                <th className="p-6 font-black text-xs uppercase tracking-widest text-center">Total (100)</th>
                                                <th className="p-6 font-black text-xs uppercase tracking-widest text-center">Grade</th>
                                                <th className="p-6 font-black text-xs uppercase tracking-widest text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-50">
                                            {students.map((student) => (
                                                <tr key={student.id} className="group hover:bg-brand-50/30 transition-colors">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-black text-xs border border-brand-100">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold">{student.id.slice(0, 8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center font-bold text-gray-600">{student.caScore}</td>
                                                    <td className="p-6 text-center font-bold text-gray-600">{student.examScore}</td>
                                                    <td className="p-6 text-center">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded-md text-xs font-black",
                                                            student.total >= 70 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                                                        )}>
                                                            {student.total}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className={cn(
                                                            "w-8 h-8 inline-flex items-center justify-center rounded-lg font-black text-xs border",
                                                            student.grade === 'A' ? "bg-green-50 text-green-600 border-green-100" :
                                                                student.grade === 'F' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                    "bg-white text-gray-600 border-gray-200"
                                                        )}>
                                                            {student.grade}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        {student.total >= 50 ? (
                                                            <div className="flex items-center justify-center gap-1.5 text-green-600">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Pass</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-1.5 text-rose-500">
                                                                <AlertCircle className="w-4 h-4" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Resit</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {students.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="p-12 text-center text-muted-foreground font-medium italic">
                                                        No result data available for this subject.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
