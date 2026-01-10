'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    History,
    Receipt,
    Copy,
    CheckCircle2,
    Loader2,
    Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getOrCreateWallet, getTransactions } from '@/actions/wallet';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { FundWalletDialog } from './fund-wallet-dialog';

export default function ParentWalletPage() {
    const { data: session } = useSession();
    const [wallet, setWallet] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFunding, setIsFunding] = useState(false);
    const [copied, setCopied] = useState(false);
    const [savedCards, setSavedCards] = useState<any[]>([]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchWallet();
        }
    }, [session]);

    async function fetchWallet() {
        setIsLoading(true);

        const userId = session?.user?.id;
        if (!userId) return;

        try {
            const { getParentProfile } = await import('@/actions/academic');
            const parentRes = await getParentProfile(userId);

            if (!parentRes.success || !parentRes.data) {
                toast.error('Parent profile not found.');
                setIsLoading(false);
                return;
            }

            // Fetch Saved Cards
            const { getSavedCards } = await import('@/actions/cards');
            const cardRes = await getSavedCards(parentRes.data.id);
            if (cardRes.success && cardRes.data) {
                setSavedCards(cardRes.data);
            }

            // Get/Create Wallet
            const walletRes = await getOrCreateWallet(parentRes.data.id);
            if (walletRes.success && walletRes.data) {
                setWallet(walletRes.data);
                const txnRes = await getTransactions(walletRes.data.id);
                if (txnRes.success && txnRes.data) {
                    setTransactions(txnRes.data);
                }
            } else {
                toast.error(walletRes.error || 'Failed to load wallet');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error loading wallet data');
        }

        setIsLoading(false);
    }

    const handleCopyAccount = () => {
        if (!wallet?.virtualAccount) return;
        navigator.clipboard.writeText(wallet.virtualAccount);
        setCopied(true);
        toast.success('Account number copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
                    <p className="font-black text-brand-200 uppercase tracking-widest">Loading Wallet...</p>
                </div>
            </div>
        );
    }

    const totalSpent = transactions
        .filter(t => t.type === 'DEBIT' && t.status === 'SUCCESS')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900">
            <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                    My Wallet
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">Manage payments and view transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Wallet Card */}
                <Card className="md:col-span-2 glass border-none shadow-soft bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-64 h-64 text-white" />
                    </div>
                    <CardContent className="p-8 relative z-10 flex flex-col justify-between h-full min-h-[280px]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Available Balance</p>
                                <h2 className="text-5xl font-black mt-2">{formatCurrency(wallet?.balance || 0)}</h2>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Virtual Account */}
                        <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Virtual Account</p>
                                <Building2 className="w-4 h-4 text-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-black tracking-wider">{wallet?.virtualAccount || 'N/A'}</p>
                                <Button size="icon" variant="ghost" onClick={handleCopyAccount} className="text-white hover:bg-white/20">
                                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Wema Bank (Test Mode)</p>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Dialog open={isFunding} onOpenChange={setIsFunding}>
                                <DialogTrigger asChild>
                                    <Button disabled={!wallet || isLoading} className="h-12 px-6 bg-brand-600 hover:bg-brand-500 text-white font-black rounded-xl border border-brand-500 shadow-lg shadow-brand-900/50 btn-shine gap-2">
                                        <ArrowUpRight className="w-5 h-5" /> Fund Wallet
                                    </Button>
                                </DialogTrigger>
                                {wallet && (
                                    <FundWalletDialog
                                        walletId={wallet.id}
                                        parentId={wallet.parentId}
                                        virtualAccount={wallet.virtualAccount}
                                        savedCards={savedCards}
                                        email={session?.user?.email!}
                                        onSuccess={() => {
                                            setIsFunding(false);
                                            fetchWallet();
                                        }}
                                    />
                                )}
                            </Dialog>
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
                                <p className="text-2xl font-black text-gray-900">{formatCurrency(totalSpent)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass border-none shadow-soft bg-purple-50/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Transactions</p>
                                <p className="text-2xl font-black text-gray-900">{transactions.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Transactions */}
            <Card className="glass border-none shadow-soft">
                <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight font-black">
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {transactions.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {transactions.map((txn) => (
                                <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", txn.type === 'CREDIT' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                                            {txn.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{txn.type === 'CREDIT' ? 'Wallet Funding' : 'Payment'}</h4>
                                            <p className="text-xs font-medium text-gray-400">{txn.reference} • {formatDate(txn.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn("font-black text-lg", txn.type === 'CREDIT' ? "text-green-600" : "text-gray-900")}>
                                            {txn.type === 'CREDIT' ? '+' : '-'}{formatCurrency(txn.amount)}
                                        </p>
                                        <Badge variant="outline" className={cn("text-[10px] font-bold border-gray-200 bg-white", txn.status === 'SUCCESS' ? "text-green-600" : txn.status === 'PENDING' ? "text-orange-600" : "text-red-600")}>
                                            {txn.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center text-muted-foreground">
                            <Wallet className="w-12 h-12 text-brand-100 mx-auto mb-4" />
                            <p className="font-black text-gray-800 uppercase tracking-widest text-sm">No Transactions Yet</p>
                            <p className="text-sm mt-1">Fund your wallet to get started</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
