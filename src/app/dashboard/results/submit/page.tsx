'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    AlertTriangle,
    FileText,
    Send,
    Eye,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SubmitResultsPage() {
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [results, setResults] = useState([
        { id: 'R1', subject: 'Mathematics', class: 'JSS 1 A', teacher: 'Mrs. Okon', status: 'PENDING', totalStudents: 45, completed: 45 },
        { id: 'R2', subject: 'English Language', class: 'JSS 1 A', teacher: 'Mr. David', status: 'PENDING', totalStudents: 45, completed: 42 },
        { id: 'R3', subject: 'Basic Science', class: 'JSS 1 A', teacher: 'Dr. Sarah', status: 'APPROVED', totalStudents: 45, completed: 45 },
        { id: 'R4', subject: 'Civic Education', class: 'JSS 1 A', teacher: 'Mr. James', status: 'REJECTED', totalStudents: 45, completed: 45 },
    ]);

    const handleSubmit = async (id: string) => {
        setSubmitting(id);
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setResults(prev => prev.map(r =>
            r.id === id ? { ...r, status: 'APPROVED' } : r
        ));
        setSubmitting(null);
        toast.success('Results submitted successfully for approval.');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Submit Results
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Finalize and submit course grades for administrative review.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft bg-blue-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Pending</p>
                            <p className="text-2xl font-black text-gray-900">12 Lists</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-green-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Approved</p>
                            <p className="text-2xl font-black text-gray-900">85 Lists</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft bg-rose-50/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Rejected</p>
                            <p className="text-2xl font-black text-gray-900">3 Lists</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardHeader className="bg-white/50 border-b border-brand-50">
                    <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-widest">Score Sheets</CardTitle>
                    <CardDescription>Review status before final submission.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="p-4 pl-6 text-xs font-black uppercase tracking-widest text-gray-500">Subject Details</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500">Completion</th>
                                <th className="p-4 text-xs font-black uppercase tracking-widest text-gray-500 text-center">Status</th>
                                <th className="p-4 pr-6 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {results.map((item) => (
                                <tr key={item.id} className="group hover:bg-brand-50/30 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="font-bold text-gray-900 text-sm uppercase">{item.subject}</div>
                                        <div className="text-xs text-muted-foreground font-medium flex gap-2 mt-1">
                                            <Badge variant="outline" className="border-brand-200 text-brand-700 font-bold">{item.class}</Badge>
                                            <span>{item.teacher}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full w-24 overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-500 rounded-full"
                                                    style={{ width: `${(item.completed / item.totalStudents) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">{item.completed}/{item.totalStudents}</span>
                                        </div>
                                        {item.completed < item.totalStudents && (
                                            <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> Incomplete
                                            </p>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <Badge className={cn(
                                            "font-black tracking-wider",
                                            item.status === 'APPROVED' ? "bg-green-100 text-green-700 hover:bg-green-200" :
                                                item.status === 'REJECTED' ? "bg-rose-100 text-rose-700 hover:bg-rose-200" :
                                                    "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                        )}>
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-brand-600">
                                                <Eye className="w-4 h-4 mr-2" /> Review
                                            </Button>
                                            {item.status === 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    className="h-8 bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-md"
                                                    onClick={() => handleSubmit(item.id)}
                                                    disabled={!!submitting}
                                                >
                                                    {submitting === item.id ? (
                                                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                                    ) : (
                                                        <>Submit <Send className="w-3 h-3 ml-2" /></>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
