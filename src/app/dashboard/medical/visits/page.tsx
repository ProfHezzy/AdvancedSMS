'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Stethoscope,
    Search,
    Plus,
    Thermometer,
    Activity,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mock Data
const MOCK_VISITS = [
    { id: '1', student: 'Alice Johnson', class: 'JSS 1 A', symptom: 'Fever & Headache', admittedAt: '2026-01-04T09:00:00', status: 'OBSERVATION', nurse: 'Nurse Joy' },
    { id: '2', student: 'David Smith', class: 'SS 2 B', symptom: 'Sports Injury (Ankle)', admittedAt: '2026-01-04T11:30:00', status: 'TREATED', nurse: 'Dr. Mike' },
];

export default function MedicalVisitsPage() {
    const [visits, setVisits] = useState(MOCK_VISITS);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVisits = visits.filter(v =>
        v.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Clinic Daily Log
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Patient admission and treatment records.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2 btn-shine">
                    <Plus className="w-5 h-5" />
                    New Entry
                </Button>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by student name or class..."
                            className="pl-9 h-12 bg-white/50 border-brand-100 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
                {filteredVisits.map((visit) => (
                    <Card key={visit.id} className="glass border-none shadow-soft hover:shadow-medium transition-all group">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                                visit.status === 'OBSERVATION' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                            )}>
                                {visit.status === 'OBSERVATION' ? <Thermometer className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <h3 className="text-lg font-black text-gray-900">{visit.student}</h3>
                                    <Badge variant="outline" className="w-fit mx-auto md:mx-0 bg-brand-50 border-brand-100 text-brand-700 font-bold text-[10px]">
                                        {visit.class}
                                    </Badge>
                                </div>
                                <p className="text-sm font-medium text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                    <Activity className="w-4 h-4 text-brand-400" />
                                    {visit.symptom}
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-2 min-w-[150px]">
                                <span className="text-xs font-bold text-gray-400">
                                    {new Date(visit.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <Badge className={cn(
                                    "font-black uppercase tracking-widest",
                                    visit.status === 'OBSERVATION' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                )}>
                                    {visit.status}
                                </Badge>
                                <span className="text-[10px] font-bold text-gray-400">Attended by {visit.nurse}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
