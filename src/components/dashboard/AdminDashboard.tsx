import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, Building2, TrendingUp, ShieldCheck, Activity, Loader2 } from 'lucide-react';

export default function AdminDashboard({ stats: dynamicStats, isLoading }: { stats?: any, isLoading?: boolean }) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
            </div>
        );
    }

    const stats = [
        {
            title: 'Institutional Size',
            value: dynamicStats?.institutionalSize?.toLocaleString() || '0',
            change: 'Total students',
            icon: Building2,
            color: 'from-blue-600 to-indigo-600',
        },
        {
            title: 'Staff Count',
            value: dynamicStats?.staffCount?.toLocaleString() || '0',
            change: 'Teachers & Support',
            icon: UserCog,
            color: 'from-purple-600 to-fuchsia-600',
        },
        {
            title: 'Financial Health',
            value: `${dynamicStats?.financialHealth || 0}%`,
            change: 'Fee collection rate',
            icon: TrendingUp,
            color: 'from-emerald-600 to-teal-600',
        },
        {
            title: 'System Security',
            value: dynamicStats?.activeIncidents === 0 ? 'Active' : 'Warning',
            change: `${dynamicStats?.activeIncidents || 0} incidents today`,
            icon: ShieldCheck,
            color: 'from-rose-600 to-orange-600',
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                        Administrator Central
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Comprehensive overview of school operations and institutional performance.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 shadow-sm glass">
                    <Activity className="w-4 h-4 text-brand-600 animate-pulse" />
                    <span className="text-xs font-bold text-brand-900 tracking-wider uppercase">System Live</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={stat.title}
                            className="overflow-hidden animate-scale-in border-none shadow-soft hover:shadow-medium transition-all duration-300 glass group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                                <p className="text-xs text-brand-600 font-semibold mt-1">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle>Institutional Analytics</CardTitle>
                        <CardDescription>Performance trends across all departments</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t border-gray-100 mt-4">
                        <div className="text-center group cursor-pointer">
                            <TrendingUp className="w-12 h-12 text-brand-200 mx-auto group-hover:text-brand-500 transition-colors" />
                            <p className="text-sm text-muted-foreground mt-2">Chart integration pending (Phase 2)</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none shadow-soft">
                    <CardHeader>
                        <CardTitle>System Audit Log</CardTitle>
                        <CardDescription>Recent critical actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { action: 'Teacher added', user: 'Admin 01', time: '10m ago', icon: ShieldCheck },
                            { action: 'Exam results released', user: 'Principal', time: '1h ago', icon: Activity },
                            { action: 'Wallet reconciliation', user: 'Finance', time: '3h ago', icon: TrendingUp },
                            { action: 'New session created', user: 'Super Admin', time: '5h ago', icon: Building2 },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-all border border-transparent hover:border-brand-100">
                                <div className="p-2 rounded-md bg-brand-50 text-brand-600">
                                    <log.icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-800">{log.action}</p>
                                    <p className="text-[10px] text-muted-foreground">by {log.user}</p>
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">{log.time}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
