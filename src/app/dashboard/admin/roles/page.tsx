'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Shield,
    Users,
    Search,
    CheckCircle2,
    AlertTriangle,
    Save
} from 'lucide-react';
import { getAllUsers, updateUserRole } from '@/actions/admin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function AdminRolesPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setIsLoading(true);
        const res = await getAllUsers();
        if (res.success && res.data) {
            setUsers(res.data);
            setFilteredUsers(res.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (searchTerm) {
            setFilteredUsers(users.filter(u =>
                u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const handleRoleChange = (userId: string, newRole: string) => {
        setPendingChanges(prev => ({ ...prev, [userId]: newRole }));
    };

    const saveChanges = async () => {
        const updates = Object.entries(pendingChanges);
        if (updates.length === 0) return;

        toast.promise(
            Promise.all(updates.map(([id, role]) => updateUserRole(id, role))),
            {
                loading: 'Updating roles...',
                success: () => {
                    setPendingChanges({});
                    fetchUsers();
                    return 'Roles updated successfully';
                },
                error: 'Failed to update roles'
            }
        );
    };

    const roles = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'HR', 'MEDICAL', 'SECURITY'];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Role Management
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Assign and audit user roles across the platform.
                    </p>
                </div>
                {Object.keys(pendingChanges).length > 0 && (
                    <Button
                        onClick={saveChanges}
                        className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg animate-pulse gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save {Object.keys(pendingChanges).length} Changes
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                        <CardContent className="p-6">
                            <Shield className="w-12 h-12 mb-4 opacity-80" />
                            <h3 className="text-2xl font-black">{users.length}</h3>
                            <p className="text-indigo-100 font-medium">Total Active Users</p>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-soft">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black text-gray-500 uppercase tracking-widest">Role Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roles.map(role => {
                                const count = users.filter(u => u.role === role).length;
                                const pct = (count / users.length) * 100 || 0;
                                return (
                                    <div key={role}>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>{role}</span>
                                            <span>{count}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* User List */}
                <div className="lg:col-span-3">
                    <Card className="glass border-none shadow-soft min-h-[600px]">
                        <CardHeader className="border-b border-brand-50 pb-4">
                            <div className="flex items-center gap-4">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="bg-transparent outline-none flex-1 font-medium placeholder:text-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-12 space-y-4">
                                    {Array(5).fill(0).map((_, i) => (
                                        <div key={i} className="h-16 rounded-xl bg-brand-50/50 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="divide-y divide-brand-50">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="p-4 flex items-center justify-between hover:bg-brand-50/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-black text-brand-700">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.username}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {pendingChanges[user.id] && (
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                    {roles.map(role => (
                                                        <button
                                                            key={role}
                                                            onClick={() => handleRoleChange(user.id, role)}
                                                            className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                                                (pendingChanges[user.id] || user.role) === role
                                                                    ? "bg-brand-600 text-white border-brand-600 shadow-md"
                                                                    : "bg-white text-gray-400 border-gray-100 hover:border-brand-200"
                                                            )}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
