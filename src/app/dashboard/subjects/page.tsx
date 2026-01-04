'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Users,
    ArrowRight,
    Search,
    Filter,
    GraduationCap,
    BookMarked,
    Calendar,
    Target
} from 'lucide-react';
import { getTeacherSubjects } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AssignedSubjectsPage() {
    const { data: session } = useSession();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (session?.user?.id) {
            fetchSubjects();
        }
    }, [session]);

    async function fetchSubjects() {
        setIsLoading(true);
        // Using teacherProfile ID if available, otherwise userId as fallback
        const teacherId = (session?.user as any).id;
        const res = await getTeacherSubjects(teacherId);
        if (res.success && res.data) {
            setSubjects(res.data);
        }
        setIsLoading(false);
    }

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Assigned Subjects
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Explore and manage the curriculum for your assigned academic disciplines.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <BookMarked className="w-4 h-4" />
                        Curriculum Guide
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search subjects by name or code..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                    ))
                ) : (
                    filteredSubjects.map((subject, idx) => (
                        <Card
                            key={subject.id}
                            className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="h-2 bg-gradient-to-r from-brand-400 to-brand-600" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-700 border border-brand-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <BookOpen className="w-7 h-7" />
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 rounded-full bg-brand-100 text-[10px] font-black text-brand-700 uppercase tracking-widest">
                                            {subject.code || 'SUB-LOG'}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                        {subject.name}
                                    </CardTitle>
                                    <p className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-1.5 text-brand-600/80">
                                        <Target className="w-3.5 h-3.5" />
                                        Advanced Curriculum
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-2">
                                <div className="flex flex-col gap-3">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Classes</div>
                                    <div className="flex flex-wrap gap-2">
                                        {subject.classes?.length > 0 ? (
                                            subject.classes.map((cls: any) => (
                                                <span key={cls.id} className="px-3 py-1.5 rounded-lg bg-white border border-brand-100 text-[11px] font-black text-brand-800 shadow-sm flex items-center gap-2">
                                                    <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                                                    {cls.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400 italic">No classes assigned yet</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-brand-50/50 flex gap-2">
                                    <Button className="flex-1 h-11 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2 btn-shine shadow-lg shadow-brand-200" asChild>
                                        <Link href={`/dashboard/teacher/class-lists`}>
                                            View Rosters
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="h-11 w-11 rounded-xl border-brand-100 text-brand-600 p-0 hover:bg-brand-50">
                                        <Calendar className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}

                {!isLoading && filteredSubjects.length === 0 && (
                    <div className="col-span-full p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-brand-200" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">No Subjects Found</h3>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 leading-relaxed">
                                We couldn't find any subjects matching your search criteria or assigned to your profile.
                            </p>
                        </div>
                        <Button className="h-12 px-8 rounded-xl bg-brand-600 text-white font-black hover:bg-brand-700 shadow-lg" onClick={() => setSearchQuery('')}>
                            Clear Search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
