'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileSpreadsheet,
    BookOpen,
    CheckCircle2,
    Clock,
    ChevronRight,
    Plus,
    Calendar,
    Search,
    Download,
    Eye
} from 'lucide-react';
import { getSchemesOfWork } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

export default function TeacherSchemePage() {
    const { data: session } = useSession();
    const [schemes, setSchemes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState('2nd Term');

    useEffect(() => {
        if (session?.user?.id) {
            fetchSchemes();
        }
    }, [session]);

    async function fetchSchemes() {
        setIsLoading(true);
        const res = await getSchemesOfWork((session?.user as any).id);
        if (res.success && res.data) {
            setSchemes(res.data);
        }
        setIsLoading(false);
    }

    const completedWeeks = schemes.filter(s => s.status === 'COMPLETED').length;
    const progress = (completedWeeks / 12) * 100; // Assuming 12 weeks in a term

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Scheme of Work
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Strategize and monitor the academic journey across the term.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Plus className="w-4 h-4" />
                        New Entry
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Curriculum Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass border-none shadow-soft">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Term Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative h-4 w-full bg-brand-50 rounded-full overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-1000"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-3xl font-black text-gray-900">{completedWeeks}/12</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Weeks Covered</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-brand-600">{Math.round(progress)}%</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Completion</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft overflow-hidden group">
                        <CardHeader className="bg-brand-50/50 pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Quick Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
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

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-32 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                        ))
                    ) : (
                        schemes.map((item, idx) => (
                            <Card
                                key={item.id}
                                className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-x-1"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="min-w-[80px] text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex flex-col items-center justify-center text-brand-700 shadow-inner group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                                            <span className="text-[10px] font-black uppercase leading-none mb-1">Week</span>
                                            <span className="text-2xl font-black leading-none">{item.week}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-md bg-brand-100 text-[9px] font-black text-brand-700 uppercase tracking-widest">
                                                {item.subject}
                                            </span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                                item.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">
                                            {item.topic}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground italic">
                                            Curriculum Reference: MTH-202-A
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-11 w-11 rounded-xl border-brand-100 text-brand-600 p-0 hover:bg-brand-50">
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                        <Button variant="outline" className="h-11 px-5 rounded-xl border-brand-100 text-brand-600 font-bold hover:bg-brand-50">
                                            Log Progress
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}

                    {!isLoading && schemes.length === 0 && (
                        <div className="p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                            <FileSpreadsheet className="w-12 h-12 text-brand-200" />
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">No Curriculum Data</h3>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                                Your scheme of work for this term hasn't been initialized yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
