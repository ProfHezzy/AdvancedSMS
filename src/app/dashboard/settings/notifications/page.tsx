'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, Monitor, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationPreferencesPage() {
    const handleSave = () => {
        toast.success('Preferences saved!');
    };

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Preferences
                </h1>
                <p className="text-muted-foreground mt-2 font-medium italic">
                    Control how you receive alerts and customize your dashboard experience.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black uppercase tracking-widest text-brand-700">
                            <Bell className="w-5 h-5" /> Notification Channels
                        </CardTitle>
                        <CardDescription>Choose where you want to be notified.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <Label className="font-bold cursor-pointer" htmlFor="email-notif">Email Notifications</Label>
                            </div>
                            <Switch id="email-notif" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-gray-400" />
                                <Label className="font-bold cursor-pointer" htmlFor="push-notif">Push Notifications</Label>
                            </div>
                            <Switch id="push-notif" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-gray-400" />
                                <Label className="font-bold cursor-pointer" htmlFor="sms-notif">SMS Alerts</Label>
                            </div>
                            <Switch id="sms-notif" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-black uppercase tracking-widest text-brand-700">
                            <Globe className="w-5 h-5" /> System Localization
                        </CardTitle>
                        <CardDescription>Adjust your language and time zone.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold">System Language</Label>
                                <select className="w-full h-11 px-3 rounded-xl border border-brand-100 bg-white font-medium outline-none focus:ring-2 focus:ring-brand-500">
                                    <option>English (US)</option>
                                    <option>English (UK)</option>
                                    <option>French</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Time Zone</Label>
                                <select className="w-full h-11 px-3 rounded-xl border border-brand-100 bg-white font-medium outline-none focus:ring-2 focus:ring-brand-500">
                                    <option>UTC+01:00 (Lagos)</option>
                                    <option>UTC+00:00 (London)</option>
                                    <option>UTC-05:00 (New York)</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end sticky bottom-8 z-10">
                    <Button onClick={handleSave} className="h-14 px-10 bg-brand-600 hover:bg-brand-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-brand-600/30 gap-2 active:scale-95 transition-all">
                        <Save className="w-6 h-6" /> Save Preferences
                    </Button>
                </div>
            </div>
        </div>
    );
}
