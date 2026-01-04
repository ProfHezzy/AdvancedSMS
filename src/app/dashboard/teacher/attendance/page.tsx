'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Calendar as CalendarIcon,
    Check,
    X,
    Clock,
    Save,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AttendancePage() {
    const [students, setStudents] = useState([
        { id: 1, name: 'Chioma Adeyemi', status: 'PRESENT' },
        { id: 2, name: 'David Okafor', status: 'PRESENT' },
        { id: 3, name: 'Sarah Ibrahim', status: 'ABSENT' },
        { id: 4, name: 'Michael Bassey', status: 'LATE' },
        { id: 5, name: 'Ngozi Eze', status: 'PRESENT' },
        { id: 6, name: 'Emmanuel Okeke', status: 'PRESENT' },
    ]);

    const toggleStatus = (id: number, status: string) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    const stats = {
        present: students.filter(s => s.status === 'PRESENT').length,
        absent: students.filter(s => s.status === 'ABSENT').length,
        late: students.filter(s => s.status === 'LATE').length,
        total: students.length
    };

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
                        <CalendarIcon className="w-4 h-4" /> {new Date().toLocaleDateString()}
                    </Button>
                    <Button
                        onClick={() => toast.success('Attendance register saved successfully!')}
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    >
                        <Save className="w-4 h-4" /> Save Register
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="glass border-none shadow-soft bg-blue-50/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-blue-600">{stats.total}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Total</span>
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
                        <h3 className="font-black text-lg text-gray-800">JSS 1 A</h3>
                        <Badge variant="outline" className="text-brand-600 border-brand-200">Morning Session</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-brand-600">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
                <div className="divide-y divide-gray-100">
                    {students.map((student) => (
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
                    ))}
                </div>
            </Card>
        </div>
    );
}
