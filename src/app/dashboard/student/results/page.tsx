'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    FileText,
    Download,
    Award,
    BarChart3,
    ChevronRight,
    Search,
    BadgeCheck,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { getStudentReport } from '@/actions/results';
import { getStudentProfile } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export default function StudentResultsPage() {
    const { data: session } = useSession();
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState('default-term-id');

    useEffect(() => {
        if (session?.user?.id) {
            fetchResults();
        }
    }, [session, selectedTerm]);

    async function fetchResults() {
        setIsLoading(true);
        const profileRes = await getStudentProfile((session?.user as any).id);
        if (profileRes.success && profileRes.data) {
            const resultsRes = await getStudentReport(profileRes.data.id, selectedTerm);
            if (resultsRes.success && resultsRes.data) {
                setResults(resultsRes.data);
            }
        }
        setIsLoading(false);
    }

    const gpa = results.length > 0
        ? (results.reduce((acc, r) => acc + (r.total || 0), 0) / (results.length * 100) * 5).toFixed(2)
        : '0.00';

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Academic Performance
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        View your termly results and generated report sheets.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Download Report Sheet (PDF)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Performance Stats */}
                <Card className="lg:col-span-1 glass border-none shadow-soft overflow-hidden">
                    <CardHeader className="bg-brand-50/50">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Term Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-gray-400">Current GPA</p>
                            <h2 className="text-5xl font-black text-brand-700 mt-1">{gpa}</h2>
                            <p className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +0.24 from last term
                            </p>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-brand-50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Subjects Passed</span>
                                <span className="text-sm font-black text-gray-900">{results.filter(r => (r.total || 0) >= 40).length} / {results.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Class Position</span>
                                <span className="text-sm font-black text-gray-900">4th / 32</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500">Attendance</span>
                                <span className="text-sm font-black text-gray-900">96.8%</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-brand-600 text-white space-y-2 relative overflow-hidden">
                            <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
                            <p className="text-[10px] font-black uppercase text-white/60">Principal's Remark</p>
                            <p className="text-xs font-bold leading-relaxed">"Excellent focus this term. Outstanding performance in Science subjects. Keep it up!"</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Table */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-50/50 pb-6">
                            <div>
                                <CardTitle className="text-xl font-black">Subject Performance</CardTitle>
                                <CardDescription>Mid-Term Break Assessment 2026</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search subjects..."
                                        className="h-10 pl-10 pr-4 rounded-lg bg-white/50 border border-brand-100 text-xs outline-none focus:ring-2 focus:ring-brand-500 w-48"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-20 text-center animate-pulse font-black text-brand-200 uppercase tracking-widest">
                                    Syncing Gradebook...
                                </div>
                            ) : results.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-brand-50/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <th className="px-6 py-4">Subject</th>
                                                <th className="px-6 py-4">CA (40)</th>
                                                <th className="px-6 py-4">Exam (60)</th>
                                                <th className="px-6 py-4">Total (100)</th>
                                                <th className="px-6 py-4">Grade</th>
                                                <th className="px-6 py-4">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-brand-50/50">
                                            {results.map((res, idx) => (
                                                <tr key={idx} className="group hover:bg-brand-50/10 transition-all">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100/50">
                                                                <BookOpen className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors">{res.subject.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{res.caScore}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{res.examScore}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-black text-gray-900">{res.total}</span>
                                                            <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden hidden md:block">
                                                                <div
                                                                    className={cn(
                                                                        "h-full transition-all duration-1000",
                                                                        res.total >= 70 ? "bg-green-500" : res.total >= 50 ? "bg-brand-500" : "bg-rose-500"
                                                                    )}
                                                                    style={{ width: `${res.total}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm",
                                                            res.grade === 'A' ? "bg-green-100 text-green-700" :
                                                                res.grade === 'B' ? "bg-brand-100 text-brand-700" : "bg-rose-100 text-rose-700"
                                                        )}>
                                                            {res.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase">
                                                        {res.grade === 'A' ? 'Distinction' : res.grade === 'B' ? 'Credit' : 'Excellent'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-20 text-center text-muted-foreground">
                                    <BarChart3 className="w-12 h-12 text-brand-100 mx-auto mb-4" />
                                    <p className="font-black text-gray-800 uppercase tracking-widest text-sm">No Results Compiled</p>
                                    <p className="text-sm mt-1">Assessment results for the current term haven't been published yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass border-none shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <BadgeCheck className="w-4 h-4 text-brand-600" />
                                    Academic Certifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-brand-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Mid-Term Transcript</p>
                                            <p className="text-[10px] text-muted-foreground">Generated 2 days ago</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="text-brand-600">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass border-none shadow-soft">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                    Improvement Areas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700 uppercase">
                                    Physics II - Work on Thermodynamics
                                </div>
                                <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-[10px] font-bold text-brand-700 uppercase">
                                    Further Maths - Calculus mastery required
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
