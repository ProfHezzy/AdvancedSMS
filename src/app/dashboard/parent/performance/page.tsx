'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Award,
    BookOpen,
    ArrowRight,
    Users,
    CheckCircle2,
    Search
} from 'lucide-react';
import { getWards, getWardAcademicSummary } from '@/actions/parent';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function WardPerformancePage() {
    const { data: session } = useSession();
    const [wards, setWards] = useState<any[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [summary, setSummary] = useState<any>(null);
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
            fetchWardData();
        }
    }, [selectedWard]);

    async function fetchWardData() {
        setIsLoading(true);
        const res = await getWardAcademicSummary(selectedWard);
        if (res.success) {
            setSummary(res.data);
        } else {
            toast.error('Failed to load academic data.');
        }
        setIsLoading(false);
    }

    const currentWard = wards.find(w => w.id === selectedWard);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Academic Performance
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Deep dive into subject metrics and continuous assessment growth.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Ward Selector */}
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
                                        <div>
                                            <p className="font-black text-sm uppercase tracking-tight">{ward.user.username}</p>
                                            <p className={cn("text-[10px] font-bold uppercase tracking-widest", selectedWard === ward.id ? "text-brand-100" : "text-gray-400")}>
                                                {ward.class?.name || 'No Class'}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedWard === ward.id && <CheckCircle2 className="w-4 h-4 text-brand-200" />}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                            <Award className="w-32 h-32" />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <h3 className="text-lg font-black leading-tight mb-4">Excellence Badge</h3>
                            <div className="flex items-center gap-3">
                                <Award className="w-8 h-8 text-yellow-300" />
                                <div>
                                    <p className="text-2xl font-black">Top 10%</p>
                                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Class Position</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Performance Area */}
                <div className="lg:col-span-3 space-y-8">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-40 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                            ))}
                        </div>
                    ) : summary ? (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="glass border-none shadow-soft">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Attendance</p>
                                            <p className="text-2xl font-black text-gray-900">{summary.attendanceRate}%</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                            <Users className="w-5 h-5" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="glass border-none shadow-soft">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Score</p>
                                            <p className="text-2xl font-black text-gray-900">76.5%</p> {/* Mock avg */}
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <BarChart3 className="w-5 h-5" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="glass border-none shadow-soft">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Growth</p>
                                            <div className="flex items-center gap-1 text-green-600">
                                                <TrendingUp className="w-4 h-4" />
                                                <span className="text-sm font-black">+4.2%</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Results List */}
                            <Card className="glass border-none shadow-soft overflow-hidden">
                                <CardHeader className="border-b border-brand-50 pb-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Recent Assessments</CardTitle>
                                        <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                                            View All Results
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-brand-50">
                                        {summary.results.length > 0 ? (
                                            summary.results.map((res: any) => (
                                                <div key={res.id} className="p-6 flex items-center justify-between hover:bg-brand-50/30 transition-colors group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm group-hover:scale-110 transition-transform">
                                                            <BookOpen className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 uppercase tracking-tight">Mathematics</p> {/* Subject name mock */}
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(res.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-gray-900">{res.total}%</p>
                                                        <p className={cn(
                                                            "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest inline-block",
                                                            res.total >= 70 ? "bg-green-100 text-green-700" :
                                                                res.total >= 50 ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"
                                                        )}>
                                                            {res.grade} GRADE
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center text-muted-foreground italic font-medium">No recent results available.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                            <h3 className="text-xl font-black text-gray-800">Select a Ward</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
