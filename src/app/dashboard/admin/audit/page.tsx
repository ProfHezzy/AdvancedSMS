'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    History,
    Search,
    Filter,
    Shield,
    ShieldAlert,
    ShieldCheck,
    User,
    Lock,
    Key,
    ExternalLink,
    Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuditLogsPage() {
    const logs = [
        { id: 'LOG-001', event: 'User Login', user: 'admin@school.com', role: 'ADMIN', ip: '192.168.1.1', time: '2 mins ago', level: 'info' },
        { id: 'LOG-002', event: 'Password Reset', user: 'teacher@school.com', role: 'TEACHER', ip: '10.0.0.42', time: '15 mins ago', level: 'warning' },
        { id: 'LOG-003', event: 'Result Released', user: 'principal@school.com', role: 'ADMIN', ip: '192.168.1.1', time: '1 hour ago', level: 'info' },
        { id: 'LOG-004', event: 'Wallet Deduction', user: 'finance@school.com', role: 'ACCOUNTANT', ip: '192.168.1.5', time: '2 hours ago', level: 'info' },
        { id: 'LOG-005', event: 'Failed Login Attempt', user: 'unknown@user.com', role: 'NONE', ip: '185.22.33.44', time: '3 hours ago', level: 'critical' },
        { id: 'LOG-006', event: 'Role Permission Update', user: 'superadmin@school.com', role: 'SUPER_ADMIN', ip: '127.0.0.1', time: '5 hours ago', level: 'warning' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Security Audit Logs
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Track every critical event and system interaction across the institution.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Export Logs
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Shield className="w-4 h-4" />
                        Security Settings
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Login Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-black text-emerald-600">Secure</h2>
                        <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            No unusual login patterns
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Active Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-black text-blue-600">84</h2>
                        <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-500" />
                            Current users online
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-rose-50/30 border-rose-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-rose-500 uppercase tracking-widest text-muted-foreground">Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-3xl font-black text-rose-600">1</h2>
                        <p className="text-[10px] font-black text-rose-500 mt-1 uppercase tracking-wider flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            Failed login attempt blocked
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white/50 backdrop-blur rounded-3xl border border-brand-100 shadow-soft overflow-hidden">
                <div className="p-6 border-b border-brand-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by event, user or IP..."
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-brand-100 bg-white/50 outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="h-11 rounded-xl border-brand-100 font-bold gap-2">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Audit Event</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Initiated By</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Network Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-50">
                            {logs.map((log, i) => (
                                <tr key={i} className="hover:bg-brand-50/20 transition-colors">
                                    <td className="px-6 py-4 border-l-4 border-transparent hover:border-brand-500">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                                                log.level === 'critical' ? "bg-rose-100 text-rose-600" :
                                                    log.level === 'warning' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                            )}>
                                                {log.level === 'critical' ? <ShieldAlert className="w-4 h-4" /> :
                                                    log.level === 'warning' ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{log.event}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black">{log.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                                                <User className="w-3 h-3" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-700">{log.user}</p>
                                                <p className="text-[10px] font-black text-brand-400 uppercase tracking-tighter">{log.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                            <Activity className="w-3 h-3" />
                                            {log.ip}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.time}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
