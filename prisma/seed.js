// prisma/seed.js - Optional database seeding
// Run with: npm run seed

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a demo user
  const demoPassword = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      password: demoPassword,
      name: "Demo User",
    },
  });

  console.log("Created/Updated user:", user);

  // Create a demo subject
  const subject = await prisma.subject.upsert({
    where: {
      userId_title: {
        userId: user.id,
        title: "Biology 101",
      },
    },
    update: {},
    create: {
      userId: user.id,
      title: "Biology 101",
      description: "Learn the fundamentals of biology through engaging stories",
      theme: "Lab",
    },
  });

  console.log("Created/Updated subject:", subject);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
