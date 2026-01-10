
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkParent() {
    console.log('Checking parent user...');
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'parent@school.com' },
            include: {
                parentProfile: true
            }
        });

        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('User ID:', user.id);
            console.log('Role:', user.role);
            console.log('Parent Profile:', user.parentProfile);
        }

        // Also check profile directly
        if (user) {
            const profile = await prisma.parentProfile.findUnique({
                where: { userId: user.id }
            });
            console.log('Direct Profile Lookup:', profile);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkParent();
