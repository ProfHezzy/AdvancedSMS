'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Plus,
    Calendar,
    BookOpen,
    CheckCircle2,
    Clock,
    Edit,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function LessonPlansPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [lessonPlans] = useState([
        {
            id: '1',
            date: '2026-01-06',
            subject: 'Mathematics',
            class: 'JSS 1 A',
            topic: 'Introduction to Algebra',
            objectives: 'Students will understand basic algebraic expressions',
            resources: 'Textbook Chapter 3, Worksheets',
            status: 'COMPLETED'
        },
        {
            id: '2',
            date: '2026-01-07',
            subject: 'Mathematics',
            class: 'JSS 1 B',
            topic: 'Linear Equations',
            objectives: 'Solve simple linear equations',
            resources: 'Practice problems, Calculator',
            status: 'PENDING'
        },
        {
            id: '3',
            date: '2026-01-08',
            subject: 'Basic Science',
            class: 'JSS 1 A',
            topic: 'States of Matter',
            objectives: 'Identify and describe solid, liquid, and gas',
            resources: 'Lab equipment, Demonstration materials',
            status: 'PENDING'
        },
    ]);

    const handleCreatePlan = () => {
        toast.success('Lesson plan created successfully!');
        setIsDialogOpen(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Lesson Plans
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Plan and track your daily teaching activities.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                            <Plus className="w-5 h-5" /> New Lesson Plan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Create Lesson Plan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" className="h-12" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <select className="w-full h-12 px-4 pr-10 rounded-xl border border-brand-100 bg-white font-bold appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCw2TDgsMTBMMTIsNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                                        <option>Mathematics</option>
                                        <option>Basic Science</option>
                                        <option>English</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <select className="w-full h-12 px-4 pr-10 rounded-xl border border-brand-100 bg-white font-bold appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCw2TDgsMTBMMTIsNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                                    <option>JSS 1 A</option>
                                    <option>JSS 1 B</option>
                                    <option>SS 2 Science</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Topic</Label>
                                <Input placeholder="e.g., Introduction to Algebra" className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Learning Objectives</Label>
                                <Textarea placeholder="What should students learn from this lesson?" className="min-h-[100px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Resources Needed</Label>
                                <Input placeholder="Textbooks, materials, equipment..." className="h-12" />
                            </div>
                            <Button onClick={handleCreatePlan} className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-black">
                                Create Lesson Plan
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
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Plans</p>
                            <p className="text-3xl font-black text-gray-900">{lessonPlans.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Completed</p>
                            <p className="text-3xl font-black text-gray-900">
                                {lessonPlans.filter(p => p.status === 'COMPLETED').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Pending</p>
                            <p className="text-3xl font-black text-gray-900">
                                {lessonPlans.filter(p => p.status === 'PENDING').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lesson Plans List */}
            <div className="space-y-4">
                {lessonPlans.map((plan) => (
                    <Card key={plan.id} className="glass border-none shadow-soft hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className={cn(
                                            "font-black text-xs",
                                            plan.status === 'COMPLETED' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                        )}>
                                            {plan.status}
                                        </Badge>
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(plan.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">{plan.topic}</h3>
                                    <div className="flex gap-2 mb-3">
                                        <Badge variant="outline" className="font-bold text-xs bg-white">{plan.subject}</Badge>
                                        <Badge variant="outline" className="font-bold text-xs bg-white">{plan.class}</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                        <span className="font-bold text-gray-700">Objectives:</span> {plan.objectives}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">
                                        <span className="font-bold text-gray-700">Resources:</span> {plan.resources}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => toast.info('Edit functionality coming soon!')}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-brand-600"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => toast.success('Lesson plan deleted!')}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-rose-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
