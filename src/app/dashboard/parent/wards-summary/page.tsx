'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    GraduationCap,
    ArrowRight,
    Bell,
    Wallet,
    FileText,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ParentWardsSummaryPage() {
    const wards = [
        {
            id: 'STU-001',
            name: 'Chioma Adeyemi',
            class: 'JSS 1 A',
            status: 'Active',
            attendance: '98%',
            gpa: '4.82',
            fees: 'Paid',
            image: 'Chioma'
        },
        {
            id: 'STU-002',
            name: 'Emeka Adeyemi',
            class: 'Basic 4',
            status: 'Active',
            attendance: '95%',
            gpa: 'Outstanding',
            fees: 'Due',
            image: 'Emeka'
        }
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        My Wards
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Overview of your children's academic status.
                    </p>
                </div>
                <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2 btn-shine">
                    <Wallet className="w-5 h-5" /> Pay School Fees
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {wards.map((ward) => (
                    <Card key={ward.id} className="group glass border-none shadow-soft overflow-hidden hover:shadow-lg transition-all">
                        <div className="h-32 bg-gradient-to-r from-brand-500 to-purple-600 relative">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <Badge className={cn(
                                "absolute top-4 right-4 font-black tracking-widest",
                                ward.fees === 'Paid' ? "bg-green-400 text-green-900" : "bg-amber-400 text-amber-900"
                            )}>
                                Fees: {ward.fees}
                            </Badge>
                        </div>
                        <CardContent className="pt-0 relative">
                            <div className="flex justify-between items-end -mt-12 mb-6 px-2">
                                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ward.image}`} />
                                    <AvatarFallback>{ward.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="text-right space-y-1">
                                    <h3 className="text-xl font-black text-gray-900">{ward.name}</h3>
                                    <p className="text-sm font-bold text-gray-500">{ward.class} • {ward.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Attendance</p>
                                    <p className="text-lg font-black text-gray-900">{ward.attendance}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Performance</p>
                                    <p className="text-lg font-black text-brand-600">{ward.gpa}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</p>
                                    <p className="text-lg font-black text-green-600">{ward.status}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="h-10 font-bold border-gray-200 hover:bg-gray-50 gap-2">
                                    <FileText className="w-4 h-4" /> Reports
                                </Button>
                                <Button variant="outline" className="h-10 font-bold border-gray-200 hover:bg-gray-50 gap-2">
                                    <Activity className="w-4 h-4" /> Analytics
                                </Button>
                                <Button className="col-span-2 h-10 bg-gray-900 text-white font-bold hover:bg-black gap-2">
                                    View Full Profile <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="glass border-none shadow-soft">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-800">Recent Notifications</CardTitle>
                    <Bell className="w-5 h-5 text-gray-400" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { title: 'Fees Reminder', msg: 'Second term school fees are due next week.', time: '2 hrs ago', type: 'urgent' },
                        { title: 'PTA Meeting', msg: 'General PTA meeting scheduled for Friday 2 PM.', time: 'Yesterday', type: 'info' },
                        { title: 'Chioma: Excellent Result', msg: 'Chioma scored 98/100 in Mathematics test.', time: '2 days ago', type: 'success' },
                    ].map((notif, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/50 border border-gray-100 items-start">
                            <div className={cn(
                                "w-2 h-2 rounded-full mt-2 shrink-0",
                                notif.type === 'urgent' ? 'bg-red-500' :
                                    notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                            )} />
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{notif.msg}</p>
                            </div>
                            <span className="text-xs font-bold text-gray-300">{notif.time}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
