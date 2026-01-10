'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
    PenTool,
    Smile,
    Meh,
    Frown,
    Save,
    Search,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import {
    getStudentsForTeacher,
    getStudentRemark,
    upsertBehavioralRemark,
    getCurrentTerm
} from '@/actions/remarks';
import { Rating } from '@prisma/client';

export default function StudentRemarksPage() {
    const { data: session } = useSession();
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentTerm, setCurrentTerm] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [rating, setRating] = useState<Rating>('AVERAGE');
    const [observation, setObservation] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const suggestedTags = ['Participates actively', 'Talkative', 'Leadership potential', 'Needs focus', 'Very polite', 'Consistent improvement'];

    useEffect(() => {
        if (session?.user?.id) {
            initData();
        }
    }, [session]);

    useEffect(() => {
        if (selectedStudent && currentTerm) {
            fetchRemark();
        }
    }, [selectedStudent, currentTerm]);

    async function initData() {
        setIsLoading(true);
        const [studentsRes, termRes] = await Promise.all([
            getStudentsForTeacher((session?.user as any).id),
            getCurrentTerm()
        ]);

        if (studentsRes.success) {
            setStudents(studentsRes.data || []);
        }
        if (termRes.success) {
            setCurrentTerm(termRes.data);
        }
        setIsLoading(false);
    }

    async function fetchRemark() {
        if (!selectedStudent || !currentTerm) return;
        const res = await getStudentRemark(selectedStudent, currentTerm.id);
        if (res.success && res.data) {
            setRating(res.data.rating);
            setObservation(res.data.observation);
            setTags(res.data.tags);
        } else {
            // Reset for new entry
            setRating('AVERAGE');
            setObservation('');
            setTags([]);
        }
    }

    async function handleSave() {
        if (!selectedStudent || !currentTerm || !session?.user?.id) return;

        setIsSaving(true);
        const res = await upsertBehavioralRemark({
            studentId: selectedStudent,
            teacherId: (session.user as any).id,
            termId: currentTerm.id,
            rating,
            observation,
            tags
        });

        if (res.success) {
            toast.success('Remark saved successfully!');
        } else {
            toast.error(res.error || 'Failed to save remark');
        }
        setIsSaving(false);
    }

    const toggleTag = (tag: string) => {
        setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedStudentData = students.find(s => s.id === selectedStudent);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Behavioral Remarks
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    {currentTerm ? `Logging for ${currentTerm.name} - ${currentTerm.session.name}` : 'Log observations and termly comments for students.'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student Selector */}
                <Card className="glass border-none shadow-soft h-[600px] flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-white/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <p className="text-center text-gray-400 py-8 text-sm">No students found.</p>
                        ) : filteredStudents.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedStudent(s.id)}
                                className={cn(
                                    "p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors",
                                    selectedStudent === s.id ? "bg-brand-50 border border-brand-100" : "hover:bg-gray-50 border border-transparent"
                                )}
                            >
                                <Avatar className="w-10 h-10 border border-white">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} />
                                    <AvatarFallback>{s.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className={cn("font-bold text-sm", selectedStudent === s.id ? "text-brand-900" : "text-gray-900")}>{s.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{s.class}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Remark Form */}
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                            <PenTool className="w-5 h-5 text-brand-600" /> {selectedStudentData ? `Entry for ${selectedStudentData.name}` : 'New Entry'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!selectedStudent ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
                                <Search className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-medium">Select a student from the list to begin.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Affective Domain Rating</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setRating('EXCELLENT')}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all group",
                                                rating === 'EXCELLENT' ? "border-green-500 bg-green-50" : "border-green-100 bg-green-50/30 hover:border-green-300"
                                            )}
                                        >
                                            <Smile className={cn("w-8 h-8 transition-transform group-hover:scale-110", rating === 'EXCELLENT' ? "text-green-600" : "text-green-400")} />
                                            <span className="font-bold text-green-700 text-sm">Excellent</span>
                                        </button>
                                        <button
                                            onClick={() => setRating('AVERAGE')}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all group",
                                                rating === 'AVERAGE' ? "border-amber-500 bg-amber-50" : "border-amber-100 bg-amber-50/30 hover:border-amber-300"
                                            )}
                                        >
                                            <Meh className={cn("w-8 h-8 transition-transform group-hover:scale-110", rating === 'AVERAGE' ? "text-amber-600" : "text-amber-400")} />
                                            <span className="font-bold text-amber-700 text-sm">Average</span>
                                        </button>
                                        <button
                                            onClick={() => setRating('POOR')}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all group",
                                                rating === 'POOR' ? "border-rose-500 bg-rose-50" : "border-rose-100 bg-rose-50/30 hover:border-rose-300"
                                            )}
                                        >
                                            <Frown className={cn("w-8 h-8 transition-transform group-hover:scale-110", rating === 'POOR' ? "text-rose-600" : "text-rose-400")} />
                                            <span className="font-bold text-rose-700 text-sm">Poor</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Detailed Observation</label>
                                    <Textarea
                                        value={observation}
                                        onChange={(e) => setObservation(e.target.value)}
                                        className="min-h-[150px] font-medium resize-none text-base bg-white/50"
                                        placeholder="Enter detailed comments about the student's behavior, participation, and general conduct..."
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedTags.map(tag => (
                                            <Badge
                                                key={tag}
                                                variant={tags.includes(tag) ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer transition-colors",
                                                    tags.includes(tag) ? "bg-brand-600 hover:bg-brand-700" : "hover:bg-gray-100 bg-white"
                                                )}
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving || !observation}
                                        className="h-12 px-8 bg-black text-white font-black rounded-xl hover:bg-gray-900 btn-shine gap-2 shadow-lg"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Remark
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
