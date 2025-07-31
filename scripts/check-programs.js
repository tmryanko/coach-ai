const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkPrograms() {
  try {
    const programs = await prisma.coachingProgram.findMany({
      include: {
        phases: {
          include: {
            tasks: true
          }
        }
      }
    });

    console.log(`Found ${programs.length} programs:`);
    programs.forEach((program, i) => {
      console.log(`\nProgram ${i + 1}:`);
      console.log(`  ID: ${program.id}`);
      console.log(`  Name: ${program.name}`);
      console.log(`  Phases: ${program.phases.length}`);
      program.phases.slice(0, 3).forEach((phase, j) => {
        console.log(`    ${j + 1}. ${phase.name}`);
      });
      if (program.phases.length > 3) {
        console.log(`    ... and ${program.phases.length - 3} more phases`);
      }
    });
  } catch (error) {
    console.error("Error checking programs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrograms();