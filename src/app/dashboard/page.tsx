import { auth } from '@/auth';
import { Role } from '@prisma/client';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import ParentDashboard from '@/components/dashboard/ParentDashboard';
import FinanceDashboard from '@/components/dashboard/FinanceDashboard';
import { redirect } from 'next/navigation';
import HRDashboardPage from './hr/page';
import MedicalDashboardPage from './medical/page';
import SecurityDashboardPage from './security/page';

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
            case Role.HR:
                return <HRDashboardPage />;
            case Role.MEDICAL:
                return <MedicalDashboardPage />;
            case Role.SECURITY:
                return <SecurityDashboardPage />;
            case Role.ACCOUNTANT:
                return <FinanceDashboard />;
            default:
                return (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold">Unauthorized Access</h2>
                        <p className="text-muted-foreground">Your role does not have a dashboard assigned.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-8 space-y-8">
            {renderDashboard()}
        </div>
    );
}
