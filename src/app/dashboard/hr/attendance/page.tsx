'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Calendar as CalendarIcon,
    Check,
    X,
    Clock,
    Save,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getStaffAttendanceList, markStaffAttendance } from '@/actions/hr';

export default function StaffAttendancePage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const res = await getStaffAttendanceList(currentDate);
        if (res.success && res.data) {
            const merged = res.data.map((s: any) => ({
                id: s.id,
                name: s.user.name || s.user.username,
                role: s.user.role,
                image: s.user.image,
                status: s.attendance.length > 0 ? s.attendance[0].status : null
            }));
            setStaff(merged);
        }
        setIsLoading(false);
    }

    const toggleStatus = (id: string, status: string) => {
        setStaff(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const records = staff
            .filter(s => s.status)
            .map(s => ({
                staffId: s.id,
                status: s.status,
                date: currentDate
            }));

        const res = await markStaffAttendance(records);
        if (res.success) {
            toast.success('Staff attendance saved successfully!');
        } else {
            toast.error('Failed to save attendance.');
        }
        setIsSaving(false);
    };

    const stats = {
        present: staff.filter(s => s.status === 'PRESENT').length,
        absent: staff.filter(s => s.status === 'ABSENT').length,
        late: staff.filter(s => s.status === 'LATE').length,
        total: staff.length
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Staff Attendance
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Monitor and manage daily staff presence.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                        <CalendarIcon className="w-4 h-4" /> {currentDate.toLocaleDateString()}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || staff.length === 0}
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Register
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-none shadow-soft bg-blue-50/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-blue-600">{stats.total}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Total Staff</span>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-green-50/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-green-600">{stats.present}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-green-400">Present</span>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-rose-50/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-rose-600">{stats.absent}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Absent</span>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-amber-50/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-amber-600">{stats.late}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Late</span>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg font-black uppercase">Staff Roll Call</CardTitle>
                </CardHeader>
                <div className="divide-y divide-gray-100">
                    {staff.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 italic">No staff records found.</div>
                    ) : (
                        staff.map((member) => (
                            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-black text-gray-900 leading-tight">{member.name}</p>
                                        <p className="text-xs font-bold text-brand-600 uppercase tracking-tighter">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex bg-gray-100/50 p-1 rounded-lg gap-1">
                                    <button
                                        onClick={() => toggleStatus(member.id, 'PRESENT')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                                            member.status === 'PRESENT'
                                                ? "bg-green-500 text-white shadow-md scale-105"
                                                : "text-gray-400 hover:bg-gray-200"
                                        )}
                                    >
                                        <Check className="w-4 h-4" /> Present
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(member.id, 'ABSENT')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                                            member.status === 'ABSENT'
                                                ? "bg-rose-500 text-white shadow-md scale-105"
                                                : "text-gray-400 hover:bg-gray-200"
                                        )}
                                    >
                                        <X className="w-4 h-4" /> Absent
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(member.id, 'LATE')}
                                        className={cn(
                                            "px-4 py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                                            member.status === 'LATE'
                                                ? "bg-amber-500 text-white shadow-md scale-105"
                                                : "text-gray-400 hover:bg-gray-200"
                                        )}
                                    >
                                        <Clock className="w-4 h-4" /> Late
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
