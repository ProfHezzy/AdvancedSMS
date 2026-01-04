'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { authenticate } from '@/actions/auth';
import { useFormStatus } from 'react-dom';
import React, { useActionState } from 'react';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="gradient"
            className="w-full h-11 text-base font-semibold"
            disabled={pending}
        >
            {pending ? 'Signing in...' : 'Sign In'}
        </Button>
    );
}

export default function LoginPage() {
    // Note: useFormState is renamed to useActionState in React 19/Next 15
    // But many environments still use useFormState.
    // I will use useActionState if available, fallback to useFormState
    const [errorMessage, dispatch] = React.useActionState(authenticate, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />

            {/* Content */}
            <div className="relative w-full max-w-md">
                <Card className="glass border-white/20 backdrop-blur-xl shadow-hard">
                    <CardHeader className="space-y-4 text-center pb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-base">
                            Sign in to access the School Management System
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form action={dispatch} className="space-y-5">
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
                                />
                            </div>

                            {errorMessage && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive animate-slide-in">
                                    {errorMessage}
                                </div>
                            )}

                            <LoginButton />

                            <div className="text-center text-sm text-muted-foreground">
                                <a href="#" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-white/80 text-sm mt-6">
                    © 2026 Advanced School Management System
                </p>
            </div>
        </div>
    );
}
