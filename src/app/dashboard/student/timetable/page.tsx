'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function StudentTimetablePage() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const schedule = {
        'Monday': [
            { time: '08:00 - 08:45', subject: 'Mathematics', room: 'Room 1A', teacher: 'Mrs. Okon', type: 'CLASS' },
            { time: '08:45 - 09:30', subject: 'English Language', room: 'Room 1A', teacher: 'Mr. David', type: 'CLASS' },
            { time: '09:30 - 10:00', subject: 'Short Break', type: 'BREAK' },
            { time: '10:00 - 10:45', subject: 'Basic Science', room: 'Lab 2', teacher: 'Dr. Sarah', type: 'CLASS' },
        ],
        'Tuesday': [
            { time: '08:00 - 08:45', subject: 'Social Studies', room: 'Room 1A', teacher: 'Justina B.', type: 'CLASS' },
            { time: '08:45 - 09:30', subject: 'Civic Education', room: 'Room 1A', teacher: 'Mr. James', type: 'CLASS' },
        ],
        'Wednesday': [
            { time: '08:00 - 09:30', subject: 'Sports / Physical Health', room: 'Field', teacher: 'Coach P.', type: 'ACTIVITY' },
        ],
        'Thursday': [
            { time: '08:00 - 08:45', subject: 'Mathematics', room: 'Room 1A', teacher: 'Mrs. Okon', type: 'CLASS' },
        ],
        'Friday': [
            { time: '08:00 - 08:45', subject: 'General Assembly', room: 'Hall', type: 'ASSEMBLY' },
            { time: '09:00 - 09:45', subject: 'Mathematics', room: 'Room 1A', teacher: 'Mrs. Okon', type: 'CLASS' },
        ]
    };

    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        My Timetable
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Academic Session 2025/2026
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

                {days.map(day => (
                    <TabsContent key={day} value={day} className="space-y-4">
                        {(schedule[day as keyof typeof schedule] || []).map((slot: any, i: number) => (
                            <Card key={i} className={cn(
                                "border-none shadow-soft transition-all hover:scale-[1.01] hover:shadow-md",
                                slot.type === 'BREAK' ? 'bg-amber-50/50' :
                                    slot.type === 'ACTIVITY' ? 'bg-green-50/50' :
                                        slot.type === 'ASSEMBLY' ? 'bg-purple-50/50' : 'glass'
                            )}>
                                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className={cn(
                                        "min-w-[150px] px-4 py-3 rounded-xl border flex items-center justify-center gap-2 font-black text-sm shadow-sm",
                                        slot.type === 'CLASS' ? "bg-white text-brand-700 border-brand-100" : "bg-white/50 border-gray-100 text-gray-600"
                                    )}>
                                        <Clock className="w-4 h-4" /> {slot.time}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <h3 className={cn("text-xl font-black uppercase tracking-tight", slot.type === 'BREAK' ? "text-amber-700" : "text-gray-900")}>
                                            {slot.subject}
                                        </h3>
                                        {slot.type === 'CLASS' && (
                                            <div className="flex flex-wrap gap-3">
                                                <Badge variant="outline" className="gap-1 font-bold bg-white/50 border-gray-200 text-gray-700">
                                                    <MapPin className="w-3 h-3" /> {slot.room}
                                                </Badge>
                                                <Badge variant="outline" className="gap-1 font-bold bg-white/50 border-gray-200 text-gray-700">
                                                    <BookOpen className="w-3 h-3" /> {slot.teacher}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full md:w-2 h-2 md:h-16 rounded-full bg-gray-200 overflow-hidden mt-4 md:mt-0">
                                        {slot.type === 'CLASS' && <div className="w-full h-full bg-brand-500" />}
                                        {slot.type === 'BREAK' && <div className="w-full h-full bg-amber-400" />}
                                        {slot.type === 'ACTIVITY' && <div className="w-full h-full bg-green-500" />}
                                        {slot.type === 'ASSEMBLY' && <div className="w-full h-full bg-purple-500" />}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
