'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    Filter,
    Calendar,
    FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { getLeaveRequests, updateLeaveStatus } from '@/actions/hr';
import { cn } from '@/lib/utils';

export default function ApprovalsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const res = await getLeaveRequests();
        if (res.success && res.data) {
            setRequests(res.data);
        }
        setIsLoading(false);
    }

    const handleAction = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
        const res = await updateLeaveStatus(requestId, status);
        if (res.success) {
            toast.success(`Request ${status.toLowerCase()} successfully!`);
            loadData();
        } else {
            toast.error('Failed to update request status.');
        }
    };

    const filteredRequests = requests.filter(r =>
        filter === 'ALL' ? true : r.status === filter
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Approvals
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage staff leave requests and administrative approvals.
                    </p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-brand-50 gap-1">
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                filter === f ? "bg-brand-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredRequests.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-2 border-brand-100 bg-transparent">
                        <FileText className="w-16 h-16 text-brand-100 mx-auto mb-4" />
                        <p className="text-xl font-black text-brand-300 uppercase italic">No {filter.toLowerCase()} requests found.</p>
                    </Card>
                ) : (
                    filteredRequests.map((request) => (
                        <Card key={request.id} className="glass border-none shadow-soft overflow-hidden animate-in slide-in-from-bottom-2">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-6 md:w-1/3 bg-brand-50/30 border-r border-brand-50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                                <AvatarImage src={request.staff.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.staff.user.name}`} />
                                                <AvatarFallback>{request.staff.user.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-black text-gray-900 leading-tight">{request.staff.user.name}</p>
                                                <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{request.staff.role}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <Calendar className="w-4 h-4 text-brand-300" />
                                                <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-tighter">
                                                <Clock className="w-4 h-4" />
                                                <span>{request.type} Leave</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Reason for application</h4>
                                            <p className="text-sm font-medium text-gray-700 leading-relaxed italic border-l-4 border-brand-100 pl-4 py-1">
                                                "{request.reason || 'No reason provided'}"
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="text-[10px] font-bold text-gray-400">
                                                Submitted on {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                            {request.status === 'PENDING' ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleAction(request.id, 'REJECTED')}
                                                        variant="ghost"
                                                        className="h-10 px-6 rounded-xl border border-rose-100 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" /> Reject
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleAction(request.id, 'APPROVED')}
                                                        className="h-10 px-8 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-green-600/20"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border",
                                                    request.status === 'APPROVED' ? "bg-green-50 border-green-100 text-green-600" : "bg-rose-50 border-rose-100 text-rose-600"
                                                )}>
                                                    {request.status === 'APPROVED' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    {request.status}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
