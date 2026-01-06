'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    Calendar,
    BarChart3,
    PieChart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    FileSpreadsheet,
    FileCode
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FinancialReportsPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Financial Intelligence
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Analyze revenue streams, collection efficiency, and institutional financial health.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Calendar className="w-4 h-4" />
                        First Term 2025/2026
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Download className="w-4 h-4" />
                        Export Period Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass border-none shadow-soft overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Collections</p>
                                        <h3 className="text-3xl font-black text-gray-800">₦12,482,000</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+12% vs last term</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass border-none shadow-soft overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Outstanding Dues</p>
                                        <h3 className="text-3xl font-black text-gray-800">₦1,530,000</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                                        <BarChart3 className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1">
                                    <ArrowDownRight className="w-3 h-3 text-rose-600" />
                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">-5% improvement</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="glass border-none shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Revenue Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center border-t border-brand-50 mt-4">
                            <div className="text-center group cursor-pointer">
                                <PieChart className="w-12 h-12 text-brand-200 mx-auto group-hover:text-brand-500 transition-colors" />
                                <p className="text-sm text-muted-foreground mt-2 font-medium italic">Advanced Analytics Visualization Pending</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">Available Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {[
                                { title: 'Tuition Fee Analysis', format: 'PDF / XLSX', icon: FileText },
                                { title: 'Parent Wallet Audit', format: 'PDF / XLSX', icon: FileSpreadsheet },
                                { title: 'Expense Statement', format: 'PDF / XLSX', icon: FileText },
                                { title: 'Revenue Forecast Q1', format: 'JSON / CSV', icon: FileCode },
                                { title: 'Staff Payroll Summary', format: 'PDF / XLSX', icon: FileText },
                            ].map((report, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-brand-50 hover:bg-brand-50/50 hover:border-brand-200 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                                            <report.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-800 tracking-tight">{report.title}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{report.format}</p>
                                        </div>
                                    </div>
                                    <Download className="w-4 h-4 text-brand-300 group-hover:text-brand-600 transition-colors" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-brand-700 to-brand-900 text-white">
                        <CardContent className="p-6">
                            <FileText className="w-8 h-8 mb-4 text-brand-200" />
                            <h3 className="text-lg font-black leading-tight">Generate Custom Report</h3>
                            <p className="text-xs font-bold text-brand-100/70 mt-2 mb-4">
                                Select specific metrics and date ranges for a bespoke financial analysis.
                            </p>
                            <Button className="w-full bg-white text-brand-900 hover:bg-brand-50 font-black">
                                Configure Report
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
