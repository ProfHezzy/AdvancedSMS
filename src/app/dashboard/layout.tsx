import { Sidebar } from '@/components/shared/sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const role = (session.user as any).role;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar role={role} user={session.user} />
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted/20 flex flex-col">
                <DashboardHeader user={session.user} />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
