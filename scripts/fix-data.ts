
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing Data...');

    // 1. Get first teacher
    const teacher = await prisma.teacherProfile.findFirst();
    if (!teacher) {
        console.log('No teacher profile found.');
        return;
    }
    console.log('Found Teacher:', teacher.id);

    // 2. Get first student
    const student = await prisma.studentProfile.findFirst();
    if (!student) {
        console.log('No student profile found.');
        return;
    }
    console.log('Found Student:', student.id);

    // 3. Find or Create Class JSS 1 A
    let cls = await prisma.class.findFirst({ where: { name: 'JSS 1 A' } });
    if (!cls) {
        console.log('Creating Class JSS 1 A...');
        cls = await prisma.class.create({
            data: {
                name: 'JSS 1 A',
                capacity: 30,
                teacherId: teacher.id
            }
        });
    } else {
        console.log('Updating Class JSS 1 A teacher...');
        await prisma.class.update({
            where: { id: cls.id },
            data: { teacherId: teacher.id }
        });
    }

    // 4. Assign Student to Class
    console.log('Assigning Student to JSS 1 A...');
    await prisma.studentProfile.update({
        where: { id: student.id },
        data: { classId: cls.id }
    });

    console.log('Data fixed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
