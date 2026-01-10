'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getStudentProfile } from '@/actions/academic';
import { getStudentAvailableAssessments } from '@/actions/student-assessments';
import StudentAssessmentList from '@/components/dashboard/StudentAssessmentList';

export default function AttemptExamsPage() {
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
            const res = await getStudentAvailableAssessments(profileRes.data.id, 'EXAM');
            if (res.success && res.data) {
                setData(res.data);
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <StudentAssessmentList
                title="Available Examinations"
                description="Secure portal for institutional exams. Ensure you have your access tokens ready."
                assessments={data}
                isLoading={isLoading}
                type="EXAM"
                emptyMessage="No exams are currently active."
            />
        </div>
    );
}
