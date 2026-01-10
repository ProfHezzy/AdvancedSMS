
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- FINAL VERIFICATION START ---');

    const cls = await prisma.class.findUnique({
        where: { name: 'JSS 1 A' },
        include: {
            teacher: { include: { user: true } },
            students: { include: { user: true } }
        }
    });

    if (!cls) {
        console.log('Error: Class "JSS 1 A" not found.');
        return;
    }

    console.log(`Class: ${cls.name}`);
    console.log(`Teacher: ${cls.teacher?.user.name || 'None'} (${cls.teacher?.id || 'N/A'})`);
    console.log(`Students enrolled: ${cls.students.length}`);
    cls.students.forEach(s => {
        console.log(` - ${s.user.name} (${s.id})`);
    });

    console.log('--- FINAL VERIFICATION COMPLETE ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
