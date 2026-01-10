import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { generateReportCard, downloadReportCard } from '@/lib/report-generator';
import { useState } from 'react';
import { toast } from 'sonner';

interface ReportCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studentData: {
        name: string;
        class: string;
        term: string;
        session: string;
        results: Array<{
            subject: string;
            caScore: number;
            examScore: number;
            total: number;
            grade: string;
            remark: string;
        }>;
        cgpa: number;
        position: number;
        totalStudents: number;
        attendance: string;
        teacherRemark?: string;
        principalRemark?: string;
    };
}

export function ReportCardDialog({ open, onOpenChange, studentData }: ReportCardDialogProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const pdfBlob = await generateReportCard(studentData);
            downloadReportCard(pdfBlob, studentData.name, studentData.term);
            toast.success('Report card downloaded successfully!');
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to generate report card:', error);
            toast.error('Failed to generate report card');
        }
        setIsGenerating(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-black text-2xl flex items-center gap-2">
                        <FileText className="w-6 h-6 text-brand-600" />
                        Download Report Card
                    </DialogTitle>
                    <DialogDescription>
                        Generate and download {studentData.name}'s report card for {studentData.term}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="p-4 rounded-xl bg-brand-50/50 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-600">Student:</span>
                            <span className="font-black text-gray-900">{studentData.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-600">Class:</span>
                            <span className="font-black text-gray-900">{studentData.class}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-600">Term:</span>
                            <span className="font-black text-gray-900">{studentData.term}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-600">CGPA:</span>
                            <span className="font-black text-brand-600">{studentData.cgpa.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-600">Position:</span>
                            <span className="font-black text-gray-900">{studentData.position}/{studentData.totalStudents}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full h-12 bg-brand-600 hover:bg-brand-700 font-bold rounded-xl gap-2"
                    >
                        {isGenerating ? (
                            <>Generating PDF...</>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download Report Card (PDF)
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        The report card will include all subjects, grades, remarks, and attendance information
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
