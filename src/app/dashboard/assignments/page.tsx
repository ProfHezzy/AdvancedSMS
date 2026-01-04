'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Calendar, Users, Key, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { createAssessment, getAssessmentsByTeacher, deleteAssessment } from '@/actions/assessments';
import { AssessmentType } from '@prisma/client';

// Mock IDs for demonstration - in real app, these come from user session and DB
const TEACHER_ID = 'teacher-1';
const SUBJECT_ID = 'math-1';
const CLASS_ID = 'class-1';

export default function AssignmentsPage() {
    const [assessments, setAssessments] = useState<any[]>([]);
    const [showCreate, setShowCreate] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [type, setType] = useState<AssessmentType>('ASSIGNMENT');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const fetchAssessments = async () => {
        // In real app: const data = await getAssessmentsByTeacher(TEACHER_ID);
        // For now, using mock data that follows the new schema structure
        setAssessments([
            {
                id: '1',
                title: 'Algebra Quiz 1',
                type: 'TEST',
                token: 'QX47B2',
                dueDate: '2026-01-15',
                class: { name: 'JSS 1 A' },
                subject: { name: 'Mathematics' },
                _count: { submissions: 12 }
            },
            {
                id: '2',
                title: 'Mid-term Project',
                type: 'PROJECT',
                token: 'P99L01',
                dueDate: '2026-02-01',
                class: { name: 'JSS 1 B' },
                subject: { name: 'English Language' },
                _count: { submissions: 5 }
            }
        ]);
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createAssessment({
            title,
            description,
            type,
            subjectId: SUBJECT_ID,
            classId: CLASS_ID,
            teacherId: TEACHER_ID,
            dueDate: dueDate ? new Date(dueDate) : undefined
        });

        if (result.success) {
            setShowCreate(false);
            fetchAssessments();
            // Reset form
            setTitle('');
            setDescription('');
            setDueDate('');
        }
        setLoading(false);
    };

    const getTypeColor = (type: AssessmentType) => {
        switch (type) {
            case 'ASSIGNMENT': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PROJECT': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'TEST': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'EXAM': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-brand-900">Assessments</h1>
                    <p className="text-muted-foreground">Create and manage assignments, tests, and student submissions.</p>
                </div>
                <Button variant="gradient" className="gap-2" onClick={() => setShowCreate(true)}>
                    <Plus className="w-5 h-5" />
                    Create New
                </Button>
            </div>

            {showCreate && (
                <Card className="border-brand-200 shadow-hard animate-in slide-in-from-top-4 duration-500">
                    <CardHeader className="bg-brand-50/50">
                        <CardTitle>New Assessment</CardTitle>
                        <CardDescription>Fill in the details to create a new assignment or test.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form id="assessment-form" onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    placeholder="e.g. Weekly Math Quiz"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md outline-none focus:ring-2 focus:ring-brand-500"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as AssessmentType)}
                                >
                                    <option value="ASSIGNMENT">Assignment</option>
                                    <option value="PROJECT">Project</option>
                                    <option value="TEST">Test</option>
                                    <option value="EXAM">Exam</option>
                                </select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">Instruction / Description</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 bg-background border border-input rounded-md outline-none focus:ring-2 focus:ring-brand-500"
                                    placeholder="Enter details for students..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Due Date</label>
                                <Input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 bg-brand-50/50 mt-6 border-t border-brand-100">
                        <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                        <Button type="submit" form="assessment-form" disabled={loading}>
                            {loading ? 'Creating...' : 'Generate & Create'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((a) => (
                    <Card key={a.id} className="glass hover:shadow-hard transition-all duration-300 border-white/20">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getTypeColor(a.type as AssessmentType)}`}>
                                    {a.type}
                                </span>
                                <div className="flex items-center gap-1 text-xs font-mono bg-brand-100 text-brand-700 px-2 py-1 rounded border border-brand-200">
                                    <Key className="w-3 h-3" />
                                    {a.token}
                                </div>
                            </div>
                            <CardTitle className="text-xl">{a.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Users className="w-4 h-4 text-brand-500" />
                                <span>{a.class.name} • {a.subject.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 text-brand-500" />
                                <span>Due: {a.dueDate}</span>
                            </div>
                            <div className="pt-4 border-t border-brand-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Submissions:</span>
                                    <span className="bg-brand-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                        {a._count?.submissions || 0}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-white/5 border-t border-white/10">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 border-brand-200 text-brand-700">
                                View Submissions
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
