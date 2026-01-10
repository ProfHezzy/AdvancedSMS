
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- LINKAGE CHECK ---');

    const users = await prisma.user.findMany({
        where: { role: 'TEACHER' },
        include: { teacherProfile: { include: { classes: true } } }
    });

    console.log(`Found ${users.length} Teacher Users.`);
    users.forEach(u => {
        console.log(`User ID: ${u.id}`);
        console.log(`Username: ${u.username}`);
        console.log(`TeacherProfile ID: ${u.teacherProfile?.id || 'MISSING'}`);
        console.log(`TeacherProfile.userId: ${u.teacherProfile?.userId || 'N/A'}`);
        console.log(`Classes count: ${u.teacherProfile?.classes.length || 0}`);
        u.teacherProfile?.classes.forEach(c => {
            console.log(` - Class: ${c.name} (ID: ${c.id}, teacherId: ${c.teacherId})`);
        });
    });

    const students = await prisma.studentProfile.findMany({
        include: { user: true, class: true }
    });
    console.log(`\nFound ${students.length} Students.`);
    students.forEach(s => {
        console.log(`Student ID: ${s.id}, Name: ${s.user.name}, Class: ${s.class?.name || 'NONE'} (ID: ${s.classId || 'N/A'})`);
    });

    console.log('--- END CHECK ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
