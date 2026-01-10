
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing Student Name...');
    const student = await prisma.user.findFirst({ where: { role: 'STUDENT', name: null } });
    if (student) {
        await prisma.user.update({
            where: { id: student.id },
            data: { name: 'Jane Student' }
        });
        console.log('Updated student name to Jane Student');
    } else {
        console.log('No student with null name found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
