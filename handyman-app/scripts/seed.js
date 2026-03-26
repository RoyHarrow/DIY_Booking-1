const { PrismaClient } = require('@prisma/client');

const SERVICE_TYPES = [
  { name: 'Plumbing', description: 'Leak repairs, pipe fitting, drain clearing' },
  { name: 'Electrical', description: 'Wiring, outlet installation, fault finding' },
  { name: 'Carpentry', description: 'Shelving, door fitting, furniture assembly' },
  { name: 'Painting', description: 'Interior and exterior painting and decorating' },
  { name: 'General Handyman', description: 'Odd jobs and general household repairs' },
];

async function seed() {
  const prisma = new PrismaClient();
  try {
    for (const st of SERVICE_TYPES) {
      await prisma.serviceType.upsert({
        where: { name: st.name },
        update: { description: st.description },
        create: st,
      });
      console.log(`service-type upserted: ${st.name}`);
    }
  } catch (e) {
    console.error('seed error', e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();