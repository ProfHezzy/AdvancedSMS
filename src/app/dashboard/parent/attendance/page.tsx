'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getWards } from '@/actions/parent';
import { getStudentAttendance } from '@/actions/attendance';

export default function ParentAttendancePage() {
    const { data: session } = useSession();
    const [wardsData, setWardsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    async function fetchData() {
        setIsLoading(true);
        const userId = (session?.user as any).id;
        const wardsRes = await getWards(userId);

        if (wardsRes.success && wardsRes.data) {
            const wardsWithAttendance = await Promise.all(wardsRes.data.map(async (ward: any) => {
                const attRes = await getStudentAttendance(ward.id);
                const stats = attRes.success && attRes.data ? attRes.data.stats : { present: 0, absent: 0, late: 0, rate: '0%' };
                const history = attRes.success && attRes.data ? attRes.data.history : [];
                return {
                    id: ward.id,
                    name: ward.user.name || ward.user.username,
                    class: ward.class?.name || 'No Class',
                    attendance: stats,
                    history: history
                };
            }));
            setWardsData(wardsWithAttendance);
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

    if (wardsData.length === 0) {
        return (
            <div className="p-8 text-center animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-800">No Wards Found</h1>
                <p className="text-gray-500">No students are linked to your profile yet.</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Attendance Records</h1>
                <p className="text-muted-foreground mt-2">Monitor your wards' daily school attendance.</p>
            </div>

            <div className="grid gap-8">
                {wardsData.map((ward) => (
                    <Card key={ward.id} className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50 border-b border-brand-100 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-800">{ward.name}</CardTitle>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mt-1">{ward.class}</p>
                            </div>
                            <Badge variant="outline" className="bg-white text-brand-700 border-brand-200 text-lg px-4 py-1">
                                {ward.attendance.rate} Attendance
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-green-700">{ward.attendance.present}</p>
                                        <p className="text-xs font-bold uppercase text-green-600/80">Days Present</p>
                                    </div>
                                </div>
                                <div className="bg-rose-50 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-rose-700">{ward.attendance.absent}</p>
                                        <p className="text-xs font-bold uppercase text-rose-600/80">Days Absent</p>
                                    </div>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-amber-700">{ward.attendance.late}</p>
                                        <p className="text-xs font-bold uppercase text-amber-600/80">Days Late</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-800 uppercase text-xs tracking-widest mb-4">Recent History</h4>
                                {ward.history.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No attendance records found.</p>
                                ) : (
                                    ward.history.map((record: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-700">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
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
                ))}
            </div>
        </div>
    );
}
