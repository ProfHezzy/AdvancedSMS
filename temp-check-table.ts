import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await (prisma as any).question.count();
        console.log('Question table exists. Current count:', count);
    } catch (error: any) {
        console.error('Error accessing Question table:', error.message);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
