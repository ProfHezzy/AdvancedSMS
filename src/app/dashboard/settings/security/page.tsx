'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, Fingerprint, ShieldAlert, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SecuritySettingsPage() {
    const handleSave = () => {
        toast.success('Security settings updated!');
    };

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Security Settings
                </h1>
                <p className="text-muted-foreground mt-2 font-medium italic">
                    Configure your account's authentication and protection preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black uppercase tracking-widest text-brand-700">
                            <Lock className="w-5 h-5" /> Change Password
                        </CardTitle>
                        <CardDescription>Update your password to stay secure.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="font-bold">Current Password</Label>
                                <Input type="password" placeholder="••••••••" className="rounded-xl border-brand-100" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-xl border-brand-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold">Confirm New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-xl border-brand-100" />
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleSave} className="bg-brand-600 hover:bg-brand-700 text-white font-black px-8 rounded-xl h-11">
                            Update Password
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black uppercase tracking-widest text-brand-700">
                            <ShieldCheck className="w-5 h-5" /> Two-Factor Authentication
                        </CardTitle>
                        <CardDescription>Add an extra layer of security to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-50/50 border border-brand-100/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-brand-600">
                                    <Fingerprint className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-sm">Authenticator App</p>
                                    <p className="text-xs text-muted-foreground font-medium italic">Use an app like Google Authenticator.</p>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl border-brand-200 text-brand-700 font-bold">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-50/50 border border-brand-100/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-brand-600">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-sm">Backup Codes</p>
                                    <p className="text-xs text-muted-foreground font-medium italic">Emergency access when you lose 2FA device.</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="rounded-xl text-brand-600 font-bold hover:bg-brand-100">Setup Codes</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
