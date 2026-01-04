'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Key,
    QrCode,
    Copy,
    CheckCircle2,
    Clock,
    Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ExamTokensPage() {
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);

    const tokenHistory = [
        {
            id: '1',
            exam: 'First Term Mathematics Exam',
            token: 'MATH-2026-A1B2C3',
            generatedAt: '2026-01-02 08:00',
            expiresAt: '2026-01-02 12:00',
            status: 'EXPIRED',
            usedBy: 35
        },
        {
            id: '2',
            exam: 'Mid-Term Physics Test',
            token: 'PHYS-2026-D4E5F6',
            generatedAt: '2026-01-05 09:00',
            expiresAt: '2026-01-05 11:00',
            status: 'ACTIVE',
            usedBy: 12
        },
    ];

    const handleGenerateToken = () => {
        const newToken = `EXAM-${Date.now().toString(36).toUpperCase()}`;
        setGeneratedToken(newToken);
        toast.success('Exam token generated successfully!');
    };

    const handleCopyToken = () => {
        if (generatedToken) {
            navigator.clipboard.writeText(generatedToken);
            toast.success('Token copied to clipboard!');
        }
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Exam Token Generator
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Generate secure access tokens for online examinations.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Token Generator */}
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                            <Key className="w-5 h-5 text-brand-600" /> Generate New Token
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Exam Name</Label>
                            <Input placeholder="e.g., First Term Mathematics Exam" className="h-12" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Valid From</Label>
                                <Input type="datetime-local" className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Expires At</Label>
                                <Input type="datetime-local" className="h-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Maximum Uses</Label>
                            <Input type="number" placeholder="e.g., 50" defaultValue="50" className="h-12" />
                        </div>
                        <Button
                            onClick={handleGenerateToken}
                            className="w-full h-14 bg-brand-600 hover:bg-brand-700 text-white font-black text-lg rounded-xl shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                        >
                            <Shield className="w-5 h-5" /> Generate Secure Token
                        </Button>

                        {generatedToken && (
                            <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black uppercase tracking-widest text-green-700">Generated Token</p>
                                    <Badge className="bg-green-600 text-white hover:bg-green-600">Active</Badge>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-green-200">
                                    <p className="text-2xl font-black text-gray-900 text-center tracking-wider">
                                        {generatedToken}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCopyToken}
                                        variant="outline"
                                        className="flex-1 h-12 border-green-300 text-green-700 hover:bg-green-50 font-bold gap-2"
                                    >
                                        <Copy className="w-4 h-4" /> Copy Token
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 border-green-300 text-green-700 hover:bg-green-50 font-bold gap-2"
                                    >
                                        <QrCode className="w-4 h-4" /> Show QR Code
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Token History */}
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                            <Clock className="w-5 h-5 text-brand-600" /> Token History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tokenHistory.map((token) => (
                            <div key={token.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900">{token.exam}</h4>
                                        <p className="text-xs font-medium text-gray-400 mt-1">
                                            Generated: {token.generatedAt}
                                        </p>
                                    </div>
                                    <Badge className={cn(
                                        "font-black text-xs",
                                        token.status === 'ACTIVE' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                                    )}>
                                        {token.status}
                                    </Badge>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-lg font-black text-gray-900 tracking-wider text-center">
                                        {token.token}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-white p-2 rounded-lg border border-gray-100 text-center">
                                        <p className="font-bold text-gray-400">Expires</p>
                                        <p className="font-black text-gray-900">{token.expiresAt}</p>
                                    </div>
                                    <div className="bg-white p-2 rounded-lg border border-gray-100 text-center">
                                        <p className="font-bold text-gray-400">Used By</p>
                                        <p className="font-black text-gray-900">{token.usedBy} Students</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
