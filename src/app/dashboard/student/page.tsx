'use client';

import { useState, useEffect } from 'react';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { getStudentDashboardStats } from '@/actions/dashboard';
import { useSession } from 'next-auth/react';

export default function StudentOverviewPage() {
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
        const res = await getStudentDashboardStats(userId);
        if (res.success) {
            setStats(res.data);
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <StudentDashboard stats={stats} isLoading={isLoading} />
            </div>
        </div>
    );
}
