'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Plus,
    GraduationCap,
    BookOpen,
    MoreVertical,
    Search
} from 'lucide-react';
import { getClasses, createClass } from '@/actions/admin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    async function fetchClasses() {
        setIsLoading(true);
        const res = await getClasses();
        if (res.success && res.data) {
            setClasses(res.data);
        }
        setIsLoading(false);
    }

    const handleCreate = () => {
        toast.info('Opening class creation dialog...');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Class Registry
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage class streams and assign form teachers.
                    </p>
                </div>
                <Button
                    className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5" />
                    Add Class
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search class..."
                    className="w-full md:w-96 h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                    ))
                ) : classes.length > 0 ? (
                    classes.map((cls, idx) => (
                        <Card
                            key={cls.id}
                            className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <CardHeader className="pb-4 relative">
                                <div className="absolute top-4 right-4">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-black text-xl shadow-inner group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                                    {cls.name.substring(0, 3)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">
                                        {cls.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                        Level: {cls.level}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-brand-50/50 p-2 rounded-lg">
                                        <Users className="w-4 h-4 text-brand-400" />
                                        <span className="font-bold">35 Students</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-brand-50/50 p-2 rounded-lg">
                                        <GraduationCap className="w-4 h-4 text-brand-400" />
                                        <span className="font-bold truncate">
                                            {cls.teacher?.user?.username || 'No Teacher Assigned'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                        <Users className="w-12 h-12 text-brand-200" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">No Classes Found</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                            Create your first class to begin enrollment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
