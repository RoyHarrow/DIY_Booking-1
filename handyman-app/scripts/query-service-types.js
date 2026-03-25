const {PrismaClient} = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const types = await prisma.serviceType.findMany();
    console.log(JSON.stringify(types, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();