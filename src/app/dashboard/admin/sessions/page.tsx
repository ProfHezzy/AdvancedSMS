'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Plus,
    CheckCircle2,
    Clock,
    Trash2,
    CalendarDays
} from 'lucide-react';
import { getSessions, createSession } from '@/actions/admin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    async function fetchSessions() {
        setIsLoading(true);
        const res = await getSessions();
        if (res.success && res.data) {
            setSessions(res.data);
        }
        setIsLoading(false);
    }

    const handleCreate = () => {
        toast.info('Opening session creation dialog...');
        // In a real app, this would open a modal form
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Academic Sessions
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Configure school years and term durations.
                    </p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5" />
                    New Session
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-32 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                        ))
                    ) : sessions.length > 0 ? (
                        sessions.map((session, i) => (
                            <Card key={session.id} className="glass border-none shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner",
                                            i === 0 ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-300"
                                        )}>
                                            {session.name.substring(0, 4)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{session.name}</h3>
                                                {i === 0 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CalendarDays className="w-4 h-4" />
                                                    Started: {new Date(session.startDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    Ends: {new Date(session.endDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-10 px-4 rounded-xl border-brand-100 text-brand-600 font-bold hover:bg-brand-50">
                                            Manage Terms
                                        </Button>
                                        {i !== 0 && (
                                            <Button variant="outline" size="icon" className="h-10 w-10 border-rose-100 text-rose-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                            <Calendar className="w-12 h-12 text-brand-200" />
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">No Sessions Found</h3>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                                Initialize the first academic year to get started.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-brand-700 to-brand-900 text-white">
                        <CardContent className="p-8 relative overflow-hidden">
                            <Calendar className="w-32 h-32 text-white/5 absolute -right-8 -bottom-8 rotate-12" />
                            <h3 className="text-2xl font-black leading-tight mb-2">School Calendar</h3>
                            <p className="text-sm font-medium text-brand-100/80 mb-6">
                                Centralized timeline of all academic events, holidays, and examination periods.
                            </p>
                            <Button className="w-full bg-white text-brand-900 hover:bg-brand-50 font-black">
                                View Full Calendar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
