'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Calendar,
    Save,
    ArrowLeft,
    BookOpen,
    Clock,
    Percent
} from 'lucide-react';
import { getTeacherClasses, getTeacherSubjects } from '@/actions/academic';
import { createAssessment } from '@/actions/assessments';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CreateExamPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        duration: '120',
        totalScore: '60',
        classId: '',
        subjectId: '',
        venue: ''
    });

    useEffect(() => {
        if (session?.user?.id) {
            loadData();
        }
    }, [session]);

    async function loadData() {
        const [clsRes, subRes] = await Promise.all([
            getTeacherClasses((session?.user as any).id),
            getTeacherSubjects((session?.user as any).id)
        ]);

        if (clsRes.success) setClasses(clsRes.data || []);
        if (subRes.success) setSubjects(subRes.data || []);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const res = await createAssessment({
            ...formData,
            type: 'TEST', // Exams are technically Tests in the schema currently
            maxScore: parseInt(formData.totalScore),
            teacherId: (session?.user as any).id,
            dueDate: new Date(formData.date)
        });

        if (res.success) {
            toast.success('Examination scheduled successfully!');
            router.push('/dashboard/teacher/exams');
        } else {
            toast.error('Failed to schedule exam.');
        }
        setIsLoading(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl hover:bg-white/50">
                    <Link href="/dashboard/teacher/exams">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Schedule Examination
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Setup main examination parameters and logistics.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-600 border-b border-brand-100 pb-2">Academic Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Subject</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-brand-100 bg-white/50 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                                            value={formData.subjectId}
                                            onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Target Class</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            className="w-full h-12 pl-10 pr-4 rounded-xl border border-brand-100 bg-white/50 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                                            value={formData.classId}
                                            onChange={e => setFormData({ ...formData, classId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-600 border-b border-brand-100 pb-2">Exam Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Exam Title</label>
                                    <Input
                                        placeholder="e.g. 1st Term Mathematics Examination"
                                        className="h-12 font-bold"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Schedule Date</label>
                                    <Input
                                        type="datetime-local"
                                        className="h-12 font-bold"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Duration (Minutes)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            className="pl-9 h-12 font-bold"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Total Score</label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            className="pl-9 h-12 font-bold"
                                            value={formData.totalScore}
                                            onChange={e => setFormData({ ...formData, totalScore: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Instructions / Syllabus</label>
                                <Textarea
                                    placeholder="Enter exam instructions, covered topics, or special requirements..."
                                    className="min-h-[150px] font-medium resize-none bg-white/50"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4">
                            <Button type="button" variant="ghost" className="h-12 px-6 font-bold text-gray-500" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl shadow-lg btn-shine"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Scheduling...' : 'Schedule Exam'}
                                {!isLoading && <Save className="ml-2 w-4 h-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
