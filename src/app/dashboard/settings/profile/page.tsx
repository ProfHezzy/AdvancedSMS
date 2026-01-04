'use client';

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
    Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
    const handleSave = () => {
        toast.success('Profile updated successfully!');
    };

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
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher" />
                        <AvatarFallback className="text-3xl font-black">T</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-3">
                            Upload a new profile picture. Recommended size: 400x400px
                        </p>
                        <Button variant="outline" className="font-bold border-brand-200 text-brand-700 gap-2">
                            <Upload className="w-4 h-4" /> Upload Photo
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 font-bold text-gray-700">
                                <User className="w-4 h-4" /> First Name
                            </Label>
                            <Input defaultValue="John" className="h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 font-bold text-gray-700">
                                <User className="w-4 h-4" /> Last Name
                            </Label>
                            <Input defaultValue="Doe" className="h-12" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-bold text-gray-700">
                            <Mail className="w-4 h-4" /> Email Address
                        </Label>
                        <Input type="email" defaultValue="teacher@school.com" className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-bold text-gray-700">
                            <Phone className="w-4 h-4" /> Phone Number
                        </Label>
                        <Input type="tel" defaultValue="+234 801 234 5678" className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 font-bold text-gray-700">
                            <MapPin className="w-4 h-4" /> Address
                        </Label>
                        <Textarea defaultValue="123 School Street, Lagos, Nigeria" className="min-h-[80px]" />
                    </div>
                </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="font-black text-gray-800 uppercase tracking-widest">Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-gray-700">Staff ID</Label>
                            <Input defaultValue="TCH-2025-001" disabled className="h-12 bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-gray-700">Department</Label>
                            <Input defaultValue="Mathematics" disabled className="h-12 bg-gray-50" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Qualifications</Label>
                        <Input defaultValue="B.Sc. Mathematics, M.Ed. Education" className="h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-gray-700">Bio</Label>
                        <Textarea
                            placeholder="Tell us about yourself..."
                            defaultValue="Passionate mathematics teacher with 10+ years of experience in secondary education."
                            className="min-h-[120px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    className="h-14 px-8 bg-brand-600 hover:bg-brand-700 text-white font-black text-lg rounded-xl shadow-lg shadow-brand-600/20 gap-2 btn-shine"
                >
                    <Save className="w-5 h-5" /> Save Changes
                </Button>
            </div>
        </div>
    );
}
