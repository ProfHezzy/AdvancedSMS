import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Check ---');

    const sessions = await prisma.session.findMany();
    console.log(`Sessions: ${sessions.length}`);
    sessions.forEach(s => console.log(` - ${s.name} (Current: ${s.isCurrent})`));

    const classes = await prisma.class.findMany();
    console.log(`Classes: ${classes.length}`);
    classes.forEach(c => console.log(` - ${c.name}`));

    const terms = await prisma.term.findMany();
    console.log(`Terms: ${terms.length}`);
    terms.forEach(t => console.log(` - ${t.name} (Current: ${t.isCurrent})`));

    const staff = await prisma.staffProfile.findMany({ include: { user: true } });
    console.log(`Staff Profiles: ${staff.length}`);
    staff.forEach((s: any) => console.log(` - ${s.user.name} (${s.role}) - ID: ${s.staffId}`));

    console.log('--- Check End ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
