'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Target,
    Plus,
    Calendar,
    Users,
    Eye,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { getAssessmentsByTeacher, deleteAssessment } from '@/actions/assessments';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { AssessmentType } from '@prisma/client';

export default function TeacherTestsPage() {
    const { data: session } = useSession();
    const [tests, setTests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.user?.id) {
            fetchTests();
        }
    }, [session]);

    async function fetchTests() {
        setIsLoading(true);
        const teacherId = (session?.user as any).id;
        const res = await getAssessmentsByTeacher(teacherId, AssessmentType.TEST);
        if (res.success && res.data) {
            setTests(res.data);
        } else {
            if (res.error) toast.error('Could not load tests.');
        }
        setIsLoading(false);
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this test?')) return;

        toast.promise(deleteAssessment(id), {
            loading: 'Deleting...',
            success: () => {
                fetchTests();
                return 'Test deleted';
            },
            error: 'Failed to delete'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Tests & Quizzes
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage continuous assessment tests.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg gap-2 btn-shine" asChild>
                    <Link href="/dashboard/teacher/tests/new">
                        <Plus className="w-5 h-5" />
                        Create Test
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-40 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                    ))
                ) : tests.length > 0 ? (
                    tests.map((test, i) => (
                        <Card key={test.id} className="glass border-none shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-black shadow-inner">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{test.title}</h3>
                                            <span className="px-2 py-0.5 rounded bg-brand-100 text-[10px] font-black text-brand-700 uppercase tracking-widest">
                                                {test.subject?.name}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm font-bold text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {test.class?.name}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Date: {test.dueDate ? new Date(test.dueDate).toLocaleDateString() : 'TBA'}
                                            </div>
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {test._count?.submissions || 0} Attempts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="h-10 px-4 rounded-xl border-brand-100 text-brand-600 font-bold hover:bg-brand-50" asChild>
                                        <Link href={`/dashboard/teacher/tests/${test.id}/submissions`}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Results
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 border-rose-100 text-rose-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                                        onClick={() => handleDelete(test.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                        <Target className="w-12 h-12 text-brand-200" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">No Tests Scheduled</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                            Create a test to assess student understanding.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
