'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    UserPlus,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Briefcase,
    Building2,
    ShieldCheck,
    Settings,
    PlusCircle,
    Copy,
    Check,
    Eye,
    EyeOff,
    Phone,
    Mail,
    MapPin,
    GraduationCap,
    Clock,
    Info,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { registerStaff } from '@/actions/staff-onboarding';
import { getAdminClasses } from '@/actions/admission-support';
import { Role } from '@prisma/client';

interface Props {
    onSuccess?: () => void;
}

const ROLES = [
    { value: 'TEACHER', label: 'Teacher', category: 'ACADEMIC' },
    { value: 'HR', label: 'HR Officer', category: 'NON_ACADEMIC' },
    { value: 'ACCOUNTANT', label: 'Accountant', category: 'NON_ACADEMIC' },
    { value: 'MEDICAL', label: 'Medical Staff', category: 'NON_ACADEMIC' },
    { value: 'SECURITY', label: 'Security Staff', category: 'NON_ACADEMIC' },
    { value: 'ADMIN', label: 'Administrator', category: 'NON_ACADEMIC' },
];

const DEPARTMENTS = [
    'Academics',
    'Administration',
    'Finance',
    'Health',
    'Security',
    'Operations',
    'ICT'
];

export function StaffOnboardingModal({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);

    const [formData, setFormData] = useState<any>({
        firstName: '',
        lastName: '',
        gender: 'MALE',
        dateOfBirth: '',
        role: 'TEACHER' as Role,
        department: 'Academics',
        jobTitle: '',
        employmentType: 'FULL_TIME',
        category: 'ACADEMIC',
        dutyUnit: '',
        shiftType: 'MORNING',
        phone: '',
        email: '',
        address: '',
        employmentStartDate: new Date().toISOString().split('T')[0],
        classIds: [],
        isClassTeacher: false
    });

    const [onboardingResult, setOnboardingResult] = useState<any>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (open) {
            loadInitialData();
        }
    }, [open]);

    async function loadInitialData() {
        setIsLoading(true);
        const res = await getAdminClasses();
        if (res.success) setClasses(res.data);
        setIsLoading(false);
    }

    const nextStep = () => {
        if (step === 1 && (!formData.firstName || !formData.lastName)) {
            toast.error("First and Last Name are required");
            return;
        }
        if (step === 2 && !formData.jobTitle) {
            toast.error("Job Title is required");
            return;
        }
        if (step === 4 && (!formData.phone || !formData.email)) {
            toast.error("Email and Phone are required");
            return;
        }
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSaving(true);
        const res = await registerStaff(formData);
        if (res.success) {
            toast.success("Staff onboarding successful!");
            setOnboardingResult(res.data);
            setStep(6);
            onSuccess?.();
        } else {
            toast.error(res.error || "Onboarding failed");
        }
        setIsSaving(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
    };

    const steps = [
        { id: 1, name: 'Personal', icon: <UserPlus className="w-4 h-4" /> },
        { id: 2, name: 'Work', icon: <Briefcase className="w-4 h-4" /> },
        { id: 3, name: 'Assignment', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 4, name: 'Contact', icon: <Phone className="w-4 h-4" /> },
        { id: 5, name: 'Review', icon: <Settings className="w-4 h-4" /> },
        { id: 6, name: 'Done', icon: <CheckCircle2 className="w-4 h-4" /> }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-lg shadow-orange-600/20 gap-2 btn-shine">
                    <UserPlus className="w-5 h-5" />
                    Onboard Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none glass shadow-2xl rounded-3xl h-[600px] flex flex-col">
                <DialogHeader className="p-6 bg-orange-600 text-white shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Staff Onboarding</DialogTitle>
                            <p className="text-orange-100 text-xs font-medium mt-1">Enterprise-Grade Staff Management Flow</p>
                        </div>
                        <div className="flex gap-2">
                            {steps.slice(0, 5).map((s) => (
                                <div key={s.id} className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                    step >= s.id ? "bg-white text-orange-600 scale-110 shadow-lg" : "bg-orange-500 text-orange-200"
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
                            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
                            <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-xs">Initializing Staff Engine...</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                            <UserPlus className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Basic Personal Information</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">First Name</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="e.g. Michael"
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Last Name</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="e.g. Scott"
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Gender</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3"
                                                value={formData.gender}
                                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
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
                                                value={formData.dateOfBirth}
                                                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Role & Department Assignment</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Staff Role</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3"
                                                value={formData.role}
                                                onChange={e => {
                                                    const role = e.target.value as Role;
                                                    const category = ROLES.find(r => r.value === role)?.category || 'NON_ACADEMIC';
                                                    setFormData({ ...formData, role, category });
                                                }}
                                            >
                                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Department</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3"
                                                value={formData.department}
                                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            >
                                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Job Title</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="e.g. Mathematics Teacher"
                                                value={formData.jobTitle}
                                                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Employment Type</Label>
                                            <select
                                                className="w-full h-12 rounded-xl border border-input bg-background px-3"
                                                value={formData.employmentType}
                                                onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                                            >
                                                <option value="FULL_TIME">Full-Time</option>
                                                <option value="PART_TIME">Part-Time</option>
                                                <option value="CONTRACT">Contract</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                            <PlusCircle className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Work Assignment (Role-Dependent)</h3>
                                    </div>

                                    {formData.role === 'TEACHER' ? (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Assigned Classes</Label>
                                                <div className="grid grid-cols-3 gap-2 h-32 overflow-y-auto border rounded-xl p-3">
                                                    {classes.map(c => (
                                                        <label key={c.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all border border-transparent hover:border-orange-100">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                                                                checked={formData.classIds.includes(c.id)}
                                                                onChange={(e) => {
                                                                    const ids = e.target.checked
                                                                        ? [...formData.classIds, c.id]
                                                                        : formData.classIds.filter((id: string) => id !== c.id);
                                                                    setFormData({ ...formData, classIds: ids });
                                                                }}
                                                            />
                                                            <span className="text-xs font-bold text-gray-600">{c.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                                <GraduationCap className="w-5 h-5 text-orange-600" />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isClassTeacher"
                                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                                                        checked={formData.isClassTeacher}
                                                        onChange={(e) => setFormData({ ...formData, isClassTeacher: e.target.checked })}
                                                    />
                                                    <label htmlFor="isClassTeacher" className="text-xs font-black text-orange-900 cursor-pointer">Set as Class Teacher for selected classes</label>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Duty Unit</Label>
                                                <Input
                                                    className="h-12 rounded-xl"
                                                    placeholder="e.g. Gate A, Sick Bay"
                                                    value={formData.dutyUnit}
                                                    onChange={e => setFormData({ ...formData, dutyUnit: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] uppercase font-bold text-gray-400">Shift Type</Label>
                                                <select
                                                    className="w-full h-12 rounded-xl border border-input bg-background px-3"
                                                    value={formData.shiftType}
                                                    onChange={e => setFormData({ ...formData, shiftType: e.target.value })}
                                                >
                                                    <option value="MORNING">Morning</option>
                                                    <option value="EVENING">Evening</option>
                                                    <option value="ROTATIONAL">Rotational</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                                            <Phone className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Contact Information</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Phone Number</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="+234..."
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Email Address (Login Username)</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="staff@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-[10px] uppercase font-bold text-gray-400">Residential Address (Optional)</Label>
                                            <Input
                                                className="h-12 rounded-xl"
                                                placeholder="Full address"
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Settings className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight">Review & Internal Controls</h3>
                                    </div>

                                    <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Staff Name</p>
                                                <p className="text-sm font-black text-gray-800">{formData.firstName} {formData.lastName}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Role & Title</p>
                                                <p className="text-sm font-black text-gray-800">{formData.role} - {formData.jobTitle || '---'}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Department</p>
                                                <p className="text-sm font-black text-gray-800">{formData.department}</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Employment Date</p>
                                                <p className="text-sm font-black text-gray-800">{formData.employmentStartDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-orange-100">
                                            <ShieldCheck className="w-5 h-5 text-orange-600" />
                                            <p className="text-[10px] font-bold text-orange-800 uppercase">System will auto-generate Staff ID and Login Credentials.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 6 && onboardingResult && (
                                <div className="space-y-6 animate-in zoom-in-95 py-4 text-center">
                                    <div className="relative inline-block">
                                        <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Account Ready!</h3>
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Enterprise Staff Identity Provisioned</p>
                                    </div>

                                    <div className="max-w-md mx-auto space-y-3">
                                        <div className="bg-gray-900 rounded-3xl p-6 text-left relative overflow-hidden group/card shadow-2xl">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                                                <Settings className="w-24 h-24 animate-spin" />
                                            </div>

                                            <div className="relative space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Assigned Staff ID</p>
                                                        <p className="text-2xl font-black text-white font-mono">{onboardingResult.staffId}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[10px] font-black uppercase text-orange-500 hover:text-orange-400 hover:bg-white/5 gap-1"
                                                        onClick={() => {
                                                            copyToClipboard(`${onboardingResult.username} / ${onboardingResult.password}`);
                                                            toast.success("All credentials copied!");
                                                        }}
                                                    >
                                                        <Copy className="w-3 h-3" /> Copy All
                                                    </Button>
                                                </div>

                                                <div className="h-px bg-white/10 w-full" />

                                                <div className="grid grid-cols-1 gap-3">
                                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-gray-500" />
                                                            <span className="text-[10px] font-black text-gray-400 uppercase">Username</span>
                                                        </div>
                                                        <span className="text-xs font-black text-white">{onboardingResult.username}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <Lock className="w-4 h-4 text-gray-500" />
                                                            <span className="text-[10px] font-black text-gray-400 uppercase">Password</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-white tracking-widest">
                                                                {showPassword ? onboardingResult.password : '••••••••'}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-gray-400 hover:text-white"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 text-left">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                <Info className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <p className="text-[10px] leading-relaxed font-bold text-blue-700 uppercase tracking-tighter">
                                                Staff will be forced to change this password on their first login for security compliance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-3 shrink-0">
                    {step < 6 ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={step === 1 ? () => setOpen(false) : prevStep}
                                className="font-bold rounded-xl h-12"
                            >
                                {step === 1 ? 'Cancel' : 'Previous Step'}
                            </Button>
                            <div className="flex gap-2">
                                {step < 5 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black flex gap-2 items-center"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSaving}
                                        className="h-12 px-8 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-black flex gap-2 items-center btn-shine"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Finalize Onboarding
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <Button
                            className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black"
                            onClick={() => {
                                setOpen(false);
                                setStep(1);
                                setOnboardingResult(null);
                            }}
                        >
                            Complete & Close
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
