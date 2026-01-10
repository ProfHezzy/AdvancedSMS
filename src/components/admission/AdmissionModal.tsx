'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
    Users,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    GraduationCap,
    Heart,
    ShieldCheck,
    Settings,
    PlusCircle,
    Copy,
    Check,
    Eye,
    EyeOff,
    Search
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { registerStudentWithParent, searchParents } from '@/actions/admission';
import { getAdminClasses, getClassSessions } from '@/actions/admission-support';
import { getTerms } from '@/actions/academic';

interface Props {
    onSuccess?: () => void;
}

export function AdmissionModal({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Data for selectors
    const [classes, setClasses] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState<any>({
        student: {
            name: '',
            gender: 'MALE',
            dateOfBirth: '',
            admissionSessionId: '',
            admissionTermId: '',
            admissionType: 'NEW',
            classId: '',
            arm: '',
            category: 'DAY',
            admissionStatus: 'ADMITTED',
            address: '',
        },
        parent: {
            mode: 'NEW', // NEW or EXISTING
            existingParentId: '',
            name: '',
            relationship: 'Father',
            email: '',
            phone: '',
            address: '',
        }
    });

    const [selectedParent, setSelectedParent] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [admissionResult, setAdmissionResult] = useState<any>(null);
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        if (open) {
            loadInitialData();
        }
    }, [open]);

    async function loadInitialData() {
        setIsLoading(true);
        console.log('Loading admission initial data...');
        const [clsRes, sesRes, trmRes] = await Promise.all([
            getAdminClasses(),
            getClassSessions(),
            getTerms()
        ]);

        console.log('Admission Data Response:', {
            classes: clsRes.success ? clsRes.data?.length : 'Error',
            sessions: sesRes.success ? sesRes.data?.length : 'Error',
            terms: trmRes.success ? trmRes.data?.length : 'Error'
        });

        if (clsRes.success) setClasses(clsRes.data || []);
        if (sesRes.success) setSessions(sesRes.data || []);
        if (trmRes.success) setTerms(trmRes.data || []);

        // Pick defaults
        const currentSession = sesRes.data?.find((s: any) => s.isCurrent) || sesRes.data?.[0];
        const currentTerm = trmRes.data?.find((t: any) => t.isCurrent) || trmRes.data?.[0];

        setFormData((prev: any) => ({
            ...prev,
            student: {
                ...prev.student,
                admissionSessionId: currentSession?.id || '',
                admissionTermId: currentTerm?.id || '',
            }
        }));

        setIsLoading(false);
    }

    const handleParentSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const res = await searchParents(query);
        setIsSearching(false);
        if (res.success && res.data) {
            setSearchResults(res.data);
        }
    };

    const nextStep = () => {
        if (step === 1 && (!formData.student.name || !formData.student.dateOfBirth)) {
            toast.error("Please fill required student fields");
            return;
        }
        if (step === 2 && !formData.student.classId) {
            toast.error("Please select a class");
            return;
        }
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSaving(true);
        const payload = {
            ...formData,
            parent: {
                ...formData.parent,
                existingParentId: selectedParent?.id || formData.parent.existingParentId
            }
        };

        const res = await registerStudentWithParent(payload);
        if (res.success) {
            toast.success("Admission processed successfully!");
            setAdmissionResult(res.data);
            setStep(5);
            onSuccess?.();
        } else {
            toast.error((res as any).error || "Failed to process admission");
        }
        setIsSaving(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const steps = [
        { id: 1, name: 'Student Info', icon: <Users className="w-4 h-4" /> },
        { id: 2, name: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 3, name: 'Parent Info', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 4, name: 'Internal Controls', icon: <Settings className="w-4 h-4" /> },
        { id: 5, name: 'Complete', icon: <CheckCircle2 className="w-4 h-4" /> }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                    <PlusCircle className="w-5 h-5" />
                    New Admission
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none glass shadow-2xl rounded-3xl h-[600px] flex flex-col">
                <DialogHeader className="p-6 bg-brand-600 text-white shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Elite Student Admission</DialogTitle>
                            <p className="text-brand-100 text-xs font-medium mt-1">International Standard Enrollment Flow</p>
                        </div>
                        <div className="flex gap-2">
                            {steps.slice(0, 4).map((s) => (
                                <div key={s.id} className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                    step >= s.id ? "bg-white text-brand-600 scale-110 shadow-lg" : "bg-brand-500 text-brand-200"
                                )}>
                                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-8 bg-white/80">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
                            <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-xs">Preparing Admission Engine...</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Student Basic Information</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Full Name</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="e.g. John Doe"
                                                value={formData.student.name}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, name: e.target.value } })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Gender</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.student.gender}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, gender: e.target.value } })}
                                            >
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Date of Birth</Label>
                                            <Input
                                                type="date"
                                                className="h-12 rounded-xl"
                                                value={formData.student.dateOfBirth}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, dateOfBirth: e.target.value } })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Admission Type</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.student.admissionType}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, admissionType: e.target.value } })}
                                            >
                                                <option value="NEW">New Admission</option>
                                                <option value="TRANSFER">Transfer</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Home Address</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="Full residential address"
                                                value={formData.student.address}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, address: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Class & Academic Assignment</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Select Class</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.student.classId}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, classId: e.target.value } })}
                                            >
                                                <option value="">Select Class</option>
                                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Arm (Optional)</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="e.g. A, Gold, Blue"
                                                value={formData.student.arm}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, arm: e.target.value } })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Session</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.student.admissionSessionId}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, admissionSessionId: e.target.value } })}
                                            >
                                                {sessions.map(s => <option key={s.id} value={s.id}>{s.name} {s.isCurrent ? '(Current)' : ''}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Term</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.student.admissionTermId}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, admissionTermId: e.target.value } })}
                                            >
                                                {terms.map(t => <option key={t.id} value={t.id}>{t.name} {t.isCurrent ? '(Current)' : ''}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Category</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.student.category}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, category: e.target.value } })}
                                            >
                                                <option value="DAY">Day Student</option>
                                                <option value="BOARDING">Boarding Student</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Admission Status</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                value={formData.student.admissionStatus}
                                                onChange={e => setFormData({ ...formData, student: { ...formData.student, admissionStatus: e.target.value } })}
                                            >
                                                <option value="ADMITTED">Admitted</option>
                                                <option value="DRAFT">Draft</option>
                                                <option value="PENDING_APPROVAL">Pending Approval</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                            <Heart className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Parent / Guardian Information</h3>
                                    </div>

                                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-4">
                                        <Button
                                            variant={formData.parent.mode === 'NEW' ? 'default' : 'ghost'}
                                            className={cn("flex-1 rounded-lg h-10 text-xs font-bold", formData.parent.mode === 'NEW' ? "bg-white text-brand-600 shadow-sm" : "text-gray-500")}
                                            onClick={() => setFormData({ ...formData, parent: { ...formData.parent, mode: 'NEW' } })}
                                        >
                                            New Guardian
                                        </Button>
                                        <Button
                                            variant={formData.parent.mode === 'EXISTING' ? 'default' : 'ghost'}
                                            className={cn("flex-1 rounded-lg h-10 text-xs font-bold", formData.parent.mode === 'EXISTING' ? "bg-white text-brand-600 shadow-sm" : "text-gray-500")}
                                            onClick={() => setFormData({ ...formData, parent: { ...formData.parent, mode: 'EXISTING' } })}
                                        >
                                            Use Existing
                                        </Button>
                                    </div>

                                    {formData.parent.mode === 'NEW' ? (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Guardian Name</Label>
                                                <Input
                                                    className="h-12 rounded-xl"
                                                    placeholder="Full name"
                                                    value={formData.parent.name}
                                                    onChange={e => setFormData({ ...formData, parent: { ...formData.parent, name: e.target.value } })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Relationship</Label>
                                                <select
                                                    className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                                                    value={formData.parent.relationship}
                                                    onChange={e => setFormData({ ...formData, parent: { ...formData.parent, relationship: e.target.value } })}
                                                >
                                                    <option value="Father">Father</option>
                                                    <option value="Mother">Mother</option>
                                                    <option value="Guardian">Guardian</option>
                                                    <option value="Sibling">Sibling</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Phone Number</Label>
                                                <Input
                                                    className="h-12 rounded-xl"
                                                    placeholder="+234..."
                                                    value={formData.parent.phone}
                                                    onChange={e => setFormData({ ...formData, parent: { ...formData.parent, phone: e.target.value } })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Email Address</Label>
                                                <Input
                                                    className="h-12 rounded-xl"
                                                    placeholder="parent@example.com"
                                                    value={formData.parent.email}
                                                    onChange={e => setFormData({ ...formData, parent: { ...formData.parent, email: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Input
                                                    className="pl-10 h-12 rounded-xl"
                                                    placeholder="Search parents by name or ID..."
                                                    value={searchQuery}
                                                    onChange={e => handleParentSearch(e.target.value)}
                                                />
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="h-48 overflow-y-auto border rounded-xl divide-y">
                                                {isSearching ? (
                                                    <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600" /></div>
                                                ) : searchResults.length === 0 ? (
                                                    <div className="p-8 text-center text-sm text-gray-400 italic">No parents found</div>
                                                ) : searchResults.map(p => (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => setSelectedParent(p)}
                                                        className={cn(
                                                            "p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50",
                                                            selectedParent?.id === p.id && "bg-brand-50"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-700">{p.user.name}</p>
                                                            <p className="text-[10px] text-gray-400">{p.user.email || 'No email'}</p>
                                                        </div>
                                                        {selectedParent?.id === p.id && <Check className="w-4 h-4 text-brand-600" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Review & Internal Controls</h3>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Student</p>
                                                <p className="text-sm font-black text-gray-800">{formData.student.name || '---'}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class</p>
                                                <p className="text-sm font-black text-gray-800">{classes.find(c => c.id === formData.student.classId)?.name || '---'}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Guardian</p>
                                                <p className="text-sm font-black text-gray-800">
                                                    {formData.parent.mode === 'EXISTING' ? (selectedParent?.user.name || 'Selected') : (formData.parent.name || '---')}
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Initial Completion</p>
                                                <p className="text-sm font-black text-green-600">40% Admission Complete</p>
                                            </div>
                                        </div>
                                        <textarea
                                            className="w-full rounded-xl border-gray-100 text-sm p-4 min-h-[100px] bg-white resize-none"
                                            placeholder="Admission Remarks / Notes (Internal Only)..."
                                            value={formData.remarks}
                                            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        <p className="text-xs font-bold text-indigo-700">Accounts and Admission ID will be generated automatically on submit.</p>
                                    </div>
                                </div>
                            )}

                            {step === 5 && admissionResult && (
                                <div className="space-y-8 animate-in zoom-in-95 p-4 text-center">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-green-100 animate-bounce">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">ADMISSION PROCESSED!</h3>
                                        <p className="text-sm text-gray-500 font-medium">Admission Number: <span className="text-brand-700 font-black">{admissionResult.student.id}</span></p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100 space-y-4 relative overflow-hidden group">
                                            <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-brand-100 transition-transform group-hover:scale-110" />
                                            <div className="relative">
                                                <p className="text-[10px] font-black text-brand-600 uppercase mb-3 tracking-widest">Student Portal</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                        <span className="text-xs font-bold text-gray-400">User:</span>
                                                        <span className="text-xs font-black">{admissionResult.student.username}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(admissionResult.student.username)}><Copy className="w-3 h-3" /></Button>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                        <span className="text-xs font-bold text-gray-400">Pass:</span>
                                                        <span className="text-xs font-black">{showPasswords ? admissionResult.student.password : '••••••••'}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 space-y-4 relative overflow-hidden group">
                                            <Heart className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-100 transition-transform group-hover:scale-110" />
                                            <div className="relative">
                                                <p className="text-[10px] font-black text-purple-600 uppercase mb-3 tracking-widest">Parent Portal</p>
                                                {admissionResult.parent ? (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                            <span className="text-xs font-bold text-gray-400">User:</span>
                                                            <span className="text-xs font-black">{admissionResult.parent.username}</span>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(admissionResult.parent.username)}><Copy className="w-3 h-3" /></Button>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-white p-2 rounded-lg">
                                                            <span className="text-xs font-bold text-gray-400">Pass:</span>
                                                            <span className="text-xs font-black">{showPasswords ? admissionResult.parent.password : '••••••••'}</span>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}</Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-[76px] flex items-center justify-center bg-white/50 rounded-xl">
                                                        <p className="text-[10px] font-bold text-purple-400 italic">Linked to Existing Account</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 text-xs font-bold text-amber-700 flex items-center justify-center gap-2">
                                        <PlusCircle className="w-4 h-4" />
                                        Credentials have been sent to parent email (Mocked)
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-3 shrink-0">
                    {step < 5 ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={step === 1 ? () => setOpen(false) : prevStep}
                                className="font-bold rounded-xl h-12"
                            >
                                {step === 1 ? 'Cancel' : 'Previous Step'}
                            </Button>
                            <div className="flex gap-2">
                                {step < 4 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="h-12 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black flex gap-2 items-center"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSaving}
                                        className="h-12 px-8 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-black flex gap-2 items-center btn-shine"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Finalize Admission
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <Button
                            className="w-full h-12 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black"
                            onClick={() => {
                                setOpen(false);
                                setStep(1);
                                setAdmissionResult(null);
                            }}
                        >
                            Close Panel
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

