'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Bell,
    Mail,
    Smartphone,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState({
        email: {
            assignments: true,
            results: true,
            messages: true,
            announcements: false,
            systemAlerts: true
        },
        push: {
            assignments: true,
            results: true,
            messages: true,
            announcements: true,
            systemAlerts: true
        },
        inApp: {
            assignments: true,
            results: true,
            messages: true,
            announcements: true,
            systemAlerts: true
        }
    });

    const togglePreference = (channel: 'email' | 'push' | 'inApp', category: string) => {
        setPreferences(prev => ({
            ...prev,
            [channel]: {
                ...prev[channel],
                [category]: !prev[channel][category as keyof typeof prev.email]
            }
        }));
    };

    const handleSave = () => {
        toast.success('Notification preferences saved!');
    };

    const categories = [
        { key: 'assignments', label: 'Assignments & Tests', description: 'New assignments, submissions, and grading updates' },
        { key: 'results', label: 'Results & Performance', description: 'Result compilation, grade releases, and analytics' },
        { key: 'messages', label: 'Messages', description: 'Direct messages from parents and students' },
        { key: 'announcements', label: 'Announcements', description: 'School-wide notices and updates' },
        { key: 'systemAlerts', label: 'System Alerts', description: 'Security alerts and system notifications' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Notification Preferences
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Customize how you receive notifications across different channels.
                </p>
            </div>

            <Card className="glass border-none shadow-soft overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left p-4 font-black uppercase tracking-widest text-xs text-gray-500">
                                        Notification Type
                                    </th>
                                    <th className="text-center p-4 font-black uppercase tracking-widest text-xs text-gray-500">
                                        <div className="flex flex-col items-center gap-1">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                            Email
                                        </div>
                                    </th>
                                    <th className="text-center p-4 font-black uppercase tracking-widest text-xs text-gray-500">
                                        <div className="flex flex-col items-center gap-1">
                                            <Smartphone className="w-5 h-5 text-green-600" />
                                            Push
                                        </div>
                                    </th>
                                    <th className="text-center p-4 font-black uppercase tracking-widest text-xs text-gray-500">
                                        <div className="flex flex-col items-center gap-1">
                                            <Bell className="w-5 h-5 text-purple-600" />
                                            In-App
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category.key} className={cn(
                                        "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                    )}>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-bold text-gray-900">{category.label}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-1">{category.description}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => togglePreference('email', category.key)}
                                                className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative",
                                                    preferences.email[category.key as keyof typeof preferences.email] ? "bg-blue-600" : "bg-gray-200"
                                                )}
                                            >
                                                <span className={cn(
                                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                                                    preferences.email[category.key as keyof typeof preferences.email] ? "right-1" : "left-1"
                                                )} />
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => togglePreference('push', category.key)}
                                                className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative",
                                                    preferences.push[category.key as keyof typeof preferences.push] ? "bg-green-600" : "bg-gray-200"
                                                )}
                                            >
                                                <span className={cn(
                                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                                                    preferences.push[category.key as keyof typeof preferences.push] ? "right-1" : "left-1"
                                                )} />
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => togglePreference('inApp', category.key)}
                                                className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative",
                                                    preferences.inApp[category.key as keyof typeof preferences.inApp] ? "bg-purple-600" : "bg-gray-200"
                                                )}
                                            >
                                                <span className={cn(
                                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                                                    preferences.inApp[category.key as keyof typeof preferences.inApp] ? "right-1" : "left-1"
                                                )} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="h-14 px-8 bg-brand-600 hover:bg-brand-700 text-white font-black text-lg rounded-xl shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                >
                    <Save className="w-5 h-5" /> Save Preferences
                </Button>
            </div>
        </div>
    );
}
