import { Sidebar } from '@/components/shared/sidebar';
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
            <Sidebar role={role} />
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted/20">
                {children}
            </main>
        </div>
    );
}
