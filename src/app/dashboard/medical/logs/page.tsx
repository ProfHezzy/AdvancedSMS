'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronRight,
    Thermometer,
    ArrowRightLeft,
    ClipboardList,
    Stethoscope,
    Calendar,
    Clock,
    User
} from 'lucide-react';
import { getClinicLogs } from '@/actions/medical';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export default function ClinicLogsPage() {
    const { data: session } = useSession();
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    async function fetchLogs() {
        setIsLoading(true);
        const res = await getClinicLogs();
        if (res.success && res.data) {
            setLogs(res.data);
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
                        Clinic Visit Logs
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Maintain detailed records of clinical visits and health incidents.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="h-12 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 font-black shadow-lg shadow-rose-600/20 gap-2">
                        <Plus className="w-5 h-5" />
                        Record New Visit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Statistics */}
                <Card className="lg:col-span-1 glass border-none shadow-soft overflow-hidden">
                    <CardHeader className="bg-rose-50/50">
                        <CardTitle className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Daily Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-rose-100 shadow-sm">
                            <div>
                                <p className="text-[10px] font-black text-rose-400 uppercase">Visits Today</p>
                                <p className="text-2xl font-black text-gray-900">14</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-rose-100 shadow-sm">
                            <div>
                                <p className="text-[10px] font-black text-rose-400 uppercase">Current Temp (Avg)</p>
                                <p className="text-2xl font-black text-gray-900">36.8°C</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Thermometer className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs List */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-50/50 pb-6">
                            <div>
                                <CardTitle className="text-xl font-black">History</CardTitle>
                                <CardDescription>Comprehensive clinical entries for {new Date().toLocaleDateString()}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        className="h-10 pl-10 pr-4 rounded-lg bg-white/50 border border-brand-100 text-xs outline-none focus:ring-2 focus:ring-rose-500 w-48"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-20 text-center animate-pulse font-black text-brand-200 uppercase tracking-widest">
                                    Syncing Registry...
                                </div>
                            ) : logs.length > 0 ? (
                                <div className="divide-y divide-brand-50/50">
                                    {logs.map((log, idx) => (
                                        <div
                                            key={log.id}
                                            className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 hover:bg-rose-50/5 transition-all"
                                        >
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center font-black text-rose-700 text-xs border border-rose-100">
                                                        {log.studentName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 leading-none">{log.studentName}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-1">{log.className}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-white/50 border border-rose-100/50 rounded-2xl p-4 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest shrink-0 w-20">Complaint:</span>
                                                        <span className="text-xs font-bold text-gray-700">{log.complaint}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest shrink-0 w-20">Diagnosis:</span>
                                                        <span className="text-xs font-bold text-orange-600">{log.diagnosis}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-auto flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center min-w-[70px]">
                                                        <span className="text-[8px] font-black text-rose-400 uppercase">Temp</span>
                                                        <span className="text-sm font-black text-rose-700">{log.vitals.temp}</span>
                                                    </div>
                                                    <div className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-100 flex flex-col items-center min-w-[70px]">
                                                        <span className="text-[8px] font-black text-rose-400 uppercase">Blood P.</span>
                                                        <span className="text-sm font-black text-rose-700">{log.vitals.bp}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground px-1 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {log.recordedBy}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center text-muted-foreground flex flex-col items-center gap-4">
                                    <ClipboardList className="w-12 h-12 text-rose-100" />
                                    <p className="font-black text-gray-800 uppercase tracking-widest text-sm">Registry Empty</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
