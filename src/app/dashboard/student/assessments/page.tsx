'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Key,
    Send,
    AlertCircle,
    CheckCircle2,
    Loader2,
    FileText,
    Clock,
    XCircle
} from 'lucide-react';
import { submitAssessment } from '@/actions/submissions';

export default function StudentAssessmentsPage() {
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [mockAssessment, setMockAssessment] = useState<any>(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Mock student ID - in real app from session
    const studentId = 'student-1';

    const handleVerify = () => {
        if (!token) return;
        setLoading(true);
        // Simulate token verification
        setTimeout(() => {
            if (token.toUpperCase() === 'QX47B2') {
                setMockAssessment({
                    id: '1',
                    title: 'Algebra Quiz 1',
                    subject: 'Mathematics',
                    dueDate: 'Tomorrow, 10:00 AM',
                    maxScore: 20
                });
                setVerified(true);
                setStatus(null);
            } else {
                setStatus({ type: 'error', message: 'Invalid token. Please check and try again.' });
            }
            setLoading(false);
        }, 1200);
    };

    const handleSubmit = async () => {
        if (!content) return;
        setLoading(true);
        setStatus(null);

        const result = await submitAssessment({
            studentId,
            token: token.toUpperCase(),
            content
        });

        if (result.success) {
            setStatus({ type: 'success', message: 'Assessment submitted successfully!' });
            // Reset after success
            setTimeout(() => {
                setVerified(false);
                setToken('');
                setContent('');
                setStatus(null);
            }, 3000);
        } else {
            setStatus({ type: 'error', message: result.error || 'Failed to submit.' });
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-brand-700 to-brand-900 bg-clip-text text-transparent">
                    Secure Assessment Entry
                </h1>
                <p className="text-muted-foreground text-lg">
                    Enter your assessment token to access your assignment or test.
                </p>
            </div>

            {!verified ? (
                <Card className="glass border-white/20 shadow-hard overflow-hidden">
                    <CardHeader className="bg-brand-50/50 pb-8 pt-10 text-center">
                        <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <Key className="w-8 h-8 text-brand-600" />
                        </div>
                        <CardTitle className="text-2xl">Access Token Required</CardTitle>
                        <CardDescription>Tokens are provided by your subject teacher.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 pb-10 flex flex-col items-center">
                        <div className="w-full max-w-sm space-y-4">
                            <Input
                                placeholder="e.g. QX47B2"
                                className="h-14 text-center text-2xl font-mono tracking-widest uppercase border-brand-200 focus:ring-brand-500"
                                value={token}
                                onChange={(e) => setToken(e.target.value.toUpperCase())}
                                maxLength={6}
                            />
                            <Button
                                className="w-full h-12 text-base font-semibold gap-2"
                                variant="gradient"
                                onClick={handleVerify}
                                disabled={loading || token.length < 6}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Verify Access
                            </Button>
                            {status?.type === 'error' && (
                                <div className="flex items-center gap-2 text-sm text-destructive justify-center bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-in shake duration-500">
                                    <XCircle className="w-4 h-4" />
                                    {status.message}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                    <Card className="glass border-green-500/20 shadow-hard overflow-hidden">
                        <CardHeader className="bg-green-500/10 border-b border-green-500/10 py-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Token Verified
                                    </div>
                                    <CardTitle className="text-2xl">{mockAssessment.title}</CardTitle>
                                    <CardDescription className="text-green-800/70">{mockAssessment.subject}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                                        <Clock className="w-4 h-4" />
                                        <span>Due: {mockAssessment.dueDate}</span>
                                    </div>
                                    <div className="mt-1 text-sm font-bold text-brand-700">Max Score: {mockAssessment.maxScore}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-brand-600" />
                                    Your Submission Content
                                </label>
                                <textarea
                                    className="w-full min-h-[300px] p-5 glass border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-lg leading-relaxed shadow-inner"
                                    placeholder="Type your response here or paste a link to your document..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white/5 border-t border-white/10 p-6 flex justify-between items-center">
                            <Button variant="ghost" onClick={() => setVerified(false)} className="hover:bg-red-50 text-red-600">Cancel</Button>
                            <div className="flex items-center gap-4">
                                {status?.type === 'success' && (
                                    <span className="text-green-600 font-medium flex items-center gap-2 text-sm animate-in fade-in slide-in-from-right-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {status.message}
                                    </span>
                                )}
                                <Button
                                    variant="gradient"
                                    className="gap-2 px-8"
                                    onClick={handleSubmit}
                                    disabled={loading || !content}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    Finalize Submission
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-brand-500 shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold mb-1">Important Note</p>
                        <p className="text-muted-foreground">Once submitted, assessments cannot be modified without teacher permission.</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex gap-4">
                    <Clock className="w-6 h-6 text-brand-500 shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold mb-1">Time Limits</p>
                        <p className="text-muted-foreground">Submission time is recorded. Late work may attract penalties according to school policy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
