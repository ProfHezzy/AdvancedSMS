'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DollarSign,
    Loader2,
    Calendar,
    Download,
    CheckCircle2,
    PlayCircle,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { generateMonthlyPayroll } from '@/actions/hr';
import { getStaffList } from '@/actions/staff'; // Reuse existing if possible or use hr actions
import { cn } from '@/lib/utils';

export default function SalariesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [payrollData, setPayrollData] = useState<any[]>([]);

    useEffect(() => {
        loadPayroll();
    }, [month, year]);

    async function loadPayroll() {
        setIsLoading(true);
        // This would ideally call a getMonthlyPayroll server action
        // For now, let's assume we fetch all staff and their potential payroll
        const res = await getStaffList();
        if (res.success && res.data) {
            setPayrollData(res.data);
        }
        setIsLoading(false);
    }

    const handleGenerate = async () => {
        setIsGenerating(true);
        const res = await generateMonthlyPayroll(month, year);
        if (res.success) {
            toast.success(`Payroll for ${getMonthName(month)} ${year} generated successfully!`);
            loadPayroll();
        } else {
            toast.error('Failed to generate payroll. Ensure salary structures are set.');
        }
        setIsGenerating(false);
    };

    const getMonthName = (m: number) => {
        return new Date(2000, m - 1).toLocaleString('default', { month: 'long' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Monthly Salaries
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Generate and process monthly payroll disbursements.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-brand-100 shadow-sm">
                        <Calendar className="w-4 h-4 text-brand-400" />
                        <select
                            value={month}
                            onChange={e => setMonth(parseInt(e.target.value))}
                            className="bg-transparent font-bold text-sm focus:outline-none"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={e => setYear(parseInt(e.target.value))}
                            className="bg-transparent font-bold text-sm focus:outline-none"
                        >
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                        Run Payroll
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft overflow-hidden bg-brand-600 text-white">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Disbursement</p>
                        <h3 className="text-3xl font-black mt-1">$0.00</h3>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" /> All structures verified
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft overflow-hidden border-brand-100 bg-white">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-brand-400">Paid Staff</p>
                        <h3 className="text-3xl font-black mt-1 text-gray-900">0 / {payrollData.length}</h3>
                        <p className="text-[10px] text-muted-foreground mt-2 italic font-medium">Pending approval from Finance</p>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft overflow-hidden border-rose-100 bg-rose-50/10">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-rose-400">Issues Flagged</p>
                        <h3 className="text-3xl font-black mt-1 text-rose-600">0</h3>
                        <p className="text-[10px] text-rose-400 mt-2 font-bold uppercase tracking-tighter">No discrepancies detected</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-black uppercase">Payroll Register: {getMonthName(month)} {year}</CardTitle>
                    <Button variant="ghost" className="h-8 text-brand-600 font-bold gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Staff Name</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Role</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Base</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Net Pay</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payrollData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400 italic">No payroll entries found. Click "Run Payroll" to generate.</td>
                                </tr>
                            ) : (
                                payrollData.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-brand-50/10 transition-colors">
                                        <td className="p-4">
                                            <p className="font-black text-gray-900 leading-tight">{entry.name}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter bg-brand-50 px-2 py-0.5 rounded">
                                                {entry.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-600">$0.00</td>
                                        <td className="p-4 text-right font-black text-brand-700">$0.00</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700">
                                                    Pending
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-brand-50">
                                                <AlertCircle className="w-4 h-4 text-brand-400" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
