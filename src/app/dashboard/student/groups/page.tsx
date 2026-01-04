'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Plus,
    MessageSquare,
    MoreVertical,
    Search,
    BookOpen,
    Trophy
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function StudentGroupsPage() {
    // Mock data for groups since schema doesn't support them yet
    const [groups, setGroups] = useState([
        { id: 1, name: 'JSS 1 Science Club', members: 12, type: 'ACADEMIC', newMessages: 3 },
        { id: 2, name: 'Math Study Group', members: 5, type: 'STUDY', newMessages: 0 },
        { id: 3, name: 'Football Team', members: 18, type: 'SPORT', newMessages: 9 },
    ]);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        My Groups
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Collaborate with peers in study circles and clubs.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2 btn-shine" asChild>
                    <Link href="/dashboard/student/groups/new">
                        <Plus className="w-5 h-5" />
                        Create Group
                    </Link>
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search groups..."
                    className="w-full md:w-96 h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map((group, idx) => (
                    <Card
                        key={group.id}
                        className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                    >
                        <CardContent className="p-6 relative">
                            <div className="absolute top-4 right-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-4 pt-2">
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg",
                                    group.type === 'ACADEMIC' ? 'bg-blue-500' :
                                        group.type === 'SPORT' ? 'bg-amber-500' : 'bg-purple-500'
                                )}>
                                    {group.type === 'ACADEMIC' && <BookOpen className="w-8 h-8" />}
                                    {group.type === 'SPORT' && <Trophy className="w-8 h-8" />}
                                    {group.type === 'STUDY' && <Users className="w-8 h-8" />}
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">
                                        {group.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                        {group.members} Members • {group.type}
                                    </p>
                                </div>

                                <div className="flex gap-2 w-full pt-2">
                                    <Button className="flex-1 rounded-xl font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100" asChild>
                                        <Link href="/dashboard/student/groups/chats">
                                            Chat
                                        </Link>
                                    </Button>
                                    {group.newMessages > 0 && (
                                        <div className="flex items-center justify-center px-3 rounded-xl bg-rose-500 text-white font-black text-xs shadow-md animate-pulse">
                                            {group.newMessages}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Placeholder */}
                <Link href="/dashboard/student/groups/new">
                    <Card className="h-full border-2 border-dashed border-brand-100 bg-brand-50/30 hover:bg-brand-50 transition-colors cursor-pointer flex items-center justify-center min-h-[220px]">
                        <div className="flex flex-col items-center gap-3 text-brand-300 group-hover:text-brand-500 transition-colors">
                            <Plus className="w-12 h-12" />
                            <p className="font-black uppercase tracking-widest text-sm">Join or Create</p>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
