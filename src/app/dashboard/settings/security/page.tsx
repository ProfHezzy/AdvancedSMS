'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Shield,
    Lock,
    Smartphone,
    Monitor,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SecurityPage() {
    const sessions = [
        {
            id: '1',
            device: 'Windows PC - Chrome',
            location: 'Lagos, Nigeria',
            lastActive: '2 minutes ago',
            current: true
        },
        {
            id: '2',
            device: 'iPhone 13 - Safari',
            location: 'Lagos, Nigeria',
            lastActive: '2 days ago',
            current: false
        },
    ];

    const loginHistory = [
        { id: '1', time: '2026-01-04 08:30', location: 'Lagos, Nigeria', device: 'Windows PC', status: 'SUCCESS' },
        { id: '2', time: '2026-01-03 08:15', location: 'Lagos, Nigeria', device: 'Windows PC', status: 'SUCCESS' },
        { id: '3', time: '2026-01-02 14:20', location: 'Unknown Location', device: 'Android', status: 'FAILED' },
    ];

    const handleChangePassword = () => {
        toast.success('Password changed successfully!');
    };

    const handleEnable2FA = () => {
        toast.success('Two-factor authentication enabled!');
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-4xl mx-auto">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Security Settings
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Manage your account security and privacy.
                </p>
            </div>

            {/* Change Password */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                        <Lock className="w-5 h-5 text-brand-600" /> Change Password
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Current Password</Label>
                        <Input type="password" placeholder="Enter current password" className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">New Password</Label>
                        <Input type="password" placeholder="Enter new password" className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Confirm New Password</Label>
                        <Input type="password" placeholder="Confirm new password" className="h-12" />
                    </div>
                    <Button
                        onClick={handleChangePassword}
                        className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-black"
                    >
                        Update Password
                    </Button>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                        <Smartphone className="w-5 h-5 text-brand-600" /> Two-Factor Authentication
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <p className="font-bold text-gray-900">2FA Status</p>
                            <p className="text-sm text-gray-500 font-medium">Add an extra layer of security to your account</p>
                        </div>
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 font-black">
                            Disabled
                        </Badge>
                    </div>
                    <Button
                        onClick={handleEnable2FA}
                        variant="outline"
                        className="w-full h-12 border-brand-200 text-brand-700 hover:bg-brand-50 font-bold"
                    >
                        Enable Two-Factor Authentication
                    </Button>
                </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                        <Monitor className="w-5 h-5 text-brand-600" /> Active Sessions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {sessions.map((session) => (
                        <div key={session.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{session.device}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1 font-medium">
                                            <MapPin className="w-3 h-3" /> {session.location}
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <Clock className="w-3 h-3" /> {session.lastActive}
                                        </span>
                                    </div>
                                    {session.current && (
                                        <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100 text-xs font-black">
                                            Current Session
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {!session.current && (
                                <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold">
                                    Revoke
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Login History */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-black text-gray-800 uppercase tracking-widest">
                        <Shield className="w-5 h-5 text-brand-600" /> Login History
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {loginHistory.map((login) => (
                        <div key={login.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {login.status === 'SUCCESS' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-rose-600" />
                                )}
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{login.time}</p>
                                    <p className="text-xs text-gray-500 font-medium">{login.device} • {login.location}</p>
                                </div>
                            </div>
                            <Badge className={login.status === 'SUCCESS' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-rose-100 text-rose-700 hover:bg-rose-100"}>
                                {login.status}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
