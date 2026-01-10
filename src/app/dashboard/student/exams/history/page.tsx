'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getStudentProfile } from '@/actions/academic';
import { getStudentSubmittedAssessments } from '@/actions/student-assessments';
import StudentAssessmentList from '@/components/dashboard/StudentAssessmentList';

export default function ExamHistoryPage() {
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
            const res = await getStudentSubmittedAssessments(profileRes.data.id, 'EXAM');
            if (res.success && res.data) {
                setData(res.data);
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="p-8">
            <StudentAssessmentList
                title="Exam History"
                description="Your historical record of institutional examinations. Track your growth across terms."
                assessments={data}
                isLoading={isLoading}
                type="EXAM"
                emptyMessage="No examinations recorded in your history."
            />
        </div>
    );
}
