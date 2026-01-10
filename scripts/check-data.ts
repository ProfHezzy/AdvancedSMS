
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Teachers...');
    const teachers = await prisma.teacherProfile.findMany({
        include: { user: true, classes: true }
    });

    if (teachers.length === 0) {
        console.log('No teachers found.');
    } else {
        teachers.forEach(t => {
            console.log(`Teacher: ${t.user.name} (${t.user.email}) - Classes: ${t.classes.length}`);
            t.classes.forEach(c => console.log(`  - ${c.name}`));
        });
    }

    console.log('\nChecking Students...');
    const students = await prisma.studentProfile.findMany({
        include: { user: true, class: true }
    });

    if (students.length === 0) {
        console.log('No students found.');
    } else {
        students.forEach(s => {
            console.log(`Student: ${s.user.name} (${s.user.email}) - Class: ${s.class ? s.class.name : 'Unassigned'}`);
        });
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
