'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Settings,
    Save,
    History,
    Shield,
    Globe,
    BookOpen,
    Mail,
    Image as ImageIcon,
    Clock,
    User,
    Activity,
    SearchX,
    ChevronRight
} from 'lucide-react';
import { getSchoolSettings, updateSchoolSettings, getAuditLogs } from '@/actions/admin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<any>({});
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setIsLoading(true);
        const [settingsRes, logsRes] = await Promise.all([
            getSchoolSettings(),
            getAuditLogs()
        ]);

        if (settingsRes.success) setSettings(settingsRes.data);
        if (logsRes.success) setLogs(logsRes.data || []);
        setIsLoading(false);
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(updateSchoolSettings(settings), {
            loading: 'Saving global configuration...',
            success: 'Settings updated successfully!',
            error: 'Failed to update settings'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Institutional Settings
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Configure school-wide parameters, academic sessions, and monitor system health.
                    </p>
                </div>
                <Button
                    className="h-12 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    onClick={handleSave}
                >
                    <Save className="w-5 h-5" />
                    Apply Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Forms */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="border-b border-brand-50/50">
                            <CardTitle className="flex items-center gap-2 text-xl font-black">
                                <Globe className="w-5 h-5 text-brand-600" />
                                School Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">School Name</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 px-4 rounded-xl border border-brand-100 bg-white font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                                        value={settings.schoolName || ''}
                                        onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                                        <input
                                            type="email"
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none"
                                            value={settings.contactEmail || ''}
                                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="border-b border-brand-50/50">
                            <CardTitle className="flex items-center gap-2 text-xl font-black">
                                <BookOpen className="w-5 h-5 text-brand-600" />
                                Academic Cycle
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Session</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-brand-100 bg-white font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
                                        value={settings.currentSession || ''}
                                        onChange={(e) => setSettings({ ...settings, currentSession: e.target.value })}
                                    >
                                        <option>2024/2025</option>
                                        <option>2025/2026</option>
                                        <option>2026/2027</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Term</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-brand-100 bg-white font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
                                        value={settings.currentTerm || ''}
                                        onChange={(e) => setSettings({ ...settings, currentTerm: e.target.value })}
                                    >
                                        <option>First Term</option>
                                        <option>Second Term</option>
                                        <option>Third Term</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Audit Logs Sidebar */}
                <Card className="glass border-none shadow-soft overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-brand-50/50 border-b border-brand-50/50">
                        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                            <History className="w-4 h-4 text-brand-600" />
                            System Audit Logs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto max-h-[600px]">
                        {logs.length > 0 ? (
                            <div className="divide-y divide-brand-50/50">
                                {logs.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-brand-50/30 transition-all space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded-lg bg-brand-100 text-[8px] font-black text-brand-700 tracking-widest uppercase">
                                                {log.action}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed">
                                            {log.details}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-400 uppercase">
                                            <User className="w-3 h-3" />
                                            By: {log.user}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <Activity className="w-12 h-12 text-brand-100" />
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest leading-none">Safe & Secure</p>
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-brand-50/50 bg-brand-50/10">
                        <Button variant="ghost" className="w-full text-xs font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50 gap-2">
                            View Full History Report
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
