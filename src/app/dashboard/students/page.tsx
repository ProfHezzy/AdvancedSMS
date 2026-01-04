'use client';

import { useState } from 'react';
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
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentProfilesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterClass, setFilterClass] = useState('all');

    const students = [
        {
            id: '1',
            name: 'Chioma Adeyemi',
            class: 'JSS 1 A',
            admissionNo: '2025/001',
            gpa: 4.82,
            attendance: 98,
            status: 'Excellent',
            email: 'chioma@student.school.com',
            phone: '+234 801 234 5678',
            avatar: 'Chioma'
        },
        {
            id: '2',
            name: 'David Okafor',
            class: 'JSS 1 A',
            admissionNo: '2025/002',
            gpa: 3.95,
            attendance: 95,
            status: 'Good',
            email: 'david@student.school.com',
            phone: '+234 802 345 6789',
            avatar: 'David'
        },
        {
            id: '3',
            name: 'Sarah Ibrahim',
            class: 'JSS 1 B',
            admissionNo: '2025/003',
            gpa: 4.21,
            attendance: 92,
            status: 'Excellent',
            email: 'sarah@student.school.com',
            phone: '+234 803 456 7890',
            avatar: 'Sarah'
        },
        {
            id: '4',
            name: 'Michael Bassey',
            class: 'SS 2 Science',
            admissionNo: '2023/045',
            gpa: 4.65,
            attendance: 97,
            status: 'Excellent',
            email: 'michael@student.school.com',
            phone: '+234 804 567 8901',
            avatar: 'Michael'
        },
    ];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.admissionNo.includes(searchQuery);
        const matchesClass = filterClass === 'all' || student.class === filterClass;
        return matchesSearch && matchesClass;
    });

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
                        placeholder="Search by name or admission number..."
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
                    <option value="all">All Classes</option>
                    <option value="JSS 1 A">JSS 1 A</option>
                    <option value="JSS 1 B">JSS 1 B</option>
                    <option value="SS 2 Science">SS 2 Science</option>
                </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-500">
                    Showing {filteredStudents.length} of {students.length} students
                </p>
            </div>

            {/* Student Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStudents.map((student) => (
                    <Card key={student.id} className="group glass border-none shadow-soft hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16 border-4 border-white shadow-md">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                                    <AvatarFallback className="text-xl font-black">{student.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                                {student.name}
                                            </h3>
                                            <p className="text-sm font-bold text-gray-400">{student.admissionNo}</p>
                                        </div>
                                        <Badge className={cn(
                                            "font-black text-xs",
                                            student.status === 'Excellent' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                        )}>
                                            {student.status}
                                        </Badge>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <Badge variant="outline" className="font-bold text-xs bg-white">
                                            {student.class}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">GPA</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{student.gpa}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Attendance</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{student.attendance}%</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{student.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{student.phone}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-100">
                                <Button variant="outline" size="sm" className="font-bold border-gray-200 hover:bg-gray-50">
                                    <BarChart3 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="font-bold border-gray-200 hover:bg-gray-50">
                                    <FileText className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="font-bold border-gray-200 hover:bg-gray-50">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-400 font-medium">No students found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
