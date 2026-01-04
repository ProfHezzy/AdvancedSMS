'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Lock,
    UserCircle,
    Video,
    AlertTriangle,
    MapPin,
    LogOut,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SecurityDashboardPage() {
    const stats = [
        { title: 'Visitors On-Site', value: '47', change: 'Current Count', icon: UserCircle, color: 'bg-indigo-500' },
        { title: 'Security Alerts', value: '0', change: 'All Clear', icon: Shield, color: 'bg-emerald-500' },
        { title: 'Cameras Active', value: '32/32', change: '100% Uptime', icon: Video, color: 'bg-blue-500' },
        { title: 'Active Patrols', value: '4', change: 'Shift B', icon: MapPin, color: 'bg-amber-500' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Campus Security
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Surveillance, visitor management, and perimeter control.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Eye className="w-4 h-4" />
                        Live Feed
                    </Button>
                    <Button
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                        onClick={() => toast.success('Checkpoint protocol initiated')}
                    >
                        <Shield className="w-4 h-4" />
                        Log Checkpoint
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
                            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Recent Visitor Logs</CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-brand-600">View All Logs</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {[
                            { visitor: 'Delivery: DHL Express', time: '5 mins ago', gate: 'Main Gate', status: 'Checked In' },
                            { visitor: 'Parent: Mrs. Silva', time: '20 mins ago', gate: 'Admin Block', status: 'On Site' },
                            { visitor: 'Contractor: TechFix', time: '1 hour ago', gate: 'Service Gate', status: 'Checked Out' },
                        ].map((log, i) => (
                            <div key={i} className="p-4 flex items-center justify-between border-b border-brand-50 last:border-0 hover:bg-brand-50/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                                        {log.visitor.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{log.visitor}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" />
                                            {log.gate}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
                                        log.status === 'Checked Out' ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                                    )}>
                                        {log.status}
                                    </span>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black text-brand-800 uppercase tracking-widest">System Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {[
                                { sys: 'Surveillance Cams', status: 'Operational', color: 'text-green-600' },
                                { sys: 'Biometric Access', status: 'Operational', color: 'text-green-600' },
                                { sys: 'Fire Alarms', status: 'Maintenance Due', color: 'text-amber-600' },
                            ].map((sys, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="text-sm font-bold text-gray-700">{sys.sys}</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${sys.status === 'Operational' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                        <span className={`text-xs font-black uppercase tracking-widest ${sys.color}`}>{sys.status}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                        <CardContent className="p-6">
                            <Lock className="w-8 h-8 mb-4 text-gray-400" />
                            <h3 className="text-lg font-black leading-tight">Campuse Lockdown</h3>
                            <p className="text-xs font-bold text-gray-400 mt-2 mb-4">
                                Initiate emergency lockdown protocol for entire campus.
                            </p>
                            <Button variant="destructive" className="w-full font-black">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                INITIATE
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
