'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, FileText, Pin } from 'lucide-react';

const MOCK_NOTICES = [
    {
        id: 1,
        title: 'Mid-Term Break Announcement',
        content: 'The school will be closed for mid-term break from Feb 15th to Feb 19th. Classes resume on Feb 22nd.',
        date: '2026-01-20',
        priority: 'HIGH',
        category: 'ACADEMIC'
    },
    {
        id: 2,
        title: 'Inter-House Sports Competition',
        content: 'We invite all parents to our annual Inter-House Sports competition taking place next Saturday at the main field.',
        date: '2026-01-18',
        priority: 'MEDIUM',
        category: 'EVENT'
    },
    {
        id: 3,
        title: 'New Uniform Policy',
        content: 'Please be reminded that the new uniform policy takes effect from the beginning of the next term.',
        date: '2026-01-10',
        priority: 'LOW',
        category: 'ADMIN'
    }
];

export default function NoticesPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">School Notices</h1>
                <p className="text-muted-foreground mt-2">Latest updates and announcements from the school administration.</p>
            </div>

            <div className="grid gap-6">
                {MOCK_NOTICES.map((notice) => (
                    <Card key={notice.id} className="glass border-none shadow-soft hover:shadow-medium transition-all group">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notice.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' :
                                        notice.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                        {notice.title}
                                        {notice.priority === 'HIGH' && (
                                            <Badge variant="destructive" className="uppercase text-[10px]">Urgent</Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(notice.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        <span className="text-gray-300">•</span>
                                        <Badge variant="outline" className="text-[10px] h-5">{notice.category}</Badge>
                                    </CardDescription>
                                </div>
                            </div>
                            {notice.priority === 'HIGH' && <Pin className="w-5 h-5 text-gray-300 rotate-45" />}
                        </CardHeader>
                        <CardContent className="pl-20">
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {notice.content}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
