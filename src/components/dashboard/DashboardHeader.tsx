'use client';

import { useSession } from 'next-auth/react';
import {
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { useState, useEffect } from 'react';
import { getUserProfile } from '@/actions/profile';

export function DashboardHeader({ user }: { user?: any }) {
    // const { data: session } = useSession(); // Removed to avoid Context error
    const pathname = usePathname();
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            getUserProfile(user.id).then(res => {
                if (res.success && res.data?.image) {
                    setAvatar(res.data.image);
                }
            });
        }
    }, [user?.id]);

    // Derived page title from path
    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length <= 1) return 'Dashboard';
        const lastSegments = segments[segments.length - 1];
        return lastSegments.charAt(0).toUpperCase() + lastSegments.slice(1).replace(/-/g, ' ');
    };

    // const user = session?.user; // Already passed as prop
    const role = (user as any)?.role || 'User';
    const name = user?.name || (user as any)?.username || user?.email?.split('@')[0] || 'Member';
    const initials = name.split(' ').filter(Boolean).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <header className="h-20 border-b border-brand-100/50 bg-white/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-8 flex-1">
                <div className="hidden lg:block">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">{getPageTitle()}</h2>
                </div>

                <div className="max-w-md w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition-colors" />
                    <Input
                        placeholder="Search anything..."
                        className="h-11 pl-11 bg-brand-50/50 border-transparent focus:bg-white focus:border-brand-200 rounded-xl transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative group rounded-xl hover:bg-brand-50 w-11 h-11">
                    <Bell className="w-5 h-5 text-gray-600 group-hover:text-brand-600" />
                    <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </Button>

                <div className="h-8 w-px bg-brand-100/50 mx-2" />

                <div className="flex items-center gap-4 pl-2 group cursor-pointer">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-black text-gray-900 leading-none mb-1">{name}</p>
                        <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{role}</p>
                    </div>

                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-[2px] shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-brand-700 text-sm overflow-hidden">
                                {avatar ? (
                                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-rose-600 hover:bg-rose-50 w-11 h-11"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
}
