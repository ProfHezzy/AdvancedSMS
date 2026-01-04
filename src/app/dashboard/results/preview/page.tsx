'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Download,
    Printer,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

export default function ReportSheetPreviewPage() {
    const [selectedClass, setSelectedClass] = useState('JSS 1 A');

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Report Sheet Preview
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Verify student academic reports before publication.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 border-brand-200 text-brand-700 font-bold gap-2">
                        <Printer className="w-4 h-4" /> Print Batch
                    </Button>
                    <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                        <Download className="w-5 h-5" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex items-center gap-4 flex-1 w-full bg-white/50 p-2 rounded-xl border border-brand-100">
                        <Search className="w-5 h-5 text-brand-400 ml-2" />
                        <input
                            placeholder="Find student..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-full"
                        />
                    </div>
                    <select
                        className="h-12 px-4 rounded-xl border border-brand-100 bg-white font-bold text-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option>JSS 1 A</option>
                        <option>JSS 1 B</option>
                        <option>SS 3 Science</option>
                    </select>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Preview Window */}
                <div className="lg:col-span-8">
                    <Card className="bg-white border-2 border-brand-100 shadow-lg min-h-[800px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 via-rose-500 to-brand-500" />
                        <CardContent className="p-12 space-y-8">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-gray-900 uppercase">Excellent Minds Academy</h2>
                                    <p className="text-sm text-gray-500 font-medium">123 Education Lane, Lagos, Nigeria</p>
                                    <p className="text-sm text-gray-500 font-medium">info@excellentminds.edu.ng</p>
                                </div>
                                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-black text-brand-600">EM</span>
                                </div>
                            </div>

                            {/* Student Info */}
                            <div className="grid grid-cols-2 gap-8 py-4">
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Student Name</p>
                                    <p className="text-xl font-bold text-gray-900">Chioma Adeyemi</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Class</p>
                                    <p className="text-xl font-bold text-gray-900">JSS 1 A</p>
                                </div>
                            </div>

                            {/* Grades Table */}
                            <div className="border rounded-xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-brand-50/50">
                                        <tr>
                                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">Subject</th>
                                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 text-center">CA (40)</th>
                                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Exam (60)</th>
                                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Total</th>
                                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Grade</th>
                                            <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { sub: 'Mathematics', ca: 35, ex: 52, tot: 87, grd: 'A', rem: 'Excellent' },
                                            { sub: 'English Language', ca: 30, ex: 45, tot: 75, grd: 'A', rem: 'Very Good' },
                                            { sub: 'Basic Science', ca: 28, ex: 38, tot: 66, grd: 'B', rem: 'Good' },
                                            { sub: 'Civic Education', ca: 32, ex: 50, tot: 82, grd: 'A', rem: 'Excellent' },
                                        ].map((row, i) => (
                                            <tr key={i}>
                                                <td className="p-4 font-bold text-gray-700">{row.sub}</td>
                                                <td className="p-4 text-center font-medium text-gray-600">{row.ca}</td>
                                                <td className="p-4 text-center font-medium text-gray-600">{row.ex}</td>
                                                <td className="p-4 text-center font-black text-brand-700">{row.tot}</td>
                                                <td className="p-4 text-center">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[10px] font-black",
                                                        row.grd === 'A' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    )}>{row.grd}</span>
                                                </td>
                                                <td className="p-4 text-sm font-medium text-gray-500 italic">{row.rem}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Remarks */}
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Class Teacher's Remark</p>
                                    <p className="font-medium text-gray-800">Chioma is a brilliant student who participates actively in class activities. Keep it up!</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Principal's Comment</p>
                                    <p className="font-medium text-gray-800">An outstanding result. Promoted to JSS 2.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Navigation */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="glass border-none shadow-soft">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-800">Student Dictionary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[400px] overflow-y-auto">
                                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <button
                                        key={i}
                                        className={cn(
                                            "w-full px-6 py-4 flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0",
                                            i === 1 ? "bg-brand-50/50" : "hover:bg-gray-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                                            i === 1 ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
                                        )}>
                                            {i === 1 ? 'CA' : 'S'}
                                        </div>
                                        <div className="text-left">
                                            <p className={cn("font-bold text-sm", i === 1 ? "text-brand-700" : "text-gray-700")}>
                                                {i === 1 ? 'Chioma Adeyemi' : `Student Name ${i}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium">ID: 2024/{1000 + i}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 h-12 gap-2 border-gray-200 font-bold">
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </Button>
                        <Button className="flex-1 h-12 bg-gray-900 text-white font-bold gap-2 hover:bg-black">
                            Next Student <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
