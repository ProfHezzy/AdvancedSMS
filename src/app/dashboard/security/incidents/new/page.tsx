'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertTriangle,
    ShieldAlert,
    MapPin,
    Camera,
    Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReportIncidentPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.error('Incident reported to Central Security. Unit dispatched.');
        setIsSubmitting(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-2xl mx-auto">
            <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-rose-100 flex items-center justify-center mx-auto mb-6 text-rose-600 animate-pulse">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-rose-600 to-red-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Report Incident
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Log security breaches or safety concerns immediately.
                </p>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <div className="h-2 bg-rose-500 w-full animate-pulse" />
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Type
                                </label>
                                <select className="w-full h-12 px-4 pr-10 rounded-xl border border-brand-100 bg-white font-bold text-gray-800 outline-none focus:ring-2 focus:ring-rose-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCw2TDgsMTBMMTIsNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                                    <option>Main Gate</option>
                                    <option>Classroom Block A</option>
                                    <option>Playground</option>
                                    <option>Cafeteria</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Severity
                                </label>
                                <select className="w-full h-12 px-4 pr-10 rounded-xl border border-brand-100 bg-white font-bold text-gray-800 outline-none focus:ring-2 focus:ring-rose-500 appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCw2TDgsMTBMMTIsNiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Location
                            </label>
                            <Input placeholder="e.g. Science Block, Main Entrance" className="h-12 font-bold" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Description</label>
                            <Textarea
                                placeholder="Describe the incident in detail..."
                                className="min-h-[120px] font-medium resize-none"
                                required
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                            <Camera className="w-8 h-8 text-gray-400" />
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Attach Evidence (Photo/Video)</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg rounded-xl shadow-lg shadow-rose-600/30 btn-shine gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging...' : 'Submit Incident Report'}
                            {!isSubmitting && <Save className="w-5 h-5" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
