'use client';

import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { getAdminDashboardStats } from '@/actions/dashboard';
import { useSession } from 'next-auth/react';

export default function AdminOverviewPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            fetchStats();
        }
    }, [session]);

    async function fetchStats() {
        setIsLoading(true);
        const res = await getAdminDashboardStats();
        if (res.success) {
            setStats(res.data);
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <AdminDashboard stats={stats} isLoading={isLoading} />
        </div>
    );
}
