const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkPhases() {
  try {
    const programs = await prisma.coachingProgram.findMany({
      include: {
        phases: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    console.log(`Found ${programs.length} programs:`);
    programs.forEach((program, i) => {
      console.log(`\nProgram ${i + 1}: ${program.name}`);
      console.log(`Phases (${program.phases.length} total):`);
      program.phases.forEach((phase, j) => {
        console.log(`  ${phase.order}. ${phase.name}`);
      });
    });
  } catch (error) {
    console.error("Error checking phases:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPhases();