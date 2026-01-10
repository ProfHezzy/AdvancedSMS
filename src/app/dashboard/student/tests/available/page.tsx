'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getStudentProfile } from '@/actions/academic';
import { getStudentAvailableAssessments } from '@/actions/student-assessments';
import StudentAssessmentList from '@/components/dashboard/StudentAssessmentList';

export default function AvailableTestsPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            fetchData();
        }
    }, [session]);

    async function fetchData() {
        setIsLoading(true);
        const profileRes = await getStudentProfile((session?.user as any).id);
        if (profileRes.success && profileRes.data) {
            const res = await getStudentAvailableAssessments(profileRes.data.id, 'TEST');
            if (res.success && res.data) {
                setData(res.data);
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <StudentAssessmentList
                title="Available Tests"
                description="Upcoming class tests and assessments. Prepare well and track your progress."
                assessments={data}
                isLoading={isLoading}
                type="TEST"
                emptyMessage="No tests scheduled at the moment."
            />
        </div>
    );
}
