
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const data: any = {
        teachers: [],
        students: [],
        classes: []
    };

    const users = await prisma.user.findMany({
        include: { teacherProfile: { include: { classes: true } } }
    });

    data.users = users.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role,
        teacherProfile: u.teacherProfile ? {
            id: u.teacherProfile.id,
            userId: u.teacherProfile.userId,
            classes: u.teacherProfile.classes.map(c => ({ id: c.id, name: c.name }))
        } : null
    }));

    data.classes = await prisma.class.findMany();
    data.students = await prisma.studentProfile.findMany({ include: { user: { select: { name: true } } } });

    fs.writeFileSync('diagnostic_data.json', JSON.stringify(data, null, 2));
    console.log('Diagnostic data written to diagnostic_data.json');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
