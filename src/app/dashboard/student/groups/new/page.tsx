'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Users,
    Save,
    ArrowLeft,
    BookOpen,
    Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateGroupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'ACADEMIC',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Group created successfully!');
        router.push('/dashboard/student/groups');
        setIsLoading(false);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/student/groups">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        New Group
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Start a new community.
                    </p>
                </div>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Group Name</label>
                            <Input
                                placeholder="e.g. Robotics Club"
                                className="h-12 text-lg font-bold bg-white/50 border-brand-100 focus:border-brand-500 focus:ring-brand-500/20"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Category</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['ACADEMIC', 'SPORT', 'STUDY'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${formData.type === type
                                                ? 'border-brand-600 bg-brand-50 text-brand-700'
                                                : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            }`}
                                    >
                                        {type === 'ACADEMIC' && <BookOpen className="w-6 h-6" />}
                                        {type === 'SPORT' && <Trophy className="w-6 h-6" />}
                                        {type === 'STUDY' && <Users className="w-6 h-6" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Description</label>
                            <Textarea
                                placeholder="What is this group about?"
                                className="min-h-[120px] bg-white/50 border-brand-100 focus:border-brand-500 focus:ring-brand-500/20 font-medium"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                className="h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl shadow-lg btn-shine"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Group'}
                                {!isLoading && <Save className="ml-2 w-4 h-4" />}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
