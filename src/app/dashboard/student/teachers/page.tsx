'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    User,
    MessageCircle,
    Mail,
    BookOpen,
    Search,
    ChevronRight,
    GraduationCap,
    Clock
} from 'lucide-react';
import { getStudentProfile } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function StudentTeachersPage() {
    const { data: session } = useSession();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchTeachers();
        }
    }, [session]);

    async function fetchTeachers() {
        setIsLoading(true);
        const res = await getStudentProfile((session?.user as any).id);
        const profile = res.data as any;
        if (res.success && profile?.class?.subjects) {
            // Extract unique teachers from subjects
            const teacherMap: Record<string, any> = {};
            profile.class.subjects.forEach((sub: any) => {
                sub.teachers.forEach((t: any) => {
                    if (!teacherMap[t.id]) {
                        teacherMap[t.id] = {
                            ...t,
                            subjects: [sub.name]
                        };
                    } else if (!teacherMap[t.id].subjects.includes(sub.name)) {
                        teacherMap[t.id].subjects.push(sub.name);
                    }
                });
            });
            setTeachers(Object.values(teacherMap));
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        My Teachers
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Get in touch with your instructors and view their academic specialties.
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search instructors..."
                        className="h-11 pl-10 pr-4 rounded-xl border border-brand-100 bg-white/50 backdrop-blur shadow-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all font-bold"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-brand-50/50 animate-pulse border-2 border-dashed border-brand-100" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher, idx) => (
                        <Card
                            key={teacher.id}
                            className="group overflow-hidden glass border-none shadow-soft hover:shadow-medium transition-all duration-500 transform hover:-translate-y-1"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-black text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                        {teacher.user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                            {teacher.user.username}
                                        </CardTitle>
                                        <p className="text-xs font-bold text-brand-600 flex items-center gap-1">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            Senior Instructor
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Subjects</p>
                                    <div className="flex flex-wrap gap-2">
                                        {teacher.subjects.map((sub: string, i: number) => (
                                            <span key={i} className="px-3 py-1 rounded-lg bg-brand-50 text-[10px] font-black text-brand-700 border border-brand-100/50">
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-brand-50/50 flex items-center justify-between">
                                    <div className="flex gap-1">
                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 flex flex-col justify-center">
                                            Response Time
                                            <span className="text-gray-900 font-black uppercase">~2 Hours</span>
                                        </span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-brand-400 hover:text-brand-600 hover:bg-brand-50" asChild>
                                        <Link href={`/dashboard/communication/messages?recipient=${teacher.user.id}`}>
                                            <MessageCircle className="w-5 h-5" />
                                        </Link>
                                    </Button>
                                </div>

                                <Button className="w-full h-11 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold shadow-lg shadow-brand-600/20 gap-2">
                                    Visit Profile
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {teachers.length === 0 && (
                        <div className="col-span-full p-20 text-center flex flex-col items-center gap-4 bg-white/50 backdrop-blur rounded-3xl border-2 border-dashed border-brand-100">
                            <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
                                <User className="w-10 h-10 text-brand-200" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800">No Teachers Found</h3>
                                <p className="text-muted-foreground font-medium">We couldn't retrieve your instructor list at this time.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
