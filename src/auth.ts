import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user || undefined;
    } catch (error) {
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('[AUTH] Authorize called with:', { email: typeof credentials?.email === 'string' ? credentials.email : 'REDACTED' });

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log('[AUTH] Credentials parsed successfully. Fetching user...');

                    let user;
                    try {
                        user = await getUser(email);
                    } catch (e) {
                        console.error('[AUTH] DB fetch failed:', e);
                        return null;
                    }

                    if (!user) {
                        console.log('[AUTH] User not found.');
                        return null;
                    }
                    console.log('[AUTH] User found:', user.id);

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log('[AUTH] Password match. Returning user.');
                        // Return only serializable fields
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            role: user.role,
                        };
                    } else {
                        console.log('[AUTH] Password mismatch.');
                    }
                } else {
                    console.log('[AUTH] Invalid credentials format.');
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger }) {
            console.log('[AUTH] JWT Callback:', { trigger, hasUser: !!user, tokenId: token?.id });
            if (trigger === 'update' && token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.id as string },
                    select: { name: true, image: true, username: true, role: true }
                });
                if (dbUser) {
                    token.name = dbUser.name || dbUser.username;
                    token.role = dbUser.role;
                    token.username = dbUser.username;
                }
            }

            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.username = (user as any).username;
                token.name = (user as any).name || (user as any).username;
            }
            return token;
        },
        async session({ session, token }) {
            console.log('[AUTH] Session Callback:', { sessionUserId: session?.user?.id, tokenId: token?.id });
            if (token && session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).username = token.username;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
});
