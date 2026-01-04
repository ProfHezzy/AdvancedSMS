'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
    PenTool,
    Smile,
    Meh,
    Frown,
    Save,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function StudentRemarksPage() {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [students] = useState([
        { id: 1, name: 'Chioma Adeyemi', class: 'JSS 1 A' },
        { id: 2, name: 'David Okafor', class: 'JSS 1 A' },
        { id: 3, name: 'Sarah Ibrahim', class: 'JSS 1 A' },
    ]);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Behavioral Remarks
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Log observations and termly comments for students.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student Selector */}
                <Card className="glass border-none shadow-soft h-fit">
                    <div className="p-4 border-b border-gray-100 bg-white/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                placeholder="Search student..."
                                className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto p-2 space-y-1">
                        {students.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedStudent(s.id)}
                                className={cn(
                                    "p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors",
                                    selectedStudent === s.id ? "bg-brand-50 border border-brand-100" : "hover:bg-gray-50 border border-transparent"
                                )}
                            >
                                <Avatar className="w-10 h-10 border border-white">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} />
                                    <AvatarFallback>{s.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className={cn("font-bold text-sm", selectedStudent === s.id ? "text-brand-900" : "text-gray-900")}>{s.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{s.class}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Remark Form */}
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                            <PenTool className="w-5 h-5 text-brand-600" /> New Entry
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!selectedStudent ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                                <Search className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-medium">Select a student from the list to begin.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Affective Domain Rating</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-green-100 bg-green-50/30 hover:bg-green-50 hover:border-green-300 transition-all group">
                                            <Smile className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-green-700 text-sm">Excellent</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-300 transition-all group">
                                            <Meh className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-amber-700 text-sm">Average</span>
                                        </button>
                                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:border-rose-300 transition-all group">
                                            <Frown className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform" />
                                            <span className="font-bold text-rose-700 text-sm">Poor</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Detailed Observation</label>
                                    <Textarea
                                        className="min-h-[150px] font-medium resize-none text-base"
                                        placeholder="Enter detailed comments about the student's behavior, participation, and general conduct..."
                                    />
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 bg-white">Participates actively</Badge>
                                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 bg-white">Talkative</Badge>
                                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 bg-white">Leadership potential</Badge>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button className="h-12 px-8 bg-black text-white font-black rounded-xl hover:bg-gray-900 btn-shine gap-2 shadow-lg">
                                        <Save className="w-4 h-4" /> Save Remark
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
