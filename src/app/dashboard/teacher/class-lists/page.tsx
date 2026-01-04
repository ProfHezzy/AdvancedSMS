'use client';

import { useState } from 'react';
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
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ClassListsPage() {
    const [expandedClass, setExpandedClass] = useState<string | null>('JSS 1 A');

    const classes = [
        {
            name: 'JSS 1 A',
            count: 35,
            students: [
                { name: 'Chioma Adeyemi', id: '2025/001', gender: 'F' },
                { name: 'David Okafor', id: '2025/002', gender: 'M' },
                { name: 'Sarah Ibrahim', id: '2025/003', gender: 'F' },
                { name: 'Michael Bassey', id: '2025/004', gender: 'M' },
                { name: 'Ngozi Eze', id: '2025/005', gender: 'F' },
            ]
        },
        {
            name: 'JSS 1 B',
            count: 32,
            students: []
        },
        {
            name: 'SS 2 Science',
            count: 28,
            students: []
        }
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Class Lists
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage student rosters and view profiles.
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
                    placeholder="Search for a student..."
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
            </div>

            <div className="space-y-4">
                {classes.map((cls) => (
                    <Card key={cls.name} className="glass border-none shadow-soft overflow-hidden transition-all">
                        <div
                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50"
                            onClick={() => setExpandedClass(expandedClass === cls.name ? null : cls.name)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{cls.name}</h3>
                                    <p className="text-sm font-medium text-gray-500">{cls.count} Students</p>
                                </div>
                            </div>
                            {expandedClass === cls.name ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                        </div>

                        {expandedClass === cls.name && (
                            <div className="border-t border-gray-100 bg-white/40">
                                {cls.students.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {cls.students.map((student) => (
                                            <div key={student.id} className="p-4 flex items-center justify-between hover:bg-white transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground font-medium">{student.id}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="font-bold text-[10px]">{student.gender}</Badge>
                                                    <div className="w-px h-4 bg-gray-200 mx-2" />
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400 font-medium italic">
                                        No students loaded for this class.
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
