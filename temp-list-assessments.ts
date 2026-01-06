import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const assessments = await prisma.assessment.findMany({
        select: { id: true, title: true, type: true }
    });
    console.log('Assessments:', JSON.stringify(assessments, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
