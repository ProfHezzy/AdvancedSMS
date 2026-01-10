'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Search,
    Filter,
    Mail,
    Phone,
    BarChart3,
    FileText,
    MoreHorizontal,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { getStudentsForManagement } from '@/actions/student-management';
import { getTeacherClasses } from '@/actions/attendance';
import { getAdminClasses } from '@/actions/admission-support';

export default function StudentProfilesPage() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [students, setStudents] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    useEffect(() => {
        if (!isLoading) {
            fetchStudents();
        }
    }, [filterClass]);

    async function fetchData() {
        setIsLoading(true);
        const user = session?.user as any;

        // Fetch Classes for Filter
        let classRes;
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            classRes = await getAdminClasses();
        } else {
            // For teachers, only show their classes in filter
            classRes = await getTeacherClasses(user.id);
        }

        if (classRes.success) setClasses(classRes.data || []);

        // Initial Student Fetch
        await fetchStudents();
        setIsLoading(false);
    }

    async function fetchStudents() {
        const user = session?.user as any;
        if (!user) return;

        const res = await getStudentsForManagement({
            classId: filterClass === 'all' ? undefined : filterClass,
            role: user.role,
            userId: user.id
        });

        if (res.success) {
            setStudents(res.data);
        }
    }

    const filteredStudents = students.filter(student => {
        const name = student.user.name || 'Unknown Student';
        const email = student.user.email || '';

        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96 animate-fade-in">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Student Profiles
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Comprehensive directory of all students you teach.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-12 pl-12 pr-4 rounded-xl border-brand-100 bg-white shadow-soft font-medium"
                    />
                </div>
                <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-brand-100 bg-white shadow-soft font-bold text-gray-800 outline-none focus:ring-2 focus:ring-brand-500 min-w-[200px]"
                >
                    <option value="all">All My Classes</option>
                    {classes.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-500">
                    Showing {filteredStudents.length} students
                </p>
            </div>

            {/* Student Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStudents.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No students found matching your criteria.</p>
                        {(session?.user as any)?.role === 'TEACHER' && classes.length === 0 && (
                            <p className="text-yellow-600 text-sm mt-2">You haven't been assigned to any classes yet.</p>
                        )}
                    </div>
                ) : (
                    filteredStudents.map((student) => (
                        <Card key={student.id} className="group glass border-none shadow-soft hover:shadow-lg transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-16 h-16 border-4 border-white shadow-md">
                                        <AvatarImage src={student.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user.name}`} />
                                        <AvatarFallback className="text-xl font-black">{student.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                    {student.user.name}
                                                </h3>
                                                <p className="text-sm font-bold text-gray-400">{student.user.email}</p>
                                            </div>
                                            <Badge className={cn(
                                                "font-black text-xs",
                                                student.user.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                                            )}>
                                                {student.user.isActive ? 'Active' : 'Disabled'}
                                            </Badge>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            <Badge variant="outline" className="font-bold text-xs bg-white">
                                                {student.class?.name || 'Unassigned'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <span className="text-gray-400 text-xs uppercase tracking-wide">Parent:</span>
                                        <span>{student.parent?.user?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <span className="text-gray-400 text-xs uppercase tracking-wide">Contact:</span>
                                        <span>{student.parent?.user?.email || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-100">
                                    <Button variant="outline" size="sm" className="font-bold border-gray-200 hover:bg-gray-50">
                                        <BarChart3 className="w-4 h-4 mr-2" /> Results
                                    </Button>
                                    <Button variant="outline" size="sm" className="font-bold border-gray-200 hover:bg-gray-50">
                                        <FileText className="w-4 h-4 mr-2" /> Report
                                    </Button>
                                    <Button variant="outline" size="sm" className="font-bold border-gray-200 hover:bg-gray-50">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
