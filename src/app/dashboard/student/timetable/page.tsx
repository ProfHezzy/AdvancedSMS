'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, BookOpen, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { getStudentProfile, getStudentTimetable } from '@/actions/academic';

export default function StudentTimetablePage() {
    const { data: session } = useSession();
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [className, setClassName] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const dayMapInverse: { [key: number]: string } = {
        1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'
    };

    useEffect(() => {
        if (session?.user?.id) {
            loadTimetable();
        }
    }, [session]);

    async function loadTimetable() {
        setLoading(true);
        // 1. Get Profile to get ClassId
        const profileRes = await getStudentProfile((session?.user as any).id);
        if (profileRes.success && profileRes.data && profileRes.data.classId) {
            setClassName(profileRes.data.class?.name || '');
            // 2. Get Timetable
            const timeRes = await getStudentTimetable(profileRes.data.classId);
            if (timeRes.success && timeRes.data) {
                setTimetable(timeRes.data);
            }
        }
        setLoading(false);
    }

    const getEntriesForDay = (dayStr: string) => {
        return timetable.filter(t => dayMapInverse[t.dayOfWeek] === dayStr);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        My Timetable
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Academic Session 2025/2026 {className && `• ${className}`}
                    </p>
                </div>
            </div>

            <Tabs defaultValue={days.includes(currentDay) ? currentDay : 'Monday'} className="w-full">
                <TabsList className="w-full justify-start h-14 bg-white/50 p-2 rounded-2xl gap-2 mb-8 overflow-x-auto">
                    {days.map(day => (
                        <TabsTrigger
                            key={day}
                            value={day}
                            className="h-10 px-6 rounded-xl font-bold data-[state=active]:bg-brand-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                        >
                            {day}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                    </div>
                ) : (
                    days.map(day => (
                        <TabsContent key={day} value={day} className="space-y-4">
                            {getEntriesForDay(day).length === 0 ? (
                                <div className="p-12 text-center bg-white/50 backdrop-blur rounded-3xl border-2 border-dashed border-gray-100 opacity-60">
                                    <h3 className="text-xl font-bold text-gray-500">No classes scheduled</h3>
                                </div>
                            ) : (
                                getEntriesForDay(day).map((slot: any, i: number) => (
                                    <Card key={i} className="border-none shadow-soft transition-all hover:scale-[1.01] hover:shadow-md glass">
                                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="min-w-[150px] px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-black text-sm shadow-sm bg-white text-brand-700 border-brand-100">
                                                <Clock className="w-4 h-4" /> {slot.startTime} - {slot.endTime}
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
                                                    {slot.subject.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-3">
                                                    <Badge variant="outline" className="gap-1 font-bold bg-white/50 border-gray-200 text-gray-700">
                                                        <MapPin className="w-3 h-3" /> {slot.room || 'Classroom'}
                                                    </Badge>
                                                    <Badge variant="outline" className="gap-1 font-bold bg-white/50 border-gray-200 text-gray-700">
                                                        <BookOpen className="w-3 h-3" /> {slot.type || 'Lecture'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-2 h-2 md:h-16 rounded-full overflow-hidden mt-4 md:mt-0 bg-brand-500"></div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    ))
                )}
            </Tabs>
        </div>
    );
}
