'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DollarSign,
    Save,
    Loader2,
    Settings2,
    Search,
    Check,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import { getSalaryStructures, upsertSalaryStructure, getStaffAttendanceList } from '@/actions/hr';
import { cn } from '@/lib/utils';

export default function SalaryStructurePage() {
    const [structures, setStructures] = useState<any[]>([]);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setIsLoading(true);
        const [structRes, staffRes] = await Promise.all([
            getSalaryStructures(),
            getStaffAttendanceList(new Date()) // Hacky way to get all staff for now
        ]);

        if (staffRes.success && staffRes.data) {
            const list = staffRes.data.map((s: any) => {
                const struct = structRes.success && structRes.data
                    ? structRes.data.find((st: any) => st.staffId === s.id)
                    : null;

                return {
                    id: s.id,
                    name: s.user.name || s.user.username,
                    role: s.user.role,
                    image: s.user.image,
                    baseSalary: struct ? struct.baseSalary : 0,
                    allowances: struct ? struct.allowances : 0,
                    deductions: struct ? struct.deductions : 0,
                };
            });
            setStaffList(list);
        }
        setIsLoading(false);
    }

    const updateValue = (id: string, field: string, value: string) => {
        const num = parseFloat(value) || 0;
        setStaffList(prev => prev.map(s => s.id === id ? { ...s, [field]: num } : s));
    };

    const handleSave = async (staffId: string) => {
        setIsSaving(true);
        const staff = staffList.find(s => s.id === staffId);
        if (!staff) return;

        const res = await upsertSalaryStructure({
            staffId: staff.id,
            baseSalary: staff.baseSalary,
            allowances: staff.allowances,
            deductions: staff.deductions
        });

        if (res.success) {
            toast.success(`Salary structure for ${staff.name} updated!`);
        } else {
            toast.error('Failed to update salary structure.');
        }
        setIsSaving(false);
    };

    const filteredStaff = staffList.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Payroll Structure
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Define and update salary components for all departments.
                </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-50">
                <Search className="w-5 h-5 text-brand-300" />
                <Input
                    placeholder="Search staff by name or role..."
                    className="border-none focus-visible:ring-0 text-lg font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredStaff.map((staff) => (
                    <Card key={staff.id} className="glass border-none shadow-soft overflow-hidden group">
                        <CardHeader className="bg-brand-50/50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                    <AvatarImage src={staff.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${staff.name}`} />
                                    <AvatarFallback>{staff.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-black text-gray-900 leading-tight">{staff.name}</p>
                                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{staff.role}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-white/80 border-brand-100 font-bold">
                                NET: ${(staff.baseSalary + staff.allowances - staff.deductions).toLocaleString()}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400">Base Salary</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            className="pl-7 font-bold border-brand-50 rounded-lg focus:border-brand-500 transition-colors"
                                            value={staff.baseSalary}
                                            onChange={e => updateValue(staff.id, 'baseSalary', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400">Allowances</Label>
                                    <div className="relative">
                                        <Check className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                                        <Input
                                            type="number"
                                            className="pl-7 font-bold border-brand-50 rounded-lg text-green-600"
                                            value={staff.allowances}
                                            onChange={e => updateValue(staff.id, 'allowances', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-gray-400">Deductions</Label>
                                    <div className="relative">
                                        <X className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                                        <Input
                                            type="number"
                                            className="pl-7 font-bold border-brand-50 rounded-lg text-rose-600"
                                            value={staff.deductions}
                                            onChange={e => updateValue(staff.id, 'deductions', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => handleSave(staff.id)}
                                disabled={isSaving}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest text-xs h-10 gap-2"
                            >
                                <Save className="w-3 h-3" /> Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredStaff.length === 0 && (
                <div className="p-20 text-center glass rounded-3xl border-dashed border-2 border-brand-100">
                    <Settings2 className="w-16 h-16 text-brand-100 mx-auto mb-4" />
                    <p className="text-xl font-black text-brand-300 uppercase italic">No staff records match your search.</p>
                </div>
            )}
        </div>
    );
}

function Badge({ children, variant, className }: any) {
    return (
        <div className={cn("px-2.5 py-0.5 rounded-full text-xs transition-colors", className)}>
            {children}
        </div>
    );
}
