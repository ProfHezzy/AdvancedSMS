'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Calendar,
    BookOpen,
    Users,
    Save,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { createAssessment } from '@/actions/assessments';
import { getTeacherClasses, getTeacherSubjects } from '@/actions/academic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AssessmentType } from '@prisma/client';

export default function CreateAssignmentPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: '',
        classId: '',
        dueDate: '',
        maxScore: '100',
    });

    useEffect(() => {
        if (session?.user?.id) {
            loadDependencies();
        }
    }, [session]);

    async function loadDependencies() {
        const teacherId = (session?.user as any).id;
        // Parallel fetch for speed
        const [clsRes, subRes] = await Promise.all([
            getTeacherClasses(teacherId),
            getTeacherSubjects((session?.user as any).id) // getTeacherSubjects expects userId, not teacherId (based on implementation)
        ]);

        if (clsRes.success && clsRes.data) setClasses(clsRes.data);
        if (subRes.success && subRes.data) setSubjects(subRes.data);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const teacherId = (session?.user as any).id;

        const res = await createAssessment({
            ...formData,
            type: AssessmentType.ASSIGNMENT,
            teacherId,
            maxScore: parseFloat(formData.maxScore),
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        });

        if (res.success) {
            toast.success('Assignment created successfully!');
            router.push('/dashboard/teacher/assignments');
        } else {
            toast.error(res.error || 'Failed to create assignment.');
        }
        setIsLoading(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/teacher/assignments">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        New Assignment
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Define task details and deadlines.
                    </p>
                </div>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Title</label>
                            <Input
                                placeholder="e.g. Algebra Homework 3"
                                className="h-12 text-lg font-bold bg-white/50 border-brand-100 focus:border-brand-500 focus:ring-brand-500/20"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> Subject
                                </label>
                                <select
                                    className="w-full h-12 rounded-lg border border-brand-100 bg-white/50 px-3 font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                    value={formData.subjectId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.code || 'No Code'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <Users className="w-3 h-3" /> Class
                                </label>
                                <select
                                    className="w-full h-12 rounded-lg border border-brand-100 bg-white/50 px-3 font-medium outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                                    value={formData.classId}
                                    onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Due Date
                                </label>
                                <Input
                                    type="date"
                                    className="h-12 bg-white/50 border-brand-100"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Max Score</label>
                                <Input
                                    type="number"
                                    className="h-12 bg-white/50 border-brand-100"
                                    value={formData.maxScore}
                                    onChange={e => setFormData({ ...formData, maxScore: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Instructions / Description</label>
                            <Textarea
                                placeholder="Detailed instructions for the students..."
                                className="min-h-[150px] bg-white/50 border-brand-100 focus:border-brand-500 focus:ring-brand-500/20 font-medium"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl shadow-lg btn-shine"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Assignment'}
                                {!isLoading && <Save className="ml-2 w-4 h-4" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
