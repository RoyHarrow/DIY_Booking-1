const { PrismaClient } = require('@prisma/client');

async function seed() {
  const prisma = new PrismaClient();
  try {
    await prisma.serviceType.upsert({
      where: { name: 'plumbing' },
      update: {},
      create: {
        name: 'plumbing',
        description: 'Basic plumbing services',
      },
    });
    console.log('service-type created or exists');
  } catch (e) {
    console.error('seed error', e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();