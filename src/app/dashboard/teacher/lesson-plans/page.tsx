'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    BookOpen,
    FileText,
    Search,
    MoreVertical,
    Calendar,
    ChevronRight,
    CheckCircle2,
    Clock,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LessonPlansPage() {
    const [plans, setPlans] = useState([
        { id: 1, topic: 'Introduction to Quantum Mechanics', subject: 'Physics II', class: 'SS 3A', status: 'Approved', date: 'Jan 5, 2026' },
        { id: 2, topic: 'Electromagnetic Induction', subject: 'Physics I', class: 'SS 2B', status: 'Draft', date: 'Jan 8, 2026' },
        { id: 3, topic: 'Thermodynamics Laws', subject: 'Physics II', class: 'SS 3B', status: 'Under Review', date: 'Jan 6, 2026' },
    ]);

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Lesson Plans
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Draft and organize your teaching materials for the current term.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2">
                    <Plus className="w-5 h-5" />
                    New Plan
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{plans.length}</div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-green-600">1</div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-amber-500">2</div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Next Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">2 Days</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-600" />
                        Active Drafts
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search topic..."
                                className="h-10 pl-10 pr-4 rounded-lg bg-white/50 border border-brand-100 text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-brand-100">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {plans.map((plan, idx) => (
                        <Card key={plan.id} className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-x-1 overflow-hidden">
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1.5",
                                plan.status === 'Approved' ? "bg-green-500" :
                                    plan.status === 'Draft' ? "bg-gray-300" : "bg-amber-400"
                            )} />
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-brand-600 tracking-widest flex items-center gap-2">
                                                {plan.subject} | {plan.class}
                                                <ChevronRight className="w-3 h-3" />
                                            </p>
                                            <h3 className="text-xl font-black text-gray-900 mt-1">{plan.topic}</h3>
                                            <div className="flex items-center gap-4 mt-2 text-xs font-bold text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {plan.date}
                                                </span>
                                                <span className={cn(
                                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tighter",
                                                    plan.status === 'Approved' ? "bg-green-100 text-green-700" :
                                                        plan.status === 'Draft' ? "bg-gray-100 text-gray-700" : "bg-amber-100 text-amber-700"
                                                )}>
                                                    {plan.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {plan.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-10 px-6 rounded-xl border-brand-100 text-brand-700 font-bold hover:bg-brand-50">
                                            Edit Plan
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
