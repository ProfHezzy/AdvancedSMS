'use client';

import { useState, useEffect } from 'react';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import { getTeacherDashboardStats } from '@/actions/dashboard';
import { useSession } from 'next-auth/react';

export default function TeacherOverviewPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchStats();
        }
    }, [session]);

    async function fetchStats() {
        setIsLoading(true);
        const userId = (session?.user as any).id;
        const res = await getTeacherDashboardStats(userId);
        if (res.success) {
            setStats(res.data);
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <TeacherDashboard stats={stats} isLoading={isLoading} />
        </div>
    );
}
