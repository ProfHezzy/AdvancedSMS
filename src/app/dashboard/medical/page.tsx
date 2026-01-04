'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    HeartPulse,
    Stethoscope,
    Activity,
    AlertCircle,
    Plus,
    FileText,
    Thermometer,
    Syringe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MedicalDashboardPage() {
    const stats = [
        { title: 'Clinic Visits', value: '12', change: 'Today', icon: Stethoscope, color: 'bg-rose-500' },
        { title: 'Active Cases', value: '4', change: 'Under observation', icon: Activity, color: 'bg-blue-500' },
        { title: 'Health Alerts', value: '1', change: 'Severe allergy', icon: AlertCircle, color: 'bg-amber-500' },
        { title: 'Checkups', value: '28', change: 'Pending this week', icon: HeartPulse, color: 'bg-emerald-500' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        School Clinic
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Student health monitoring and incident response center.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <FileText className="w-4 h-4" />
                        Health Logs
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Plus className="w-4 h-4" />
                        Log Visit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="glass border-none shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className={`absolute top-0 right-0 p-4 opacity-5 transform translate-x-1/2 -translate-y-1/2`}>
                                    <Icon className="w-24 h-24" />
                                </div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.title}</p>
                                        <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
                                        <p className="text-[10px] font-bold text-brand-600 mt-1 uppercase tracking-wider">{stat.change}</p>
                                    </div>
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 glass border-none shadow-soft overflow-hidden">
                    <CardHeader className="bg-brand-50/50 pb-4 border-b border-brand-50">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Recent Incidents</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-600">View History</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {[
                            { student: 'John Doe', issue: 'Mild Fever', time: '10:30 AM', status: 'Sent Home', icon: Thermometer },
                            { student: 'Jane Smith', issue: 'Minor Injury (Playground)', time: '09:15 AM', status: 'Treated', icon: Syringe },
                            { student: 'Michael Brown', issue: 'Headache', time: '08:45 AM', status: 'Resting', icon: Activity },
                        ].map((incident, i) => (
                            <div key={i} className="p-4 flex items-center justify-between border-b border-brand-50 last:border-0 hover:bg-brand-50/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                        <incident.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{incident.student}</p>
                                        <p className="text-xs text-muted-foreground">{incident.issue}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                        incident.status === 'Sent Home' ? "bg-amber-100 text-amber-700" :
                                            incident.status === 'Treated' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {incident.status}
                                    </span>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">{incident.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-rose-600 to-rose-800 text-white">
                        <CardContent className="p-6">
                            <AlertCircle className="w-8 h-8 mb-4 text-rose-200" />
                            <h3 className="text-lg font-black leading-tight">Emergency Protocol</h3>
                            <p className="text-xs font-bold text-rose-100/70 mt-2 mb-4">
                                Quick access for ambulance or emergency services.
                            </p>
                            <Button className="w-full bg-white text-rose-700 hover:bg-rose-50 font-black animate-pulse">
                                Call Emergency
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">Inventory Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { item: 'Paracetamol', lvl: 85, color: 'bg-green-500' },
                                { item: 'Bandages', lvl: 30, color: 'bg-amber-500' },
                                { item: 'Antiseptics', lvl: 60, color: 'bg-blue-500' },
                            ].map((inv, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>{inv.item}</span>
                                        <span>{inv.lvl}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${inv.color}`} style={{ width: `${inv.lvl}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
