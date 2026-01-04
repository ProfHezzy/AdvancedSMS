'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Bell,
    Plus,
    AlertTriangle,
    Info,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NoticesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const notices = [
        {
            id: '1',
            title: 'Mid-Term Examination Schedule Released',
            content: 'The mid-term examination timetable has been published. Please check the academic calendar for details.',
            priority: 'HIGH',
            category: 'Academic',
            postedBy: 'Admin Office',
            postedAt: '2026-01-04 09:00',
            readBy: 45
        },
        {
            id: '2',
            title: 'Parent-Teacher Meeting - January 15th',
            content: 'All parents are invited to attend the quarterly parent-teacher meeting scheduled for January 15th at 2:00 PM.',
            priority: 'MEDIUM',
            category: 'Event',
            postedBy: 'Principal',
            postedAt: '2026-01-03 14:30',
            readBy: 32
        },
        {
            id: '3',
            title: 'New Library Books Available',
            content: 'The school library has received a new shipment of reference books. Students are encouraged to visit and explore.',
            priority: 'LOW',
            category: 'General',
            postedBy: 'Librarian',
            postedAt: '2026-01-02 11:00',
            readBy: 18
        },
    ];

    const handleCreateNotice = () => {
        toast.success('Notice posted successfully!');
        setIsDialogOpen(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Notices
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        View and create institutional announcements.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2 btn-shine">
                            <Plus className="w-5 h-5" /> Post Notice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Create New Notice</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input placeholder="Notice title..." className="h-12" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <select className="w-full h-12 px-4 pr-10 rounded-xl border border-brand-100 bg-white font-bold appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCw2TDgsMTBMMTIsNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                                        <option>LOW</option>
                                        <option>MEDIUM</option>
                                        <option>HIGH</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <select className="w-full h-12 px-4 pr-10 rounded-xl border border-brand-100 bg-white font-bold appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCw2TDgsMTBMMTIsNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                                        <option>General</option>
                                        <option>Academic</option>
                                        <option>Event</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea placeholder="Notice details..." className="min-h-[150px]" />
                            </div>
                            <Button onClick={handleCreateNotice} className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-black">
                                Post Notice
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Notices</p>
                            <p className="text-3xl font-black text-gray-900">{notices.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">High Priority</p>
                            <p className="text-3xl font-black text-gray-900">
                                {notices.filter(n => n.priority === 'HIGH').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Avg Read Rate</p>
                            <p className="text-3xl font-black text-gray-900">
                                {Math.round(notices.reduce((sum, n) => sum + n.readBy, 0) / notices.length)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notices List */}
            <div className="space-y-4">
                {notices.map((notice) => (
                    <Card key={notice.id} className="glass border-none shadow-soft hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className={cn(
                                            "font-black text-xs",
                                            notice.priority === 'HIGH' ? "bg-rose-100 text-rose-700 hover:bg-rose-100" :
                                                notice.priority === 'MEDIUM' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                                    "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                        )}>
                                            {notice.priority === 'HIGH' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                            {notice.priority === 'MEDIUM' && <Info className="w-3 h-3 mr-1" />}
                                            {notice.priority}
                                        </Badge>
                                        <Badge variant="outline" className="font-bold text-xs bg-white">
                                            {notice.category}
                                        </Badge>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">{notice.title}</h3>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">{notice.content}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                    <span className="font-bold">Posted by: {notice.postedBy}</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {notice.postedAt}
                                    </span>
                                </div>
                                <div className="text-xs font-bold text-gray-400">
                                    <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
                                    Read by {notice.readBy} people
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
