'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CreditCard,
    Download,
    History,
    Plus,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    DollarSign,
    Calculator
} from 'lucide-react';
import { getPayrollHistory, generatePayroll } from '@/actions/staff';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function HRPayrollPage() {
    const [payroll, setPayroll] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPayroll();
    }, []);

    async function fetchPayroll() {
        setIsLoading(true);
        const res = await getPayrollHistory();
        if (res.success && res.data) {
            setPayroll(res.data);
        }
        setIsLoading(false);
    }

    const handleGeneratePayroll = async () => {
        toast.promise(generatePayroll('January', '2026'), {
            loading: 'Generating school payroll...',
            success: 'Payroll generated successfully!',
            error: 'Failed to generate payroll'
        });
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Payroll Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage staff salaries, bonuses, and institutional disbursement history.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <History className="w-4 h-4" />
                        History
                    </Button>
                    <Button
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2"
                        onClick={handleGeneratePayroll}
                    >
                        <Calculator className="w-5 h-5" />
                        Process Monthly Payroll
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800 -z-10" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-brand-100 text-xs uppercase tracking-widest font-black">Total Disbursement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">$45,200.00</div>
                        <p className="text-xs text-brand-100/60 font-medium mt-2">Estimated for Jan 2026</p>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft overflow-hidden group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-muted-foreground text-xs uppercase tracking-widest font-black">Bonuses & Incentives</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-green-600">$1,240.00</div>
                        <div className="text-xs text-green-600/60 font-bold mt-2 flex items-center gap-1">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            +4% from last month
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft overflow-hidden group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-muted-foreground text-xs uppercase tracking-widest font-black">Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-amber-500">12 Staff</div>
                        <p className="text-xs text-amber-600/60 font-bold mt-2">Awaiting HR final review</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-brand-50/50 pb-6">
                    <div>
                        <CardTitle className="text-xl font-black">Staff Payroll Sheet</CardTitle>
                        <CardDescription>January 2026 Payment Schedule</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                className="h-10 pl-10 pr-4 rounded-lg bg-white/50 border border-brand-100 text-xs outline-none focus:ring-2 focus:ring-brand-500 w-48"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 border-brand-100">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-20 text-center animate-pulse font-black text-brand-200">
                            CALCULATING LEDGER...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-brand-50/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <th className="px-6 py-4">Staff Member</th>
                                        <th className="px-6 py-4">Base Salary</th>
                                        <th className="px-6 py-4">Bonuses</th>
                                        <th className="px-6 py-4">Deductions</th>
                                        <th className="px-6 py-4">Net Pay</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-50/50">
                                    {payroll.map((item, idx) => (
                                        <tr key={item.id} className="group hover:bg-brand-50/20 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center font-black text-brand-700 text-xs border border-brand-100">
                                                        {item.staffName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 leading-none">{item.staffName}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-1">{item.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-600">${item.baseSalary}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-green-600">+${item.bonus}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-rose-600">-${item.deduction}</td>
                                            <td className="px-6 py-4 font-black text-gray-900">${item.netPay}</td>
                                            <td className="px-6 py-4">
                                                <div className={cn(
                                                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    item.status === 'PAID' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700 animate-pulse"
                                                )}>
                                                    {item.status === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {item.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-brand-600 font-bold hover:bg-brand-50">
                                                    Details
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
