'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Plus,
    Hash,
    BarChart3,
    Search,
    MoreHorizontal
} from 'lucide-react';
import { getSubjects, createSubject } from '@/actions/admin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', coefficient: '1' });

    useEffect(() => {
        fetchSubjects();
    }, []);

    async function fetchSubjects() {
        setIsLoading(true);
        const res = await getSubjects();
        if (res.success && res.data) {
            setSubjects(res.data);
        }
        setIsLoading(false);
    }

    const handleCreate = async () => {
        if (!formData.name) return toast.error('Subject Name is required');

        const res = await createSubject({
            ...formData,
            coefficient: parseInt(formData.coefficient)
        });

        if (res.success) {
            toast.success('Subject created successfully');
            setIsCreateOpen(false);
            setFormData({ name: '', code: '', coefficient: '1' });
            fetchSubjects();
        } else {
            toast.error('Failed to create subject');
        }
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Subject Registry
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Define academic subjects and grading coefficients.
                    </p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                            <Plus className="w-5 h-5" />
                            New Subject
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Subject</DialogTitle>
                            <DialogDescription>
                                Create a new subject for the academic curriculum.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Subject Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Mathematics"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">Subject Code</Label>
                                <Input
                                    id="code"
                                    placeholder="e.g. MTH101"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coef">Coefficient</Label>
                                <Input
                                    id="coef"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={formData.coefficient}
                                    onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate}>Save Subject</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search subjects..."
                    className="w-full md:w-96 h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <div key={i} className="h-48 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                    ))
                ) : subjects.length > 0 ? (
                    subjects.map((sub, idx) => (
                        <Card
                            key={sub.id}
                            className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <CardHeader className="pb-4 flex flex-row items-center justify-between">
                                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-black shadow-inner group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">
                                        {sub.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                                            <Hash className="w-3 h-3" />
                                            {sub.code || 'N/A'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                            <BarChart3 className="w-3 h-3" />
                                            Coef: {sub.coefficient || 1}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full p-20 text-center flex flex-col items-center gap-6 bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100">
                        <BookOpen className="w-12 h-12 text-brand-200" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">No Subjects Found</h3>
                        <p className="text-muted-foreground font-medium max-w-sm mx-auto mt-2 italic">
                            Define current academic subjects to proceed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
