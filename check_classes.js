
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const classes = await prisma.class.findMany();
        console.log('Classes found:', classes);
        const subjects = await prisma.subject.findMany();
        console.log('Subjects found:', subjects);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
