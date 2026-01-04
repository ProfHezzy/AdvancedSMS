'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Printer,
    Download,
    Filter,
    BookOpen,
    Users
} from 'lucide-react';
import { getTeacherSchedule } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const TIMES = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'
];

export default function TeacherTimetablePage() {
    const { data: session } = useSession();
    const [schedule, setSchedule] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeDay, setActiveDay] = useState('MONDAY');

    useEffect(() => {
        if (session?.user?.id) {
            fetchSchedule();
        }
    }, [session]);

    async function fetchSchedule() {
        setIsLoading(true);
        const res = await getTeacherSchedule((session?.user as any).id);
        if (res.success && res.data) {
            setSchedule(res.data);
        }
        setIsLoading(false);
    }

    const filteredSchedule = schedule.filter(item => item.dayOfWeek === activeDay);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Weekly Timetable
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Your synchronized institutional schedule and lecture roadmap.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Printer className="w-4 h-4" />
                        Print Schedule
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Day Selector */}
            <div className="flex bg-white/50 backdrop-blur p-1.5 rounded-2xl border border-brand-100 shadow-soft overflow-x-auto">
                {DAYS.map((day) => (
                    <Button
                        key={day}
                        variant={activeDay === day ? 'default' : 'ghost'}
                        className={cn(
                            "flex-1 min-w-[100px] h-12 rounded-xl font-black text-xs tracking-widest transition-all duration-300",
                            activeDay === day ? "bg-brand-600 text-white shadow-md scale-105" : "text-gray-500 hover:bg-brand-50"
                        )}
                        onClick={() => setActiveDay(day)}
                    >
                        {day}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats / Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-brand-50/50 pb-4">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">Today's Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500">Total Lectures</span>
                                <span className="text-lg font-black text-brand-700">{filteredSchedule.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500">Free Periods</span>
                                <span className="text-lg font-black text-brand-700">{8 - filteredSchedule.length}</span>
                            </div>
                            <div className="pt-4 border-t border-brand-50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3">Next Session</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-800">10:00 AM</p>
                                        <p className="text-[10px] font-bold text-muted-foreground">Mathematics - JSS 1</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-3xl bg-brand-600 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <Calendar className="w-10 h-10 mb-4 text-brand-200" />
                        <h3 className="text-xl font-black leading-tight">Institutional Calendar</h3>
                        <p className="text-xs font-bold text-brand-100/80 mt-2">Check for upcoming holidays or faculty meetings.</p>
                        <Button variant="ghost" className="mt-6 w-full bg-white/10 hover:bg-white/20 text-white font-black rounded-xl border border-white/20 text-xs">
                            View All Events
                        </Button>
                    </div>
                </div>

                {/* Main Timetable Content */}
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-28 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSchedule.length > 0 ? (
                                filteredSchedule.map((item, idx) => (
                                    <Card
                                        key={item.id}
                                        className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-x-1 overflow-hidden"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex flex-col md:flex-row items-center border-l-4 border-brand-500">
                                            <div className="w-full md:w-32 py-6 px-4 md:px-0 text-center bg-brand-50/30">
                                                <p className="text-xl font-black text-brand-700">{item.startTime}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.endTime}</p>
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-white border border-brand-100 flex items-center justify-center text-brand-600 shadow-inner group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                                                        <BookOpen className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">
                                                            {item.subject?.name}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1.5">
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                                <Users className="w-3.5 h-3.5 text-brand-400" />
                                                                {item.class?.name}
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                                                                Room 2B
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <Button variant="outline" className="flex-1 md:flex-none h-11 px-6 rounded-xl border-brand-100 text-brand-600 font-bold hover:bg-brand-50">
                                                        Materials
                                                    </Button>
                                                    <Button variant="outline" className="flex-1 md:flex-none h-11 px-6 rounded-xl border-brand-100 text-brand-600 font-bold hover:bg-brand-50">
                                                        Attendance
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                                    <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
                                        <Clock className="w-8 h-8 text-brand-200" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Free Day</h3>
                                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                                            No lectures are currently scheduled for this day. Enjoy your free periods!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
