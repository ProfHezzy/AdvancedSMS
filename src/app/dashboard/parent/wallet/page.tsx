'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    History,
    Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ParentWalletPage() {
    const transactions = [
        { id: 'TXN-001', title: 'School Fees Payment - Term 1', date: '20 Oct 2025', amount: '-₦150,000', type: 'DEBIT', status: 'SUCCESS' },
        { id: 'TXN-002', title: 'Wallet Funding', date: '15 Oct 2025', amount: '+₦200,000', type: 'CREDIT', status: 'SUCCESS' },
        { id: 'TXN-003', title: 'Uniform Purchase', date: '10 Oct 2025', amount: '-₦25,000', type: 'DEBIT', status: 'SUCCESS' },
        { id: 'TXN-004', title: 'Textbooks', date: '10 Oct 2025', amount: '-₦45,000', type: 'DEBIT', status: 'SUCCESS' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    My Wallet
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Manage payments and view transaction history.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Wallet Card */}
                <Card className="md:col-span-2 glass border-none shadow-soft bg-gray-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-64 h-64 text-white" />
                    </div>
                    <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Available Balance</p>
                                <h2 className="text-5xl font-black mt-2">₦ 8,450.00</h2>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <Button className="h-12 px-6 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl border border-brand-500 shadow-lg shadow-brand-900/50 btn-shine gap-2">
                                <ArrowUpRight className="w-5 h-5" /> Fund Wallet
                            </Button>
                            <Button variant="outline" className="h-12 px-6 bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold rounded-xl backdrop-blur-md gap-2">
                                <History className="w-5 h-5" /> Statements
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <Card className="glass border-none shadow-soft bg-blue-50/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <ArrowDownLeft className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Total Spent</p>
                                <p className="text-2xl font-black text-gray-900">₦ 325k</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass border-none shadow-soft bg-purple-50/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Next Due</p>
                                <p className="text-2xl font-black text-gray-900">₦ 0.00</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Transactions */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                        {transactions.map((txn) => (
                            <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        txn.type === 'CREDIT' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                    )}>
                                        {txn.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{txn.title}</h4>
                                        <p className="text-xs font-medium text-gray-400">{txn.id} • {txn.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "font-black text-lg",
                                        txn.type === 'CREDIT' ? "text-green-600" : "text-gray-900"
                                    )}>
                                        {txn.amount}
                                    </p>
                                    <Badge variant="outline" className="text-[10px] font-bold border-gray-200 text-gray-500 bg-white">
                                        {txn.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
