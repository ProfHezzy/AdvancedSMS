import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;
            const isOnDashboard = pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to sign-in
            } else if (isLoggedIn && (pathname === '/login' || pathname === '/')) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [],
    secret: process.env.AUTH_SECRET || 'fallback-secret-for-dev-only-12345678',
    trustHost: true,
    basePath: '/api/auth',
} satisfies NextAuthConfig;
