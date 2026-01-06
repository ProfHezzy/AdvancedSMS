'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Settings2,
    BookOpen,
    Bus,
    Utensils,
    Music,
    Pencil,
    Trash2,
    DollarSign,
    Calendar,
    Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeeConfigurationPage() {
    const feeCategories = [
        { title: 'Tuition Fees', icon: BookOpen, count: '12 Classes', total: '₦450,000 / term', color: 'bg-blue-500' },
        { title: 'Transportation', icon: Bus, count: '4 Zones', total: '₦25,000 / month', color: 'bg-amber-500' },
        { title: 'Feeding Plan', icon: Utensils, count: '2 Options', total: '₦40,000 / term', color: 'bg-emerald-500' },
        { title: 'Extracurricular', icon: Music, count: '6 Clubs', total: 'Varies', color: 'bg-purple-500' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Fee Infrastructure
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Configure tuition, levies, and auxiliary service pricing for the current session.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-brand-100 text-brand-700 font-bold gap-2">
                        <Calendar className="w-4 h-4" />
                        Session 2025/2026
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Plus className="w-4 h-4" />
                        Add Fee Item
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {feeCategories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                        <Card key={i} className="glass border-none shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                            <CardContent className="p-6">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg mb-4", cat.color)}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">{cat.title}</h3>
                                <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-widest">{cat.count}</p>
                                <p className="text-sm font-black text-brand-600 mt-2">{cat.total}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-brand-50/50 pb-4 border-b border-brand-50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tight">Active Fee Schedule</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Term • JSS & SS Categories</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 rounded-lg border-brand-100 font-bold gap-2">
                        <Settings2 className="w-4 h-4" />
                        Bulk Update
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-brand-50/30">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Fee Description</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Frequency</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-brand-700 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-50">
                                {[
                                    { title: 'Tuition Fee (JSS 1-3)', cat: 'Academic', amount: '₦120,000', freq: 'Per Term', status: 'Active' },
                                    { title: 'Tuition Fee (SS 1-3)', cat: 'Academic', amount: '₦150,000', freq: 'Per Term', status: 'Active' },
                                    { title: 'ICT & Lab Levy', cat: 'Facility', amount: '₦15,000', freq: 'Per Year', status: 'Active' },
                                    { title: 'Development Fund', cat: 'Levy', amount: '₦10,000', freq: 'One-time', status: 'Active' },
                                    { title: 'PTA Levy', cat: 'Parent', amount: '₦5,000', freq: 'Per Term', status: 'Draft' },
                                ].map((fee, i) => (
                                    <tr key={i} className="hover:bg-brand-50/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800 text-sm">{fee.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-2 py-1 rounded uppercase tracking-wider">{fee.cat}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-gray-700">{fee.amount}</td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">{fee.freq}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", fee.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300')} />
                                                <span className={cn("text-[10px] font-black uppercase tracking-widest", fee.status === 'Active' ? 'text-emerald-600' : 'text-gray-400')}>{fee.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-600">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-rose-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
