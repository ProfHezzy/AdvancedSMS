import { auth } from '@/auth';
import { Role } from '@prisma/client';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ParentDashboard from '@/components/dashboard/ParentDashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const role = (session.user as any).role as Role;

    const renderDashboard = () => {
        switch (role) {
            case Role.SUPER_ADMIN:
            case Role.ADMIN:
                return <AdminDashboard />;
            case Role.TEACHER:
                return <TeacherDashboard />;
            case Role.STUDENT:
                return <StudentDashboard />;
            case Role.PARENT:
                return <ParentDashboard />;
            default:
                // For HR, ACCOUNTANT, MEDICAL, SECURITY, etc.
                // We'll use a generic staff dashboard or Admin for now
                return <AdminDashboard />;
        }
    };

    return (
        <div className="p-8 space-y-8">
            {renderDashboard()}
        </div>
    );
}
