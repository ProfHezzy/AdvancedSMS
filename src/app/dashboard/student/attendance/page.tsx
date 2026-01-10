'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock, XCircle, TrendingUp, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getStudentAttendance } from '@/actions/attendance';
import { getUserProfile } from '@/actions/profile';

export default function StudentAttendancePage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    async function fetchData() {
        setIsLoading(true);
        // Need to get student PROFILE ID first, assume user.studentProfile exists or fetch it
        const userId = (session?.user as any).id;
        const profileRes = await getUserProfile(userId);

        if (profileRes.success && profileRes.data.studentProfile) {
            const studentId = profileRes.data.studentProfile.id;
            const attRes = await getStudentAttendance(studentId);

            if (attRes.success && attRes.data) {
                setStats(attRes.data.stats);
                setHistory(attRes.data.history);
            }
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96 animate-fade-in">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-800">No Data Available</h1>
                <p className="text-gray-500">Could not retrieve attendance records.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">My Attendance</h1>
                <p className="text-muted-foreground mt-2">Track your daily class attendance and punctuality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass border-none shadow-soft md:col-span-4 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                    <CardContent className="p-8 flex items-center justify-between">
                        <div>
                            <p className="text-brand-100 font-medium uppercase tracking-widest text-sm">Overall Attendance Rate</p>
                            <h2 className="text-5xl font-black mt-2">{stats.rate}</h2>
                            <p className="text-brand-100 mt-2 text-sm">You are doing great! Keep it up.</p>
                        </div>
                        <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <TrendingUp className="w-10 h-10 text-white" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft flex flex-col items-center justify-center p-6 bg-green-50/50">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                    <span className="text-3xl font-black text-green-700">{stats.present}</span>
                    <span className="text-xs font-bold uppercase text-green-600/80">Present</span>
                </Card>
                <Card className="glass border-none shadow-soft flex flex-col items-center justify-center p-6 bg-rose-50/50">
                    <XCircle className="w-8 h-8 text-rose-600 mb-2" />
                    <span className="text-3xl font-black text-rose-700">{stats.absent}</span>
                    <span className="text-xs font-bold uppercase text-rose-600/80">Absent</span>
                </Card>
                <Card className="glass border-none shadow-soft flex flex-col items-center justify-center p-6 bg-amber-50/50">
                    <Clock className="w-8 h-8 text-amber-600 mb-2" />
                    <span className="text-3xl font-black text-amber-700">{stats.late}</span>
                    <span className="text-xs font-bold uppercase text-amber-600/80">Late</span>
                </Card>
                <Card className="glass border-none shadow-soft flex flex-col items-center justify-center p-6 bg-blue-50/50">
                    <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                    <span className="text-3xl font-black text-blue-700">{stats.total}</span>
                    <span className="text-xs font-bold uppercase text-blue-600/80">Total Days</span>
                </Card>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="uppercase tracking-widest text-lg font-black text-gray-800">Attendance Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">No records found.</p>
                        ) : (
                            history.map((record: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs uppercase">
                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <span className="font-bold text-gray-700">{new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</span>
                                    </div>
                                    <Badge className={
                                        record.status === 'PRESENT' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                            record.status === 'LATE' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                                                'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                    }>
                                        {record.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
