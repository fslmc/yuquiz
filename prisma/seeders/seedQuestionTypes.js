const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.questionType.createMany({
    data: [
      { code: 'MCQ', description: 'Multiple Choice Question' },
      { code: 'SHORT_TEXT', description: 'Short Text Answer' },
      { code: 'ESSAY', description: 'Essay Question' }
    ],
    skipDuplicates: true
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });