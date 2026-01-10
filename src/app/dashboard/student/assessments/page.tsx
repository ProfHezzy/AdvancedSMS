'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
    Trophy,
    Key
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validateAssessmentToken } from '@/actions/assessments';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StudentAssessmentsPage() {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const handleTokenSubmit = async () => {
        if (!token.trim()) {
            toast.error('Please enter an assessment token');
            return;
        }

        setIsValidating(true);
        const res = await validateAssessmentToken(token.toUpperCase());

        if (res.success) {
            toast.success('Token validated! Redirecting...');
            router.push(`/dashboard/student/assessments/attempt/${token.toUpperCase()}`);
        } else {
            toast.error(res.error || 'Invalid token');
        }
        setIsValidating(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Assessments
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Access assignments, tests, and exams using tokens provided by your teachers.
                </p>
            </div>

            {/* Token Entry Card */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                        <Key className="w-5 h-5 text-brand-600" />
                        Enter Assessment Token
                    </CardTitle>
                    <CardDescription>
                        Enter the token provided by your teacher to access an assessment
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3">
                        <Input
                            placeholder="e.g., ASG-A7K2M9"
                            value={token}
                            onChange={(e) => setToken(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
                            className="h-12 rounded-xl border-brand-100 font-mono text-lg uppercase"
                            maxLength={10}
                        />
                        <Button
                            onClick={handleTokenSubmit}
                            disabled={isValidating}
                            className="h-12 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold gap-2"
                        >
                            {isValidating ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Access
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-brand-50/50 p-3 rounded-lg">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>
                            Tokens are case-insensitive and follow the format: TYPE-XXXXXX (e.g., ASG-A7K2M9 for assignments, TST-B3N8P1 for tests)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Assessment Types Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-none shadow-soft hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800 uppercase tracking-wide">Assignments</h3>
                                <p className="text-sm text-muted-foreground">Token prefix: ASG-</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800 uppercase tracking-wide">Tests</h3>
                                <p className="text-sm text-muted-foreground">Token prefix: TST-</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-800 uppercase tracking-wide">Exams</h3>
                                <p className="text-sm text-muted-foreground">Token prefix: EXM-</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Instructions */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="font-black text-gray-800 uppercase tracking-widest">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-700 text-sm flex-shrink-0">
                            1
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Get Token from Teacher</h4>
                            <p className="text-sm text-muted-foreground">Your teacher will provide you with a unique token for each assessment</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-700 text-sm flex-shrink-0">
                            2
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Enter Token Above</h4>
                            <p className="text-sm text-muted-foreground">Type or paste the token in the input field and click "Access"</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-700 text-sm flex-shrink-0">
                            3
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Complete Assessment</h4>
                            <p className="text-sm text-muted-foreground">Answer all questions and submit before the due date</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-700 text-sm flex-shrink-0">
                            4
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">View Results</h4>
                            <p className="text-sm text-muted-foreground">Check your score and feedback after grading is complete</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
