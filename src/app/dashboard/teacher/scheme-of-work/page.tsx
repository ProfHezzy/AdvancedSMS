'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BookOpen,
    Layers,
    CheckCircle2,
    ChevronRight,
    Search,
    Download,
    Eye,
    Library,
    FileText,
    Plus,
    Loader2,
    Save,
    X as CloseIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { getSchemesOfWork, getTeacherSubjects, getTerms, upsertSchemeOfWork, getTeacherProfileByUserId } from '@/actions/academic';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SchemeOfWorkPage() {
    const { data: session } = useSession();
    const [schemes, setSchemes] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        subjectId: '',
        termId: '',
        week: 1,
        topic: '',
        objectives: '',
        status: 'PENDING'
    });

    useEffect(() => {
        if (session?.user?.id) {
            initData();
        }
    }, [session]);

    async function initData() {
        setIsLoading(true);
        const userId = (session?.user as any).id;
        const [schRes, subRes, trmRes, profRes] = await Promise.all([
            getSchemesOfWork(userId),
            getTeacherSubjects(userId),
            getTerms(),
            getTeacherProfileByUserId(userId)
        ]);

        if (schRes.success) setSchemes(schRes.data);
        if (subRes.success && subRes.data) {
            setSubjects(subRes.data);
            if (subRes.data.length > 0) setSelectedSubjectId(subRes.data[0].id);
        }
        if (trmRes.success) setTerms(trmRes.data || []);
        if (profRes.success) setTeacherProfile(profRes.data);

        setIsLoading(false);
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacherProfile) return;
        setIsSaving(true);

        const res = await upsertSchemeOfWork({
            ...formData,
            teacherId: teacherProfile.id,
            week: Number(formData.week)
        });

        if (res.success) {
            toast.success('Scheme of work updated!');
            setIsDialogOpen(false);
            initData(); // Refresh
        } else {
            toast.error(res.error || 'Failed to save.');
        }
        setIsSaving(false);
    };

    const filteredSchemes = schemes.filter(s => s.subjectId === selectedSubjectId);
    const activeSubject = subjects.find(s => s.id === selectedSubjectId);

    if (isLoading && schemes.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Scheme of Work
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Track curriculum coverage and term objectives for your subjects.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                                <Plus className="w-4 h-4" />
                                Add Objective
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-brand-600 uppercase tracking-tight">New Scheme Objective</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSave} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Subject</label>
                                        <select
                                            className="w-full h-12 rounded-xl border border-brand-100 bg-brand-50/30 px-4 font-bold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                                            value={formData.subjectId}
                                            onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Term</label>
                                        <select
                                            className="w-full h-12 rounded-xl border border-brand-100 bg-brand-50/30 px-4 font-bold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                                            value={formData.termId}
                                            onChange={e => setFormData({ ...formData, termId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Term</option>
                                            {terms.map(t => <option key={t.id} value={t.id}>{t.name} ({t.session.name})</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Week Number</label>
                                        <Input
                                            type="number"
                                            className="h-12 border-brand-100 focus:border-brand-500"
                                            value={formData.week}
                                            onChange={e => setFormData({ ...formData, week: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Status</label>
                                        <select
                                            className="w-full h-12 rounded-xl border border-brand-100 bg-brand-50/30 px-4 font-bold outline-none focus:border-brand-500 transition-all"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Topic</label>
                                    <Input
                                        className="h-12 border-brand-100 focus:border-brand-500"
                                        placeholder="e.g. Introduction to Thermodynamics"
                                        value={formData.topic}
                                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Objectives</label>
                                    <Textarea
                                        className="min-h-[100px] border-brand-100 focus:border-brand-500"
                                        placeholder="What should students learn this week?"
                                        value={formData.objectives}
                                        onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="h-12 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl px-10 shadow-lg"
                                    >
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                                        Save Objective
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subjects Selector */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Library className="w-4 h-4" />
                        Taught Subjects
                    </h2>
                    {subjects.map((s) => {
                        const coverage = schemes.filter(sch => sch.subjectId === s.id && sch.status === 'COMPLETED').length;
                        const total = schemes.filter(sch => sch.subjectId === s.id).length || 1;
                        return (
                            <Card
                                key={s.id}
                                onClick={() => setSelectedSubjectId(s.id)}
                                className={cn(
                                    "glass border-none shadow-soft cursor-pointer transition-all hover:scale-[1.02]",
                                    s.id === selectedSubjectId ? "ring-2 ring-brand-500 bg-brand-50/30" : ""
                                )}
                            >
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-black text-gray-900">{s.name}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.code || 'NO CODE'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-brand-600">{Math.round((coverage / total) * 100)}% Coverage</p>
                                        <div className="h-1 w-20 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-brand-500"
                                                style={{ width: `${(coverage / total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Detailed Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b border-brand-50/50">
                            <div>
                                <CardTitle className="text-xl font-black text-gray-800 uppercase tracking-tight">Curriculum Breakdown</CardTitle>
                                <CardDescription className="font-bold text-brand-600">
                                    {activeSubject?.name} {activeSubject?.code ? `(${activeSubject.code})` : ''}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-brand-50/50">
                                {filteredSchemes.length === 0 ? (
                                    <div className="p-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto">
                                            <FileText className="w-8 h-8 text-brand-200" />
                                        </div>
                                        <p className="text-muted-foreground font-bold">No objectives defined for this subject yet.</p>
                                        <Button
                                            variant="outline"
                                            className="border-brand-200 text-brand-600 font-bold"
                                            onClick={() => {
                                                setFormData({ ...formData, subjectId: selectedSubjectId });
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            Create First Objective
                                        </Button>
                                    </div>
                                ) : (
                                    filteredSchemes.map((sch, idx) => (
                                        <div
                                            key={sch.id}
                                            className="group flex items-center gap-6 p-6 hover:bg-brand-50/20 transition-all"
                                        >
                                            <div className="w-16 flex-shrink-0 text-center">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">Week</p>
                                                <p className="text-2xl font-black text-brand-700">{sch.week}</p>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-gray-900 text-lg leading-tight group-hover:text-brand-700 transition-colors">
                                                    {sch.topic}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                                                        sch.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                                                            sch.status === 'IN_PROGRESS' ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700"
                                                    )}>
                                                        {sch.status.replace('_', ' ')}
                                                    </span>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{sch.term.name}</span>
                                                </div>
                                                {sch.objectives && (
                                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{sch.objectives}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-brand-400 hover:text-brand-600"
                                                    onClick={() => {
                                                        setFormData({
                                                            subjectId: sch.subjectId,
                                                            termId: sch.termId,
                                                            week: sch.week,
                                                            topic: sch.topic,
                                                            objectives: sch.objectives || '',
                                                            status: sch.status
                                                        });
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
