'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    LockKeyhole,
    Save,
    Check,
    X,
    AlertCircle,
    Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AdminPermissionsPage() {
    const roles = ['TEACHER', 'STUDENT', 'PARENT', 'HR', 'MEDICAL', 'SECURITY'];
    const resources = [
        { name: 'Student Records', key: 'students' },
        { name: 'Exam Results', key: 'results' },
        { name: 'Financials', key: 'finance' },
        { name: 'Staff Data', key: 'staff' },
        { name: 'System Settings', key: 'settings' },
        { name: 'Communication', key: 'comms' },
    ];

    // Initial mock state - this would come from a DB in a full implementation
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
        TEACHER: { students: true, results: true, finance: false, staff: false, settings: false, comms: true },
        STUDENT: { students: false, results: true, finance: false, staff: false, settings: false, comms: true },
        PARENT: { students: false, results: true, finance: true, staff: false, settings: false, comms: true },
        HR: { students: false, results: false, finance: true, staff: true, settings: false, comms: true },
        MEDICAL: { students: true, results: false, finance: false, staff: false, settings: false, comms: false },
        SECURITY: { students: true, results: false, finance: false, staff: false, settings: false, comms: false },
    });

    const togglePermission = (role: string, resource: string) => {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [resource]: !prev[role][resource]
            }
        }));
    };

    const handleSave = () => {
        toast.info('This is a demo interface. Permission changes are currently hardcoded in navigation guards.');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Access Control
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Configure granular resource permissions for each user role.
                    </p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2 btn-shine"
                    onClick={handleSave}
                >
                    <Save className="w-4 h-4" />
                    Save Configuration
                </Button>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center gap-3 text-amber-800">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                        <strong>Security Note:</strong> Modifying these permissions affects high-level route guards. Ensure strict compliance with data privacy policies when granting access to 'Student Records' or 'Financials'.
                    </p>
                </div>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 font-black text-xs text-gray-500 uppercase tracking-widest border-b border-gray-100 min-w-[200px]">
                                    Resource / Module
                                </th>
                                {roles.map(role => (
                                    <th key={role} className="p-6 font-black text-xs text-center text-gray-500 uppercase tracking-widest border-b border-gray-100 border-l border-dashed border-gray-200">
                                        {role}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((res) => (
                                <tr key={res.key} className="hover:bg-brand-50/30 transition-colors group">
                                    <td className="p-6 font-bold text-gray-900 border-b border-gray-50 border-r border-dashed border-gray-200 group-hover:bg-white/50">
                                        <div className="flex items-center gap-2">
                                            {res.name}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-3 h-3 text-gray-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Controls access to {res.name} routes</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </td>
                                    {roles.map(role => {
                                        const isAllowed = permissions[role][res.key];
                                        return (
                                            <td key={role} className="p-0 border-b border-gray-50 border-l border-dashed border-gray-200">
                                                <button
                                                    onClick={() => togglePermission(role, res.key)}
                                                    className={cn(
                                                        "w-full h-16 flex items-center justify-center transition-all",
                                                        isAllowed
                                                            ? "bg-green-50/50 hover:bg-green-100 text-green-600"
                                                            : "bg-transparent hover:bg-rose-50 text-gray-300 hover:text-rose-400 invert-on-hover"
                                                    )}
                                                >
                                                    {isAllowed ? (
                                                        <Check className="w-5 h-5 stroke-[3]" />
                                                    ) : (
                                                        <X className="w-5 h-5 stroke-[3]" />
                                                    )}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
