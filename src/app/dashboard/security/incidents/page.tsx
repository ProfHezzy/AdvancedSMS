'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ShieldAlert,
    Search,
    Filter,
    MoreVertical,
    AlertTriangle,
    MapPin,
    User,
    Plus,
    CheckCircle2,
    Eye,
    MessageSquare,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { getIncidents } from '@/actions/security';
import { cn } from '@/lib/utils';

export default function SecurityIncidentsPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        fetchIncidents();
    }, []);

    async function fetchIncidents() {
        setIsLoading(true);
        const res = await getIncidents();
        if (res.success && res.data) {
            setIncidents(res.data);
        }
        setIsLoading(false);
    }

    const filteredIncidents = incidents.filter(i => filter === 'ALL' || i.status === filter);

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                        Incident Reports
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Document and track security concerns and disciplinary events.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-lg shadow-orange-100 gap-2">
                    <Plus className="w-5 h-5" />
                    New Incident Report
                </Button>
            </div>

            <div className="flex bg-white/50 backdrop-blur p-1 rounded-xl border border-gray-100 shadow-soft w-fit">
                {['ALL', 'OPEN', 'INVESTIGATING', 'RESOLVED'].map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            "rounded-lg font-bold px-4 capitalize",
                            filter === f && "bg-gray-900 text-white shadow-md"
                        )}
                        onClick={() => setFilter(f)}
                    >
                        {f.toLowerCase()}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Incident Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-48 rounded-3xl bg-gray-50/50 animate-pulse border border-gray-100" />
                        ))
                    ) : (
                        <div className="space-y-4">
                            {filteredIncidents.map((incident, idx) => (
                                <Card
                                    key={incident.id}
                                    className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                                >
                                    <div className={cn(
                                        "absolute left-0 top-0 bottom-0 w-2",
                                        incident.priority === 'CRITICAL' ? "bg-red-600" :
                                            incident.priority === 'HIGH' ? "bg-orange-500" : "bg-blue-400"
                                    )} />
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                                        incident.status === 'RESOLVED' ? "bg-green-100 text-green-700" :
                                                            incident.status === 'INVESTIGATING' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                    )}>
                                                        {incident.status}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {incident.location}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">
                                                    {incident.description}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Involved: {incident.involved.join(', ')}</span>
                                                    <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Type: {incident.type}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end justify-between min-w-[150px]">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">Priority</p>
                                                    <p className={cn(
                                                        "text-sm font-black",
                                                        incident.priority === 'HIGH' ? "text-orange-600" : "text-gray-900"
                                                    )}>{incident.priority}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="icon" className="h-10 w-10 border-gray-100 hover:bg-gray-50">
                                                        <MessageSquare className="w-4 h-4 text-gray-400" />
                                                    </Button>
                                                    <Button className="h-10 px-4 rounded-xl bg-gray-900 hover:bg-black font-bold text-xs gap-2">
                                                        Full Log
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {filteredIncidents.length === 0 && (
                                <div className="p-20 text-center flex flex-col items-center gap-4 bg-white/50 backdrop-blur rounded-3xl border-2 border-dashed border-gray-100">
                                    <SearchX className="w-16 h-16 text-gray-100" />
                                    <div>
                                        <h3 className="text-xl font-black text-gray-800">No Incidents Reported</h3>
                                        <p className="text-muted-foreground font-medium">All campus zones are currently secure.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Surveillance Status */}
                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="bg-gray-900 text-white">
                            <CardTitle className="text-white/60 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Surveillance Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <span className="text-xs font-bold text-gray-600 uppercase">Main Gate Cam</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <span className="text-xs font-bold text-gray-600 uppercase">Dorm Corridor A</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase">Sports Field</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase">Offline</span>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-sm font-black flex items-center gap-2">
                                <Eye className="w-4 h-4 text-gray-400" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                <p className="text-xs font-medium text-gray-600">Officer Dan completed Perimeter Sweep B at 10:45 AM.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                                <p className="text-xs font-medium text-gray-600">Visitor 'Mark Stevens' checked into Admin Office.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
