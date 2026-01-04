'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Activity,
    FileText,
    Calendar,
    Search,
    Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function MedicalHistoryPage() {
    const records = [
        {
            id: 'MED-2025-001',
            date: '20 Oct 2025',
            patient: 'Chioma Adeyemi',
            class: 'JSS 1 A',
            complaint: 'Severe Headache',
            diagnosis: 'Migraine',
            treatment: 'Paracetamol 500mg, Rest',
            doctor: 'Dr. Sarah',
            status: 'DISCHARGED'
        },
        {
            id: 'MED-2025-002',
            date: '18 Oct 2025',
            patient: 'David Okafor',
            class: 'JSS 1 B',
            complaint: 'Sports Injury',
            diagnosis: 'Sprained Ankle',
            treatment: 'Ice pack, Bandage',
            doctor: 'Nurse Joy',
            status: 'FOLLOW_UP'
        },
        {
            id: 'MED-2025-003',
            date: '15 Oct 2025',
            patient: 'Emeka Adeyemi',
            class: 'Basic 4',
            complaint: 'Fever',
            diagnosis: 'Malaria',
            treatment: 'Anti-malaria course',
            doctor: 'Dr. Sarah',
            status: 'DISCHARGED'
        },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Medical History
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Comprehensive log of clinic visits and treatments.
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search patient name or ID..."
                        className="w-full md:w-80 h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white font-medium"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {records.map((rec) => (
                    <Card key={rec.id} className="glass border-none shadow-soft hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex items-start gap-4 min-w-[200px]">
                                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.patient}`} />
                                        <AvatarFallback>{rec.patient[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{rec.patient}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{rec.class}</p>
                                        <Badge variant="outline" className="mt-2 text-[10px] font-black tracking-widest bg-gray-50 text-gray-400 border-gray-200">
                                            {rec.id}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1 mb-1">
                                            <Activity className="w-3 h-3" /> Complaint
                                        </p>
                                        <p className="font-bold text-gray-800">{rec.complaint}</p>
                                        <p className="text-xs font-medium text-brand-600 mt-1">Diag: {rec.diagnosis}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1 mb-1">
                                            <Stethoscope className="w-3 h-3" /> Treatment
                                        </p>
                                        <p className="font-medium text-gray-600 text-sm leading-relaxed">{rec.treatment}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1 mb-1">
                                            <Calendar className="w-3 h-3" /> Details
                                        </p>
                                        <p className="font-bold text-gray-800 text-sm">{rec.date}</p>
                                        <p className="text-xs text-gray-400 mt-1">Attended by {rec.doctor}</p>
                                        <Badge className={cn(
                                            "mt-2 text-[10px] uppercase font-black tracking-wider",
                                            rec.status === 'DISCHARGED' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                        )}>
                                            {rec.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end md:justify-center px-4">
                                    <Button variant="ghost" size="icon" className="hover:bg-brand-50 text-gray-400 hover:text-brand-600">
                                        <FileText className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
