'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    BookOpen,
    TrendingUp,
    GraduationCap,
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';
import { getTeacherClasses } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function TeacherClassesPage() {
    const { data: session } = useSession();
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchClasses();
        }
    }, [session]);

    async function fetchClasses() {
        setIsLoading(true);
        const res = await getTeacherClasses((session?.user as any).id);
        if (res.success && res.data) {
            setClasses(res.data);
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        My Classes
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your assigned classrooms and track academic excellence.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Find a class..."
                            className="h-11 pl-10 pr-4 rounded-xl border border-brand-100 bg-white/50 backdrop-blur shadow-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold"
                        />
                    </div>
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
                    {classes.map((cls, idx) => (
                        <Card
                            key={cls.id}
                            className="group overflow-hidden glass border-none shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="h-3 bg-gradient-to-r from-brand-500 to-brand-700" />
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 shadow-inner">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-green-50 text-[10px] font-black text-green-700 uppercase tracking-widest">
                                        Active
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                        {cls.name}
                                    </CardTitle>
                                    <CardDescription className="font-bold flex items-center gap-1 mt-1">
                                        Class Teacher: <span className="text-brand-600">You</span>
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-2xl bg-brand-50/50 border border-brand-100/50 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-3.5 h-3.5 text-brand-500" />
                                            <span className="text-[10px] font-black uppercase text-gray-400">Students</span>
                                        </div>
                                        <p className="text-lg font-black text-gray-800">32</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-brand-50/50 border border-brand-100/50 group-hover:bg-white transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                            <span className="text-[10px] font-black uppercase text-gray-400">Avg Performance</span>
                                        </div>
                                        <p className="text-lg font-black text-gray-800">78%</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 h-12 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold shadow-lg shadow-brand-600/20 gap-2" asChild>
                                        <Link href="/dashboard/teacher/class-lists">
                                            Manage Roster
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="h-12 w-12 rounded-xl border-brand-100 hover:bg-brand-50 p-0 text-brand-600">
                                        <BookOpen className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add Pseudo-Class for placeholder */}
                    {classes.length === 0 && (
                        <div className="col-span-full p-20 text-center flex flex-col items-center gap-4 bg-white/50 backdrop-blur rounded-3xl border-2 border-dashed border-brand-100">
                            <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
                                <Users className="w-10 h-10 text-brand-200" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800">No Classes Assigned</h3>
                                <p className="text-muted-foreground font-medium">Please contact the administrator to assign classes to your profile.</p>
                            </div>
                            <Button className="bg-brand-600 hover:bg-brand-700 rounded-xl font-bold h-12 px-8">
                                Request Access
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
