'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    Printer,
    Search,
    UserCheck,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { getWards } from '@/actions/parent';
import { getStudentReport } from '@/actions/results';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ParentResultsPage() {
    const { data: session } = useSession();
    const [wards, setWards] = useState<any[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [selectedTerm, setSelectedTerm] = useState('2nd Term');
    const [report, setReport] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchWards();
        }
    }, [session]);

    async function fetchWards() {
        const res = await getWards((session?.user as any).id);
        if (res.success && res.data && res.data.length > 0) {
            setWards(res.data);
            setSelectedWard(res.data[0].id);
        }
    }

    useEffect(() => {
        if (selectedWard) {
            fetchReport();
        }
    }, [selectedWard, selectedTerm]);

    async function fetchReport() {
        setIsLoading(true);
        // Using a mock term ID logic or prop for now since we don't have a term selector linked to DB yet
        const termId = 'default-term-id';
        const res = await getStudentReport(selectedWard, termId);
        if (res.success && res.data) {
            setReport(res.data);
        }
        setIsLoading(false);
    }

    const currentWard = wards.find(w => w.id === selectedWard);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Term Results
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        View and download end-of-term academic report cards.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Printer className="w-4 h-4" />
                        Print Report
                    </Button>
                    <Button
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                        onClick={() => toast.success('Downloading report card PDF...')}
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50 pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Select Ward</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-2">
                            {wards.map((ward) => (
                                <button
                                    key={ward.id}
                                    className={cn(
                                        "w-full p-4 rounded-xl flex items-center justify-between transition-all group border text-left",
                                        selectedWard === ward.id
                                            ? "bg-brand-600 border-brand-600 text-white shadow-lg"
                                            : "bg-white border-brand-50 text-gray-700 hover:border-brand-200 hover:bg-brand-50/50"
                                    )}
                                    onClick={() => setSelectedWard(ward.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border",
                                            selectedWard === ward.id ? "bg-white/20 text-white border-white/20" : "bg-brand-50 text-brand-700 border-brand-100"
                                        )}>
                                            {ward.user.username.charAt(0)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-black text-sm uppercase tracking-tight truncate">{ward.user.username}</p>
                                        </div>
                                    </div>
                                    {selectedWard === ward.id && <CheckCircle2 className="w-4 h-4 text-brand-200 shrink-0" />}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50 pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Academic Session</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-2">
                            {['1st Term', '2nd Term', '3rd Term'].map((term) => (
                                <Button
                                    key={term}
                                    variant={selectedTerm === term ? 'default' : 'ghost'}
                                    className={cn(
                                        "w-full h-11 justify-between rounded-xl font-bold px-4 transition-all",
                                        selectedTerm === term ? "bg-brand-600 text-white shadow-lg" : "text-gray-500 hover:bg-brand-50"
                                    )}
                                    onClick={() => setSelectedTerm(term)}
                                >
                                    {term}
                                    {selectedTerm === term && <CheckCircle2 className="w-4 h-4" />}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Report Card */}
                <div className="lg:col-span-3">
                    <Card className="glass border-none shadow-soft overflow-hidden min-h-[600px]">
                        <div className="bg-white/50 backdrop-blur border-b border-brand-100 p-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500"></div>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-white">
                                    <GraduationCap className="w-8 h-8" /> {/* Fixed icon reference */}
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Advanced School Management System</h2>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Student Progress Report</p>

                            {currentWard && (
                                <div className="mt-8 flex flex-wrap justify-center gap-8 text-left max-w-2xl mx-auto p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</p>
                                        <p className="text-lg font-black text-gray-900">{currentWard.user.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</p>
                                        <p className="text-lg font-black text-gray-900">{currentWard?.class?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Term</p>
                                        <p className="text-lg font-black text-brand-600">{selectedTerm}</p>
                                    </div>
                                </div>
                            )}
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
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest">Subject</th>
                                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest text-center">CA Score</th>
                                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest text-center">Exam Score</th>
                                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest text-center">Total</th>
                                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest text-center">Grade</th>
                                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest">Remark</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {report.length > 0 ? (
                                                report.map((row) => (
                                                    <tr key={row.id} className="hover:bg-brand-50/30 transition-colors">
                                                        <td className="p-6 font-bold text-gray-900">{row.subject.name}</td>
                                                        <td className="p-6 text-center text-gray-600 font-medium">{row.caScore}</td>
                                                        <td className="p-6 text-center text-gray-600 font-medium">{row.examScore}</td>
                                                        <td className="p-6 text-center font-black text-gray-900">{row.total}</td>
                                                        <td className="p-6 text-center">
                                                            <span className={cn(
                                                                "w-8 h-8 inline-flex items-center justify-center rounded-lg font-black text-xs border",
                                                                row.grade === 'A' ? "bg-green-50 text-green-600 border-green-100" :
                                                                    row.grade === 'F' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                        "bg-white text-gray-600 border-gray-200"
                                                            )}>
                                                                {row.grade}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 text-sm italic text-muted-foreground">{row.grade === 'A' ? 'Excellent' : row.grade === 'F' ? 'Needs Improvement' : 'Good'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="p-20 text-center text-muted-foreground font-medium italic">
                                                        No results published for this term yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        {report.length > 0 && (
                                            <tfoot className="bg-brand-50/50 border-t border-brand-100">
                                                <tr>
                                                    <td colSpan={3} className="p-6 font-black text-xs uppercase tracking-widest text-right">Term Average:</td>
                                                    <td className="p-6 font-black text-xl text-brand-700 text-center">
                                                        {(report.reduce((acc, curr) => acc + curr.total, 0) / report.length).toFixed(1)}%
                                                    </td>
                                                    <td colSpan={2}></td>
                                                </tr>
                                            </tfoot>
                                        )}
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

function GraduationCap({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}
