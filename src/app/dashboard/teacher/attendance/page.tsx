'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Calendar as CalendarIcon,
    Check,
    X,
    Clock,
    Save,
    Filter,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { getTeacherClasses, getClassStudents, getClassAttendance, markAttendance } from '@/actions/attendance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AttendancePage() {
    const { data: session } = useSession();
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentDate] = useState(new Date());

    useEffect(() => {
        if (session?.user?.id) {
            initData();
        }
    }, [session]);

    useEffect(() => {
        if (selectedClassId) {
            loadClassData(selectedClassId);
        }
    }, [selectedClassId]);

    async function initData() {
        setIsLoading(true);
        const userId = (session?.user as any).id;
        const classRes = await getTeacherClasses(userId);
        if (classRes.success && classRes.data && classRes.data.length > 0) {
            setClasses(classRes.data);
            setSelectedClassId(classRes.data[0].id); // Default to first class
        } else {
            setIsLoading(false);
        }
    }

    async function loadClassData(classId: string) {
        setIsLoading(true);
        // 1. Get Students
        const studentRes = await getClassStudents(classId);
        // 2. Get Existing Attendance
        const attendanceRes = await getClassAttendance(classId, currentDate);

        if (studentRes.success && studentRes.data) {
            // Merge Data
            const merged = studentRes.data.map((student: any) => {
                const record = attendanceRes.success && attendanceRes.data
                    ? attendanceRes.data.find((r: any) => r.studentId === student.id)
                    : null;

                return {
                    id: student.id,
                    name: student.user.name || student.user.username,
                    status: record ? record.status : null // Null means not marked yet
                };
            });
            setStudents(merged);
        }
        setIsLoading(false);
    }

    const toggleStatus = (id: string, status: string) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const records = students
            .filter(s => s.status) // Only save marked ones? Or all? User might skip some.
            .map(s => ({
                studentId: s.id,
                status: s.status,
                date: currentDate
            }));

        const res = await markAttendance(records);
        if (res.success) {
            toast.success('Attendance register saved successfully!');
        } else {
            toast.error('Failed to save attendance.');
        }
        setIsSaving(false);
    };

    const stats = {
        present: students.filter(s => s.status === 'PRESENT').length,
        absent: students.filter(s => s.status === 'ABSENT').length,
        late: students.filter(s => s.status === 'LATE').length,
        total: students.length
    };

    if (isLoading && classes.length === 0) {
        return (
            <div className="flex justify-center items-center h-96 animate-fade-in">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Mark Attendance
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Daily roll call and attendance tracking.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                        <CalendarIcon className="w-4 h-4" /> {currentDate.toLocaleDateString()}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || students.length === 0}
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Register
                    </Button>
                </div>
            </div>

            {/* Class Selection & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Class Selector if multiple classes */}
                {classes.length > 0 && (
                    <div className="md:col-span-4 mb-4">
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="w-[200px] h-12 bg-white border-brand-200">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Card className="glass border-none shadow-soft bg-blue-50/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-blue-600">{stats.total}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Total Students</span>
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
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="font-black text-lg text-gray-800">
                            {classes.find(c => c.id === selectedClassId)?.name || 'Class List'}
                        </h3>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No students found in this class.</div>
                    ) : (
                        students.map((student) => (
                            <div key={student.id} className="p-4 flex items-center justify-between hover:bg-white/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-bold text-gray-900">{student.name}</span>
                                </div>
                                <div className="flex bg-gray-100/50 p-1 rounded-lg gap-1">
                                    <button
                                        onClick={() => toggleStatus(student.id, 'PRESENT')}
                                        className={cn(
                                            "w-24 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                            student.status === 'PRESENT'
                                                ? "bg-green-500 text-white shadow-md"
                                                : "text-gray-400 hover:bg-gray-200"
                                        )}
                                    >
                                        <Check className="w-3 h-3" /> Present
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(student.id, 'ABSENT')}
                                        className={cn(
                                            "w-24 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                            student.status === 'ABSENT'
                                                ? "bg-rose-500 text-white shadow-md"
                                                : "text-gray-400 hover:bg-gray-200"
                                        )}
                                    >
                                        <X className="w-3 h-3" /> Absent
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(student.id, 'LATE')}
                                        className={cn(
                                            "w-24 px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                            student.status === 'LATE'
                                                ? "bg-amber-500 text-white shadow-md"
                                                : "text-gray-400 hover:bg-gray-200"
                                        )}
                                    >
                                        <Clock className="w-3 h-3" /> Late
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
