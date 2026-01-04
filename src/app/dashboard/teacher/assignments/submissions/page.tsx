'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    FileText,
    Download,
    CheckCircle2,
    Clock,
    XCircle,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AssignmentSubmissionsPage() {
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const submissions = [
        {
            id: '1',
            student: 'Chioma Adeyemi',
            assignment: 'Algebra Worksheet 1',
            submittedAt: '2026-01-03 14:30',
            status: 'PENDING',
            file: 'algebra_chioma.pdf',
            avatar: 'Chioma'
        },
        {
            id: '2',
            student: 'David Okafor',
            assignment: 'Algebra Worksheet 1',
            submittedAt: '2026-01-03 16:45',
            status: 'GRADED',
            score: 18,
            maxScore: 20,
            feedback: 'Excellent work! Minor error in question 5.',
            file: 'algebra_david.pdf',
            avatar: 'David'
        },
        {
            id: '3',
            student: 'Sarah Ibrahim',
            assignment: 'Algebra Worksheet 1',
            submittedAt: '2026-01-04 09:15',
            status: 'LATE',
            file: 'algebra_sarah.pdf',
            avatar: 'Sarah'
        },
    ];

    const filteredSubmissions = submissions.filter(sub =>
        filterStatus === 'all' || sub.status === filterStatus
    );

    const handleGrade = () => {
        toast.success('Grade submitted successfully!');
        setSelectedSubmission(null);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Assignment Submissions
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Review and grade student assignment submissions.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-blue-600">{submissions.length}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Total</span>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-amber-600">
                            {submissions.filter(s => s.status === 'PENDING').length}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Pending</span>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-green-600">
                            {submissions.filter(s => s.status === 'GRADED').length}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-green-400">Graded</span>
                    </CardContent>
                </Card>
                <Card className="glass border-none shadow-soft">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-black text-rose-600">
                            {submissions.filter(s => s.status === 'LATE').length}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Late</span>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'PENDING', 'GRADED', 'LATE'].map((status) => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'default' : 'outline'}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                            "font-bold",
                            filterStatus === status ? "bg-brand-600 text-white" : "border-gray-200"
                        )}
                    >
                        {status === 'all' ? 'All' : status}
                    </Button>
                ))}
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                    <Card key={submission.id} className="glass border-none shadow-soft hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.avatar}`} />
                                        <AvatarFallback>{submission.student[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{submission.student}</h3>
                                        <p className="text-sm font-medium text-gray-500">{submission.assignment}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge className={cn(
                                                "font-black text-xs",
                                                submission.status === 'GRADED' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                                                    submission.status === 'LATE' ? "bg-rose-100 text-rose-700 hover:bg-rose-100" :
                                                        "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                            )}>
                                                {submission.status}
                                            </Badge>
                                            <span className="text-xs font-medium text-gray-400">
                                                Submitted: {submission.submittedAt}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {submission.status === 'GRADED' && (
                                        <div className="text-right mr-4">
                                            <p className="text-2xl font-black text-green-600">
                                                {submission.score}/{submission.maxScore}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400">Score</p>
                                        </div>
                                    )}
                                    <Button variant="outline" size="sm" className="font-bold border-gray-200">
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                    <Button
                                        onClick={() => setSelectedSubmission(submission)}
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
                                    >
                                        <Eye className="w-4 h-4 mr-2" /> {submission.status === 'GRADED' ? 'View' : 'Grade'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grading Dialog */}
            <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Grade Submission</DialogTitle>
                    </DialogHeader>
                    {selectedSubmission && (
                        <div className="space-y-4 mt-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-sm font-bold text-gray-500">Student</p>
                                <p className="text-lg font-black text-gray-900">{selectedSubmission.student}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1">{selectedSubmission.assignment}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Score</label>
                                <Input
                                    type="number"
                                    placeholder="Enter score (e.g., 18)"
                                    defaultValue={selectedSubmission.score}
                                    className="h-12"
                                />
                                <p className="text-xs font-medium text-gray-400">Maximum score: 20</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Feedback</label>
                                <Textarea
                                    placeholder="Provide feedback to the student..."
                                    defaultValue={selectedSubmission.feedback}
                                    className="min-h-[120px]"
                                />
                            </div>
                            <Button onClick={handleGrade} className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-black">
                                Submit Grade
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
