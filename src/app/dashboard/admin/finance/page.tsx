'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Download,
    DollarSign,
    CreditCard,
    TrendingUp,
    MoreHorizontal,
    Hash,
    Calendar,
    Loader2
} from 'lucide-react';
import { getFees, createFee } from '@/actions/finance';
import { getClasses } from '@/actions/admin';
import { getSessions } from '@/actions/admin';
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
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminFinancePage() {
    const [fees, setFees] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        termId: '',
        classId: '',
        dueDate: ''
    });

    useEffect(() => {
        initData();
    }, []);

    async function initData() {
        setIsLoading(true);
        const [fRes, cRes, sRes] = await Promise.all([
            getFees(),
            getClasses(),
            getSessions()
        ]);

        if (fRes.success) setFees(fRes.data);
        if (cRes.success) setClasses(cRes.data);
        if (sRes.success) setSessions(sRes.data);

        setIsLoading(false);
    }

    const handleCreateFee = async () => {
        if (!formData.title || !formData.amount || !formData.termId) {
            return toast.error("Please fill required fields");
        }

        const res = await createFee({
            title: formData.title,
            amount: parseFloat(formData.amount),
            termId: formData.termId,
            classId: formData.classId || undefined,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
        });

        if (res.success) {
            toast.success("Fee structure created");
            setIsCreateOpen(false);
            initData();
        } else {
            toast.error("Failed to create fee");
        }
    };

    const currentTerms = sessions.find(s => s.status === 'ACTIVE')?.terms || [];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        School Finance
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage tuition, levies, and institutional accounts.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                                <Plus className="w-5 h-5" />
                                New Fee Structure
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Fee Type</DialogTitle>
                                <DialogDescription>Define a new institutional or class-based fee.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Fee Title</Label>
                                    <Input placeholder="e.g. 2nd Term Tuition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount (₦)</Label>
                                    <Input type="number" placeholder="0.00" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>For Term</Label>
                                        <Select value={formData.termId} onChange={e => setFormData({ ...formData, termId: e.target.value })}>
                                            <option value="" disabled>Select Term</option>
                                            {currentTerms.map((t: any) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>For Class (Optional)</Label>
                                        <Select value={formData.classId} onChange={e => setFormData({ ...formData, classId: e.target.value })}>
                                            <option value="">All Classes</option>
                                            {classes.map((c: any) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateFee}>Define Fee</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="glass border-none shadow-soft overflow-hidden group">
                    <CardContent className="p-6">
                        <DollarSign className="w-12 h-12 text-brand-500 opacity-20 absolute -right-2 top-0" />
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Fee Inventory</p>
                        <h3 className="text-3xl font-black text-gray-800">{fees.length}</h3>
                        <p className="text-[10px] font-bold text-brand-600 mt-2 uppercase tracking-wide">Active structures</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-brand-50/50 pb-6 border-b border-brand-100 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-gray-800 uppercase tracking-tight">Fee Schedule</CardTitle>
                        <CardDescription className="font-medium">Institutional fee definitions and payment rates.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <th className="px-6 py-4">Structure</th>
                                        <th className="px-6 py-4">Target</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Due Date</th>
                                        <th className="px-6 py-4">Payments</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-50/50">
                                    {fees.map((fee) => (
                                        <tr key={fee.id} className="hover:bg-brand-50/20 transition-all group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-black text-gray-800">{fee.title}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{fee.term.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-600">
                                                {fee.class ? (
                                                    <Badge variant="outline" className="border-brand-200 text-brand-700 bg-brand-50 font-black px-2 py-0.5 rounded">
                                                        {fee.class.name}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-black px-2 py-0.5 rounded">
                                                        MANDATORY
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-black text-gray-900">₦{fee.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                                {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-500 rounded-full w-[0%]" />
                                                    </div>
                                                    <span className="text-[10px] font-black">{fee._count.payments} logs</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-brand-600">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
