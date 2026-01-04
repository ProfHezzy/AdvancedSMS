import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@school.com',
            password: adminPassword,
            role: Role.ADMIN,
        },
    });
    console.log('✅ Created admin user');

    // Create Teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: {},
        create: {
            username: 'teacher_john',
            email: 'teacher@school.com',
            password: teacherPassword,
            role: Role.TEACHER,
            teacherProfile: {
                create: {},
            },
        },
    });
    console.log('✅ Created teacher user');

    // Create Student
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.user.upsert({
        where: { email: 'student@school.com' },
        update: {},
        create: {
            username: 'student_jane',
            email: 'student@school.com',
            password: studentPassword,
            role: Role.STUDENT,
            studentProfile: {
                create: {},
            },
        },
    });
    console.log('✅ Created student user');

    // Create Parent
    const parentPassword = await bcrypt.hash('parent123', 10);
    const parent = await prisma.user.upsert({
        where: { email: 'parent@school.com' },
        update: {},
        create: {
            username: 'parent_smith',
            email: 'parent@school.com',
            password: parentPassword,
            role: Role.PARENT,
            parentProfile: {
                create: {
                    wallet: {
                        create: {
                            balance: 5000.0,
                            virtualAccount: '12345678901',
                        },
                    },
                },
            },
        },
    });
    console.log('✅ Created parent user');

    // Create Academic Session
    const session = await prisma.session.upsert({
        where: { name: '2025/2026' },
        update: {},
        create: {
            name: '2025/2026',
            isCurrent: true,
            terms: {
                create: [
                    { name: 'First Term', isCurrent: true },
                    { name: 'Second Term', isCurrent: false },
                    { name: 'Third Term', isCurrent: false },
                ],
            },
        },
    });
    console.log('✅ Created academic session');

    // Create Subjects
    const subjects = await Promise.all([
        prisma.subject.upsert({
            where: { name: 'Mathematics' },
            update: {},
            create: { name: 'Mathematics', code: 'MATH101' },
        }),
        prisma.subject.upsert({
            where: { name: 'English Language' },
            update: {},
            create: { name: 'English Language', code: 'ENG101' },
        }),
        prisma.subject.upsert({
            where: { name: 'Physics' },
            update: {},
            create: { name: 'Physics', code: 'PHY101' },
        }),
    ]);
    console.log('✅ Created subjects');

    // Create Class
    const class1 = await prisma.class.upsert({
        where: { name: 'JSS 1A' },
        update: {},
        create: {
            name: 'JSS 1A',
        },
    });
    console.log('✅ Created class');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@school.com / admin123');
    console.log('Teacher: teacher@school.com / teacher123');
    console.log('Student: student@school.com / student123');
    console.log('Parent: parent@school.com / parent123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
