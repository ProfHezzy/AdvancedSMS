'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    ShieldCheck,
    ChevronRight,
    Lock,
    Settings,
    UserCog,
    BadgeCheck
} from 'lucide-react';
import { getAllUsers, updateUserRole } from '@/actions/admin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminUserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setIsLoading(true);
        const res = await getAllUsers();
        if (res.success && res.data) {
            setUsers(res.data);
        }
        setIsLoading(false);
    }

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        toast.promise(updateUserRole(userId, newRole), {
            loading: 'Updating user role...',
            success: 'Role updated successfully!',
            error: 'Failed to update role'
        });
    };

    const filteredUsers = users.filter(u =>
        (filter === 'ALL' || u.role === filter) &&
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Global User Registry
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage institutional accounts, roles, and security permissions.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 font-black shadow-lg shadow-brand-600/20 gap-2">
                    <UserPlus className="w-5 h-5" />
                    Provision Account
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users by name, email or ID..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-brand-100 bg-white shadow-soft font-medium outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap bg-white/50 backdrop-blur p-1 rounded-xl border border-brand-100 shadow-soft gap-1">
                    {['ALL', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'HR', 'MEDICAL', 'SECURITY', 'ACCOUNTANT'].map((r) => (
                        <Button
                            key={r}
                            variant={filter === r ? 'default' : 'ghost'}
                            size="sm"
                            className={cn(
                                "rounded-lg font-bold px-3 h-10 tracking-widest text-[10px]",
                                filter === r && "bg-brand-600 text-white shadow-md hover:bg-brand-700"
                            )}
                            onClick={() => setFilter(r)}
                        >
                            {r}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 rounded-3xl bg-brand-50/50 animate-pulse border border-brand-100" />
                    ))
                ) : (
                    filteredUsers.map((user, idx) => (
                        <Card
                            key={user.id}
                            className="group glass border-none shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-1 overflow-hidden"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 font-black text-xl border border-brand-100 shadow-inner group-hover:rotate-6 transition-transform">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col items-end gap-2 text-right">
                                        <div className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                            user.role === 'ADMIN' ? "bg-purple-100 text-purple-700" :
                                                user.role === 'TEACHER' ? "bg-brand-100 text-brand-700" :
                                                    user.role === 'STUDENT' ? "bg-blue-100 text-blue-700" :
                                                        "bg-amber-100 text-amber-700"
                                        )}>
                                            {user.role}
                                        </div>
                                        <BadgeCheck className="w-5 h-5 text-green-500" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-brand-700 transition-colors">
                                        {user.username}
                                    </h3>
                                    <p className="text-[10px] font-black text-muted-foreground mt-1 uppercase tracking-tighter">
                                        ID: {user.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="py-4 border-t border-brand-50/50 space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                                        <Mail className="w-3.5 h-3.5 text-brand-400" />
                                        {user.username.toLowerCase()}@asms.edu
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                                        <Lock className="w-3.5 h-3.5 text-brand-400" />
                                        Last login: {new Date(user.updatedAt).toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button className="flex-1 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold text-xs gap-2">
                                        <UserCog className="w-4 h-4" />
                                        Edit Permissions
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-10 w-10 border-brand-100 text-brand-400 hover:text-brand-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
