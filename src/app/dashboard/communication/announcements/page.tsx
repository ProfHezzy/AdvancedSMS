'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Bell,
    Megaphone,
    Plus,
    Users,
    Globe,
    Calendar,
    Search,
    Filter,
    MoreVertical
} from 'lucide-react';

export default function AnnouncementsPage() {
    const [isCreating, setIsCreating] = useState(false);

    // Mock announcements
    const announcements = [
        {
            id: '1',
            title: 'Resumption of Second Term',
            content: 'We are pleased to announce that the school will resume for the second term on Monday, January 12th, 2026. All students are expected to be in school by 7:45 AM.',
            authorIcon: '👤',
            authorName: 'Principal',
            type: 'Global',
            date: 'Jan 04, 2026',
            color: 'bg-blue-100 text-blue-700'
        },
        {
            id: '2',
            title: 'Inter-House Sports Competition',
            content: 'The annual inter-house sports competition has been scheduled for February 15th. House masters should begin selection of athletes across all categories.',
            authorIcon: '🏆',
            authorName: 'Sports Director',
            type: 'Global',
            date: 'Jan 02, 2026',
            color: 'bg-orange-100 text-orange-700'
        },
        {
            id: '3',
            title: 'Mathematics Project Submission',
            content: 'JSS 2 students are reminded that their Algebra projects are due this Wednesday. Please submit via the student portal or to the mathematics teacher.',
            authorIcon: '📐',
            authorName: 'Mr. David (Math Teacher)',
            type: 'Class: JSS 2',
            date: 'Dec 28, 2025',
            color: 'bg-purple-100 text-purple-700'
        }
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">School Announcements</h1>
                    <p className="text-muted-foreground">Stay updated with the latest news, events, and academic notices.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                    <Button className="gap-2 bg-brand-600 hover:bg-brand-700 text-white" onClick={() => setIsCreating(true)}>
                        <Plus className="w-4 h-4" />
                        Post Update
                    </Button>
                </div>
            </div>

            {/* Stats / Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-white/20">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Megaphone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Notices</p>
                            <h3 className="text-2xl font-bold">12</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/20">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                            <h3 className="text-2xl font-bold">4</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-white/20">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Targeted Notices</p>
                            <h3 className="text-2xl font-bold">8</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Announcements Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {announcements.map((item) => (
                        <Card key={item.id} className="glass border-white/20 hover:shadow-hard transition-all duration-300 overflow-hidden">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{item.authorIcon}</div>
                                        <div>
                                            <p className="font-bold text-gray-900">{item.authorName}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                                <Calendar className="w-3 h-3" />
                                                {item.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${item.color}`}>
                                        {item.type}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                                </div>
                                <div className="pt-4 flex justify-between items-center border-t border-white/10">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Globe className="w-3 h-3" />
                                        Visible to all Parents and Students
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-brand-600 font-bold hover:bg-brand-50">
                                        Read More
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Sidebar - Quick Search & Tags */}
                <div className="space-y-8">
                    <Card className="glass border-white/20 shadow-hard">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Search</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input className="pl-9 h-11 border-white/10 glass" placeholder="Search notices..." />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Popular Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Academic', 'Sports', 'Resumption', 'Fees', 'Exam', 'Holiday'].map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full bg-white/40 border border-white/60 text-xs font-semibold hover:bg-brand-50 hover:border-brand-200 cursor-pointer transition-all">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/20 shadow-hard bg-gradient-to-br from-brand-600 to-brand-800 text-white border-none">
                        <CardHeader>
                            <CardTitle className="text-white">Emergency Alerts</CardTitle>
                            <CardDescription className="text-brand-100">Configure SMS and Email notifications for urgent school updates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full bg-white text-brand-700 hover:bg-brand-50 font-bold h-11">
                                Setup Alerts
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
