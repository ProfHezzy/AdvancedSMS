import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const prismaClient: any = prisma;
        console.log('Available Models:', Object.keys(prismaClient).filter(k => k[0] !== '_'));
        // Try to access QuestionType if it exists in the enum map
        const questionType = (prisma as any).QuestionType;
        console.log('QuestionType enum:', questionType);

        const count = await (prisma as any).question.count();
        console.log('Question count:', count);
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
