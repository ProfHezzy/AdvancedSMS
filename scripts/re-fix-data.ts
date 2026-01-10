
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DATA FIX START ---');

    // 1. Find Teacher
    const teachers = await prisma.teacherProfile.findMany({ include: { user: true } });
    console.log(`Found ${teachers.length} teachers.`);
    if (teachers.length === 0) return;
    const teacher = teachers[0];
    console.log(`Using Teacher: ${teacher.user.name || 'No Name'} (${teacher.id})`);

    // 2. Find Student
    const students = await prisma.studentProfile.findMany({ include: { user: true } });
    console.log(`Found ${students.length} students.`);
    if (students.length === 0) return;
    const student = students[0];
    console.log(`Using Student: ${student.user.name || 'No Name'} (${student.id})`);

    // 3. Ensure Class "JSS 1 A" exists
    let cls = await prisma.class.findUnique({ where: { name: 'JSS 1 A' } });
    if (!cls) {
        console.log('Creating Class "JSS 1 A"...');
        cls = await prisma.class.create({
            data: {
                name: 'JSS 1 A',
                teacherId: teacher.id
            }
        });
    } else {
        console.log('Updating Class "JSS 1 A"...');
        cls = await prisma.class.update({
            where: { id: cls.id },
            data: { teacherId: teacher.id }
        });
    }
    console.log(`Class ID: ${cls.id}`);

    // 4. Assign Student to Class
    console.log(`Assigning Student ${student.id} to Class ${cls.id}...`);
    await prisma.studentProfile.update({
        where: { id: student.id },
        data: { classId: cls.id }
    });

    console.log('--- DATA FIX COMPLETE ---');
}

main()
    .catch((e) => {
        console.error('--- ERROR ---');
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
