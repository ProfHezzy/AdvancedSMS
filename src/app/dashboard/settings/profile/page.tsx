'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Upload,
    Save,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserProfile, updateProfile } from '@/actions/profile';

export default function ProfilePage() {
    const { data: session, update: updateSession } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        image: '',
        phone: '', // These might need mapping to specific profile models later
        address: '',
        bio: ''
    });

    useEffect(() => {
        if (session?.user?.id) {
            fetchProfile();
        }
    }, [session]);

    async function fetchProfile() {
        setIsLoading(true);
        const res = await getUserProfile((session?.user as any).id);
        if (res.success && res.data) {
            setForm({
                name: res.data.name || res.data.username || '',
                email: res.data.email || '',
                image: res.data.image || '',
                phone: '', // Mock for now as it's in sub-profiles
                address: '',
                bio: ''
            });
        }
        setIsLoading(false);
    }

    const handleSave = async () => {
        if (!session?.user?.id) return;
        setIsSaving(true);
        const res = await updateProfile((session.user as any).id, {
            name: form.name,
            email: form.email,
            image: form.image
        });

        if (res.success) {
            toast.success('Profile updated successfully!');
            await updateSession(); // Triggers server-side re-fetch in jwt callback
        } else {
            toast.error(res.error);
        }
        setIsSaving(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB limit for base64
            toast.error('Image too large. Please use a file under 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm(prev => ({ ...prev, image: reader.result as string }));
            toast.success('Preview updated. Don\'t forget to Save!');
        };
        reader.readAsDataURL(file);
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-4xl mx-auto">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    Profile Settings
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Manage your personal information and preferences.
                </p>
            </div>

            {/* Avatar Section */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="font-black text-gray-800 uppercase tracking-widest">Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg overflow-hidden relative group">
                        {form.image ? (
                            <img src={form.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <AvatarFallback className="text-3xl font-black bg-brand-50 text-brand-700">
                                {form.name ? form.name[0].toUpperCase() : 'U'}
                            </AvatarFallback>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-3">
                            Upload a new profile picture. Recommended size: 400x400px.
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <Button
                            variant="outline"
                            className="font-bold border-brand-200 text-brand-700 gap-2 rounded-xl"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4" /> Change Photo
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="font-black text-gray-800 uppercase tracking-widest">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-bold text-gray-700">
                            <User className="w-4 h-4 text-brand-600" /> Full Display Name
                        </Label>
                        <Input
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="h-12 rounded-xl border-brand-100 text-gray-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-bold text-gray-700">
                            <Mail className="w-4 h-4 text-brand-600" /> Email Address
                        </Label>
                        <Input
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="h-12 rounded-xl bg-white border-brand-100 text-gray-900"
                        />
                        <p className="text-[10px] text-muted-foreground font-bold italic">Email is required for notifications and payments.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end sticky bottom-8 z-10">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-10 bg-brand-600 hover:bg-brand-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-brand-600/30 gap-3 group active:scale-95 transition-all"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Synchronize Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
