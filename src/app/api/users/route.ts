import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'HR', 'MEDICAL', 'SECURITY']),
});

// GET /api/users - List all users
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        const users = await prisma.user.findMany({
            where: role ? { role: role as any } : undefined,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = userSchema.parse(body);

        // Check if user already exists
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validated.email },
                    { username: validated.username },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Create user with appropriate profile
        const userData: any = {
            username: validated.username,
            email: validated.email,
            password: hashedPassword,
            role: validated.role,
        };

        // Add profile based on role
        if (validated.role === 'STUDENT') {
            userData.studentProfile = { create: {} };
        } else if (validated.role === 'TEACHER') {
            userData.teacherProfile = { create: {} };
        } else if (validated.role === 'PARENT') {
            userData.parentProfile = {
                create: {
                    wallet: {
                        create: {
                            balance: 0,
                            virtualAccount: Math.random().toString().slice(2, 13),
                        },
                    },
                },
            };
        } else if (['ACCOUNTANT', 'HR', 'MEDICAL', 'SECURITY'].includes(validated.role)) {
            userData.staffProfile = { create: { role: validated.role } };
        }

        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
