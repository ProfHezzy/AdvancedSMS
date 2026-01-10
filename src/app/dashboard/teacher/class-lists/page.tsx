'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Search,
    MoreHorizontal,
    FileSpreadsheet,
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronRight,
    Users,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getTeacherClasses, getClassList } from '@/actions/academic';
import { useSession } from 'next-auth/react';

export default function ClassListsPage() {
    const { data: session } = useSession();
    const [classes, setClasses] = useState<any[]>([]);
    const [expandedClass, setExpandedClass] = useState<string | null>(null);
    const [studentsMap, setStudentsMap] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (session?.user?.id) {
            fetchClasses();
        }
    }, [session]);

    async function fetchClasses() {
        setIsLoading(true);
        const res = await getTeacherClasses(session?.user?.id as string);
        if (res.success && res.data) {
            setClasses(res.data);
            if (res.data.length > 0) {
                toggleExpand(res.data[0].id);
            }
        }
        setIsLoading(false);
    }

    async function toggleExpand(classId: string) {
        if (expandedClass === classId) {
            setExpandedClass(null);
            return;
        }

        setExpandedClass(classId);
        if (!studentsMap[classId]) {
            const res = await getClassList(classId);
            if (res.success && res.data) {
                setStudentsMap(prev => ({ ...prev, [classId]: res.data }));
            }
        }
    }

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Class Lists
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage student rosters and view profiles for your assigned classes.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by class name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono text-sm"
                />
            </div>

            <div className="space-y-4">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                        <Card key={cls.id} className="glass border-none shadow-soft overflow-hidden transition-all group">
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-brand-50/30 transition-colors"
                                onClick={() => toggleExpand(cls.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                        expandedClass === cls.id ? "bg-brand-600 text-white shadow-lg" : "bg-brand-50 text-brand-600 group-hover:bg-brand-100"
                                    )}>
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900">{cls.name}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-none mt-1">
                                            ID: {cls.id.substring(0, 8)}
                                        </p>
                                    </div>
                                </div>
                                {expandedClass === cls.id ? (
                                    <ChevronDown className="w-5 h-5 text-brand-600" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-400" />
                                )}
                            </div>

                            {expandedClass === cls.id && (
                                <div className="border-t border-brand-50 bg-white/40 animate-slide-down">
                                    {!studentsMap[cls.id] ? (
                                        <div className="p-12 flex justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-brand-300" />
                                        </div>
                                    ) : studentsMap[cls.id]?.length > 0 ? (
                                        <div className="divide-y divide-brand-50">
                                            {studentsMap[cls.id]?.map((student) => (
                                                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-white transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                                            <AvatarImage src={student.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user.name || student.user.username}`} />
                                                            <AvatarFallback>{(student.user.name || student.user.username)[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{student.user.name || student.user.username}</p>
                                                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">
                                                                Admission No: {student.admissionNo || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-black text-[9px] bg-brand-50 border-brand-100 text-brand-600">
                                                            {student.gender || 'N/A'}
                                                        </Badge>
                                                        <div className="w-px h-4 bg-brand-50 mx-2" />
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600 hover:bg-brand-50">
                                                            <Mail className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600 hover:bg-brand-50">
                                                            <MessageCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600 hover:bg-brand-50">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center text-gray-400 font-medium italic">
                                            No students registered for this class yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))
                ) : (
                    <div className="p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                        <Users className="w-12 h-12 text-brand-200" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">No Assigned Classes</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                            You are not currently assigned as a form teacher for any class.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
