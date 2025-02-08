import { PrismaClient } from "@prisma/client";
import { seedData } from "@/db/data";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  
  await prisma.user.createMany({
    data: seedData.users,
  });
  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
