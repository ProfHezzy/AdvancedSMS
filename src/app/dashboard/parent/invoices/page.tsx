'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getWardInvoices } from '@/actions/parent';
import { Loader2, Download, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getWards } from '@/actions/parent';

export default function InvoicesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [selectedWard, setSelectedWard] = useState<string>('all');

    useEffect(() => {
        if (session?.user?.id) {
            initData();
        }
    }, [session]);

    async function initData() {
        setIsLoading(true);
        const userId = (session?.user as any).id;

        // Fetch Wards first to filter or get relevant IDs
        const wardsRes = await getWards(userId);
        if (wardsRes.success) {
            setWards(wardsRes.data);

            // Loop through wards to get all invoices (or update backend to get all at once)
            const allInvoices = [];
            for (const ward of wardsRes.data) {
                const invRes = await getWardInvoices(ward.id);
                if (invRes.success) {
                    // Add student name to invoice for display
                    const wardInvoices = invRes.data.map((inv: any) => ({ ...inv, studentName: ward.user.name || ward.user.username }));
                    allInvoices.push(...wardInvoices);
                }
            }
            setInvoices(allInvoices);
        }
        setIsLoading(false);
    }

    const filteredInvoices = selectedWard === 'all'
        ? invoices
        : invoices.filter(inv => inv.studentName === selectedWard); // Primitive filter by name for now

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Fee Invoices</h1>
                <p className="text-muted-foreground mt-2">View and manage fee payments for your wards.</p>
            </div>

            <div className="flex gap-2 mb-6">
                <Button
                    variant={selectedWard === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedWard('all')}
                    className="rounded-xl font-bold"
                >
                    All Wards
                </Button>
                {wards.map(ward => (
                    <Button
                        key={ward.id}
                        variant={selectedWard === (ward.user.name || ward.user.username) ? 'default' : 'outline'}
                        onClick={() => setSelectedWard(ward.user.name || ward.user.username)}
                        className="rounded-xl font-bold"
                    >
                        {ward.user.name || ward.user.username}
                    </Button>
                ))}
            </div>

            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="uppercase tracking-widest text-lg font-black text-gray-800">Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No invoices found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice ID</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.map((inv) => (
                                    <TableRow key={inv.id} className="hover:bg-gray-50/50">
                                        <TableCell className="font-mono text-xs text-muted-foreground">{inv.id}</TableCell>
                                        <TableCell className="font-bold">{inv.studentName}</TableCell>
                                        <TableCell>{inv.description}</TableCell>
                                        <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold">₦{inv.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={inv.status === 'PAID' ? 'default' : 'destructive'} className={inv.status === 'PAID' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {inv.status === 'PENDING' || inv.status === 'OVERDUE' ? (
                                                <Button size="sm" onClick={() => router.push('/dashboard/parent/fees')} className="bg-brand-600 text-white font-bold h-8 rounded-lg">
                                                    <CreditCard className="w-3 h-3 mr-2" />
                                                    Pay Now
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="ghost" onClick={() => toast.success("Receipt downloaded")} className="h-8 rounded-lg text-brand-600 hover:bg-brand-50">
                                                    <Download className="w-3 h-3 mr-2" />
                                                    Receipt
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
