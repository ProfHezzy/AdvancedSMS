'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function LeaveRequestsPage() {
    const [requests, setRequests] = useState([
        { id: 1, name: 'Mrs. Okon', role: 'Teacher', type: 'Sick Leave', duration: '3 Days', dates: '20-22 Oct', status: 'PENDING', avatar: 'Okon' },
        { id: 2, name: 'Mr. David', role: 'Teacher', type: 'Annual Leave', duration: '14 Days', dates: '1-14 Nov', status: 'APPROVED', avatar: 'David' },
        { id: 3, name: 'Dr. Sarah', role: 'Medical', type: 'Casual Leave', duration: '1 Day', dates: '25 Oct', status: 'REJECTED', avatar: 'Sarah' },
        { id: 4, name: 'Mr. James', role: 'Security', type: 'Sick Leave', duration: '2 Days', dates: '18-19 Oct', status: 'PENDING', avatar: 'James' },
    ]);

    const handleAction = (id: number, newStatus: string) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Leave Requests
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage staff time-off applications.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                        <FileText className="w-4 h-4" /> Policy
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Calendar className="w-4 h-4" /> Calendar View
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending', count: 12, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Approved', count: 45, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Rejected', count: 3, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'On Leave', count: 8, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none shadow-soft">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <span className={cn("text-3xl font-black", stat.color)}>{stat.count}</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass border-none shadow-soft">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black text-lg text-gray-800">Recent Applications</h3>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-brand-600">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
                <div className="divide-y divide-gray-100">
                    {requests.map((req) => (
                        <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/50 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.avatar}`} />
                                    <AvatarFallback>{req.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{req.name}</h4>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{req.role}</p>
                                </div>
                            </div>

                            <div className="flex-1 md:px-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Leave Type</p>
                                    <p className="font-bold text-gray-800">{req.type}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400">Duration</p>
                                    <p className="font-bold text-gray-800">{req.duration}</p>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-[10px] font-black uppercase text-gray-400">Dates</p>
                                    <p className="font-bold text-gray-800">{req.dates}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {req.status === 'PENDING' ? (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                            onClick={() => handleAction(req.id, 'APPROVED')}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold"
                                            onClick={() => handleAction(req.id, 'REJECTED')}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Reject
                                        </Button>
                                    </>
                                ) : (
                                    <Badge className={cn(
                                        "px-3 py-1 text-xs font-black uppercase tracking-widest",
                                        req.status === 'APPROVED' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                                    )}>
                                        {req.status}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
