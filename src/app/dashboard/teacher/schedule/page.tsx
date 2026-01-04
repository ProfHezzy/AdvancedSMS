'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TeacherSchedulePage() {
    const schedule = [
        { time: '08:00 - 08:45', subject: 'Mathematics', class: 'JSS 1 A', room: 'Room 101', type: 'CLASS' },
        { time: '08:45 - 09:30', subject: 'Mathematics', class: 'JSS 1 B', room: 'Room 102', type: 'CLASS' },
        { time: '09:30 - 10:00', subject: 'Break Time', type: 'BREAK' },
        { time: '10:00 - 10:45', subject: 'Free Period', type: 'FREE' },
        { time: '10:45 - 11:30', subject: 'Civic Education', class: 'SS 2 A', room: 'Hall 3', type: 'CLASS' },
        { time: '12:00 - 14:00', subject: 'Department Meeting', room: 'Staff Room', type: 'MEETING' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Today's Schedule
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {schedule.map((slot, i) => (
                    <Card key={i} className={cn(
                        "border-none shadow-soft transition-all hover:scale-[1.01]",
                        slot.type === 'BREAK' ? 'bg-amber-50/50' :
                            slot.type === 'FREE' ? 'bg-gray-50/50' :
                                slot.type === 'MEETING' ? 'bg-purple-50/50' : 'glass'
                    )}>
                        <CardContent className="p-6 flex items-center gap-6">
                            <div className={cn(
                                "min-w-[140px] px-4 py-2 rounded-xl border flex items-center justify-center gap-2 font-black text-sm",
                                slot.type === 'CLASS' ? "bg-brand-50 text-brand-700 border-brand-100" : "bg-white border-gray-100 text-gray-600"
                            )}>
                                <Clock className="w-4 h-4" /> {slot.time}
                            </div>

                            <div className="flex-1">
                                <h3 className={cn("text-xl font-black uppercase tracking-tight", slot.type === 'FREE' ? "text-gray-400" : "text-gray-900")}>
                                    {slot.subject}
                                </h3>
                                {slot.type === 'CLASS' && (
                                    <div className="flex gap-4 mt-2">
                                        <Badge variant="secondary" className="gap-1 font-bold">
                                            <Users className="w-3 h-3" /> {slot.class}
                                        </Badge>
                                        <Badge variant="outline" className="gap-1 font-bold bg-white">
                                            <MapPin className="w-3 h-3" /> {slot.room}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="w-2 h-12 rounded-full bg-gray-200 overflow-hidden">
                                {slot.type === 'CLASS' && <div className="w-full h-full bg-brand-500" />}
                                {slot.type === 'BREAK' && <div className="w-full h-full bg-amber-400" />}
                                {slot.type === 'MEETING' && <div className="w-full h-full bg-purple-500" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
