'use client';

import { use } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import QuestionBank from '@/components/dashboard/QuestionBank';
import prisma from '@/lib/prisma';
import { useSession } from 'next-auth/react';

// Using a simple server action inline or just a fetch
async function getAssessment(id: string) {
    // We can't use prisma directly in 'use client' components if they are not server components
    // But this logic should be in a server component or a separate action.
    // For simplicity, I'll assume we pass the basic details or fetch them via a small action.
}

export default function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();

    // In a real app, we'd fetch assessment info via server actions or have this be a server component
    // For this implementation, I'll focus on the QuestionBank itself which handles its own data fetching.

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-xl">
                    <Link href="/dashboard/teacher/assignments">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Assessment Content
                    </h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-4 mt-1">
                        Configure questions, options, and grading keys.
                    </p>
                </div>
            </div>

            <QuestionBank assessmentId={id} />
        </div>
    );
}
