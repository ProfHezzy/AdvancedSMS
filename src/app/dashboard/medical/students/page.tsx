'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Heart,
    Search,
    Filter,
    MoreVertical,
    Stethoscope,
    Activity,
    AlertCircle,
    ChevronRight,
    Users,
    Droplet,
    Dna
} from 'lucide-react';
import { getClassList } from '@/actions/academic';
import { getStudentMedicalProfile } from '@/actions/medical';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

export default function MedicalStudentDirectoryPage() {
    const { data: session } = useSession();
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        setIsLoading(true);
        // In a real app, we'd fetch all students or by class
        const res = await getClassList('default-class-id'); // For demo
        if (res.success && res.data) {
            setStudents(res.data);
        }
        setIsLoading(false);
    }

    const filteredStudents = students.filter(s =>
        s.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
                        Health Directory
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor and manage student health profiles and medical requirements.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="h-12 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 font-black shadow-lg shadow-rose-600/20 gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Medical Emergency Alert
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search student by name or ID..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-brand-100">
                    <Filter className="w-5 h-5 text-gray-400" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-3xl bg-rose-50/50 animate-pulse border border-rose-100" />
                    ))
                ) : (
                    filteredStudents.map((student, idx) => (
                        <Card
                            key={student.id}
                            className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="h-1.5 bg-gradient-to-r from-rose-400 to-rose-600" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100 shadow-inner group-hover:scale-110 transition-transform">
                                        <Heart className="w-7 h-7" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2 text-right">
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">{student.class?.name || 'GEN-A'}</span>
                                        <div className="flex gap-1">
                                            <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-[10px] font-black text-rose-700">ASTHMA</span>
                                            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-[10px] font-black text-amber-700">PEANUTS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-rose-700 transition-colors capitalize">
                                        {student.user.username}
                                    </h3>
                                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-1">
                                        STU-{student.id.slice(0, 5).toUpperCase()}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-100/50 space-y-1">
                                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">Blood Group</p>
                                        <div className="flex items-center gap-1.5 font-black text-rose-700">
                                            <Droplet className="w-3.5 h-3.5" />
                                            O Positive
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-brand-50/50 border border-brand-100/50 space-y-1">
                                        <p className="text-[10px] font-black text-brand-400 uppercase tracking-tighter">Genotype</p>
                                        <div className="flex items-center gap-1.5 font-black text-brand-700">
                                            <Dna className="w-3.5 h-3.5" />
                                            AA
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-brand-50/50 flex gap-2">
                                    <Button className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs gap-2">
                                        Medical Record
                                        <ChevronRight className="w-3 h-3" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-brand-100 text-brand-400 hover:text-rose-600">
                                        <Stethoscope className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}

                {filteredStudents.length === 0 && !isLoading && (
                    <div className="col-span-full p-20 text-center flex flex-col items-center gap-4 bg-white/50 backdrop-blur rounded-3xl border-2 border-dashed border-rose-100">
                        <Activity className="w-16 h-16 text-rose-100" />
                        <div>
                            <h3 className="text-xl font-black text-gray-800">No Student Records Found</h3>
                            <p className="text-muted-foreground font-medium">Clear search filters or contact Admin for student data sync.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
