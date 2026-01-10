'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid credentials.');
            } else {
                router.push('/dashboard');
                router.refresh(); // Ensure session is updated
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />

            {/* Content */}
            <div className="relative w-full max-w-md">
                <Card className="glass border-white/20 backdrop-blur-xl shadow-hard">
                    <CardHeader className="space-y-4 text-center pb-8">
                        <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-brand-100/50">
                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to access the School Management System
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="teacher@school.com"
                                    required
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-11"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive animate-slide-in">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="gradient"
                                className="w-full h-11 text-base font-semibold"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                <a href="#" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-white/80 text-sm mt-6">
                    © 2026 Advanced School Management System By ProfHezzy
                </p>
            </div>
        </div>
    );
}
