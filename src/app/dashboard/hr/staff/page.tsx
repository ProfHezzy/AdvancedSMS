'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Users,
    Search,
    Briefcase,
    MoreHorizontal,
    Mail,
    Phone
} from 'lucide-react';
import { getStaffList } from '@/actions/staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function StaffDirectoryPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        loadStaff();
    }, []);

    async function loadStaff() {
        const res = await getStaffList();
        if (res.success && res.data) {
            setStaff(res.data);
            setFilteredStaff(res.data);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        let result = staff;
        if (search) {
            result = result.filter(s =>
                s.username.toLowerCase().includes(search.toLowerCase()) ||
                s.email?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (roleFilter !== 'ALL') {
            result = result.filter(s => s.role === roleFilter);
        }
        setFilteredStaff(result);
    }, [search, roleFilter, staff]);

    const roles = ['ALL', 'TEACHER', 'HR', 'MEDICAL', 'SECURITY', 'ADMIN'];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Staff Directory
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Manage personnel records and profiles.
                    </p>
                </div>
            </div>

            <Card className="glass border-none shadow-soft">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            className="pl-9 h-12 bg-white/50 border-brand-100 rounded-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {roles.map(role => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                                    roleFilter === role
                                        ? "bg-brand-600 text-white border-brand-600 shadow-md"
                                        : "bg-white text-gray-500 border-gray-100 hover:border-brand-200"
                                )}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(8).fill(0).map((_, i) => (
                        <Card key={i} className="h-64 rounded-3xl bg-gray-50 animate-pulse border-none" />
                    ))
                ) : filteredStaff.length > 0 ? (
                    filteredStaff.map((person) => (
                        <Card key={person.id} className="glass border-none shadow-soft hover:shadow-medium transition-all group overflow-hidden">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="w-full flex justify-end">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-brand-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                                    <AvatarImage src={person.image} />
                                    <AvatarFallback className="bg-gradient-to-br from-brand-100 to-indigo-100 text-brand-700 text-2xl font-black">
                                        {(person.name || person.username).charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <h3 className="text-lg font-black text-gray-900 truncate max-w-[200px]">
                                        {person.name || person.username}
                                    </h3>
                                    <Badge variant="secondary" className="mt-2 bg-brand-50 text-brand-700 hover:bg-brand-100 border-brand-100 font-bold">
                                        {person.role}
                                    </Badge>
                                </div>

                                <div className="w-full pt-4 border-t border-brand-50 flex justify-center gap-4">
                                    <Button variant="ghost" size="icon" className="rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100">
                                        <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full bg-green-50 text-green-600 hover:bg-green-100">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100">
                                        <Briefcase className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                        <Users className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-medium">No staff members found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
