'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users,
    Search,
    CheckCircle2,
    Clock,
    AlertCircle,
    UserPlus,
    Filter,
    MoreVertical,
    Download
} from 'lucide-react';
import { AdmissionModal } from '@/components/admission/AdmissionModal';
import { getRecentAdmissions } from '@/actions/admission-support';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function AdmissionPage() {
    const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAdmissions();
    }, []);

    async function fetchAdmissions() {
        setIsLoading(true);
        const res = await getRecentAdmissions(20);
        if (res.success) {
            setRecentAdmissions(res.data);
        }
        setIsLoading(false);
    }

    const filteredAdmissions = recentAdmissions.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-gray-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Admissions Center
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Elite Enrollment Management & Profile Compliance Tracking
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <AdmissionModal onSuccess={fetchAdmissions} />
                </div>
            </div>

            {/* Stats Overview (Optional / Summary) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Admitted', value: recentAdmissions.length, icon: <Users className="w-5 h-5" />, color: 'bg-brand-50 text-brand-600' },
                    { label: 'Profile Compliant', value: recentAdmissions.filter(s => (s.studentProfile?.profileCompletion || 0) >= 80).length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
                    { label: 'Incomplete Profiles', value: recentAdmissions.filter(s => (s.studentProfile?.profileCompletion || 0) < 80).length, icon: <AlertCircle className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600' },
                    { label: 'Drafts/Pending', value: recentAdmissions.filter(s => s.studentProfile?.admissionStatus !== 'ADMITTED').length, icon: <Clock className="w-5 h-5" />, color: 'bg-gray-50 text-gray-600' },
                ].map((stat, i) => (
                    <Card key={i} className="glass border-none shadow-soft overflow-hidden">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", stat.color)}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <Card className="glass border-none shadow-soft overflow-hidden min-h-[500px]">
                <CardHeader className="p-8 border-b border-gray-100 bg-white/50 backdrop-blur-md flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, ID or portal username..."
                                className="pl-12 h-12 rounded-2xl border-gray-100 shadow-sm focus:ring-brand-500 w-full"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-12 w-12 rounded-2xl border-gray-100 p-0">
                            <Filter className="w-5 h-5 text-gray-400" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Student Details</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Class & Arm</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Profile Compliance</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-8 py-6"><div className="h-10 w-48 bg-gray-100 rounded-lg"></div></td>
                                            <td className="px-8 py-6"><div className="h-10 w-32 bg-gray-100 rounded-lg"></div></td>
                                            <td className="px-8 py-6"><div className="h-10 w-40 bg-gray-100 rounded-lg"></div></td>
                                            <td className="px-8 py-6"><div className="h-8 w-24 bg-gray-100 rounded-full"></div></td>
                                            <td className="px-8 py-6"><div className="h-8 w-8 bg-gray-100 rounded-lg mx-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredAdmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-gray-400">
                                                <Users className="w-16 h-16 opacity-20" />
                                                <p className="font-bold text-lg uppercase tracking-tight">No admissions found</p>
                                                <p className="text-sm font-medium">Try adjusting your search or add a new student.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAdmissions.map((student) => {
                                    const compliance = student.studentProfile?.profileCompletion || 0;
                                    const status = student.studentProfile?.admissionStatus || 'ADMITTED';

                                    return (
                                        <tr key={student.id} className="hover:bg-brand-50/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-black flex items-center justify-center shadow-sm">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-base">{student.name}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{student.studentProfile?.studentId || 'NO-ID'}</span>
                                                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{student.username}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-gray-700 uppercase">{student.studentProfile?.class?.name || '---'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Arm: {student.studentProfile?.arm || 'N/A'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="w-full max-w-[160px] space-y-2">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        <span>Compliance</span>
                                                        <span className={cn(compliance >= 80 ? "text-green-600" : "text-amber-600")}>{compliance}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className={cn(
                                                                "h-full transition-all duration-1000",
                                                                compliance >= 80 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-amber-500"
                                                            )}
                                                            style={{ width: `${compliance}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={cn(
                                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight inline-flex items-center justify-center gap-2",
                                                    compliance < 80
                                                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                        : "bg-green-100 text-green-700 border border-green-200"
                                                )}>
                                                    <div className={cn("w-2 h-2 rounded-full animate-pulse", compliance < 80 ? "bg-amber-500" : "bg-green-500")} />
                                                    {compliance < 80 ? 'Profile Incomplete' : 'Compliant'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-brand-100 hover:text-brand-700 text-gray-400 group-hover:scale-110 transition-transform">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

