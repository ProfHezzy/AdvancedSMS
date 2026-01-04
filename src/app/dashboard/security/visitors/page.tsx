'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Shield,
    Search,
    UserPlus,
    Clock,
    MapPin,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data as Visitor model is likely missing
const MOCK_VISITORS = [
    { id: '1', name: 'John Doe', purpose: 'Parent Inquiry', host: 'Principal', entryTime: '2026-01-04T08:30:00', exitTime: null, status: 'ACTIVE' },
    { id: '2', name: 'Jane Smith', purpose: 'Vendor Delivery', host: 'Bursar', entryTime: '2026-01-04T09:15:00', exitTime: '2026-01-04T09:45:00', status: 'CHECKED_OUT' },
    { id: '3', name: 'Michael Brown', purpose: 'Ministry Inspection', host: 'Admin', entryTime: '2026-01-04T10:00:00', exitTime: null, status: 'ACTIVE' },
];

export default function VisitorLogPage() {
    const [visitors, setVisitors] = useState(MOCK_VISITORS);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCheckout = (id: string) => {
        setVisitors(prev => prev.map(v =>
            v.id === id ? { ...v, status: 'CHECKED_OUT', exitTime: new Date().toISOString() } : v
        ));
        toast.success('Visitor checked out successfully');
    };

    const filteredVisitors = visitors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Visitor Registry
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Track entry and exit of campus guests.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2 btn-shine">
                    <UserPlus className="w-5 h-5" />
                    Log New Visitor
                </Button>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search visitors..."
                            className="pl-9 h-12 bg-white/50 border-brand-100 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100">Visitor Details</th>
                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100">Purpose & Host</th>
                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100">Timing</th>
                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100 text-center">Status</th>
                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredVisitors.map(visitor => (
                                <tr key={visitor.id} className="hover:bg-brand-50/30 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                                {visitor.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900">{visitor.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="bg-white border-brand-100 text-brand-700 font-bold">
                                                {visitor.purpose}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Visiting: {visitor.host}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1 text-sm font-medium">
                                            <div className="flex items-center gap-2 text-green-600">
                                                <checkCircle2 className="w-3 h-3" /> In: {new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {visitor.exitTime && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <XCircle className="w-3 h-3" /> Out: {new Date(visitor.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <Badge className={cn(
                                            "font-black uppercase tracking-widest",
                                            visitor.status === 'ACTIVE'
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        )}>
                                            {visitor.status === 'ACTIVE' ? 'On Campus' : 'Departed'}
                                        </Badge>
                                    </td>
                                    <td className="p-6 text-right">
                                        {visitor.status === 'ACTIVE' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleCheckout(visitor.id)}
                                                className="bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-md"
                                            >
                                                Check Out
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
