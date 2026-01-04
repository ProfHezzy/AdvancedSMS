'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    TrendingUp,
    Clock,
    AlertCircle,
    ChevronRight,
    GraduationCap,
    BookOpen,
    Calendar,
    BadgeCheck,
    MessageCircle
} from 'lucide-react';
import { getWards, getWardAcademicSummary } from '@/actions/parent';
import { useSession } from 'with-next-auth/react'; // Adjusting to likely auth lib or generic
import { useSession as useNextSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ParentWardsPage() {
    const { data: session } = useNextSession();
    const [wards, setWards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchWards();
        }
    }, [session]);

    async function fetchWards() {
        setIsLoading(true);
        const res = await getWards((session?.user as any).id);
        if (res.success && res.data) {
            setWards(res.data);
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        My Wards
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor the academic progress and well-being of your children.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Contact Teachers
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {isLoading ? (
                    [1, 2].map(i => (
                        <div key={i} className="h-96 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                    ))
                ) : (
                    wards.map((ward, idx) => (
                        <Card
                            key={ward.id}
                            className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="h-2 bg-gradient-to-r from-brand-400 to-brand-600" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-black text-3xl shadow-inner group-hover:scale-105 transition-transform duration-500">
                                            {ward.user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                {ward.user.username}
                                            </CardTitle>
                                            <p className="text-xs font-bold text-brand-600 flex items-center gap-1.5 mt-1">
                                                <GraduationCap className="w-4 h-4" />
                                                {ward.class?.name || 'Academic Scholar'}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <span className="px-2 py-0.5 rounded-lg bg-green-50 text-[10px] font-black text-green-700 border border-green-100">EXCELLENT</span>
                                                <span className="px-2 py-0.5 rounded-lg bg-brand-50 text-[10px] font-black text-brand-700 border border-brand-100">PROBATION CLEAR</span>
                                            </div>
                                        </div>
                                    </div>
                                    <BadgeCheck className="w-6 h-6 text-green-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 mt-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 rounded-2xl bg-brand-50/50 border border-brand-100/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Attendance</p>
                                        <p className="text-xl font-black text-brand-700 mt-2">94%</p>
                                    </div>
                                    <div className="text-center p-3 rounded-2xl bg-brand-50/50 border border-brand-100/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Rank</p>
                                        <p className="text-xl font-black text-brand-700 mt-2">12 / 32</p>
                                    </div>
                                    <div className="text-center p-3 rounded-2xl bg-green-50 border border-green-100">
                                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Conduct</p>
                                        <p className="text-sm font-black text-green-700 mt-2">A+</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                        <span>Current Performance</span>
                                        <span className="text-brand-600 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Active Trending
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-500 w-[85%] transition-all duration-1000" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-brand-50/50 flex flex-col md:flex-row gap-2">
                                    <Button className="flex-1 h-11 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2 btn-shine shadow-lg shadow-brand-200" asChild>
                                        <Link href={`/dashboard/parent/wards/${ward.id}/report`}>
                                            Full Report
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-11 rounded-xl border-brand-100 text-brand-600 font-bold gap-2 hover:bg-brand-50" asChild>
                                        <Link href={`/dashboard/parent/fees?ward=${ward.id}`}>
                                            Financials
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}

                {!isLoading && wards.length === 0 && (
                    <div className="col-span-full p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center">
                            <Users className="w-10 h-10 text-brand-200" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-800">No Wards Linked</h3>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2">
                                Please contact the school's administrative office to link your children's profiles to your parent account.
                            </p>
                        </div>
                        <Button className="h-12 px-8 rounded-xl bg-brand-600 text-white font-black shadow-lg">
                            Request Account Link
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
