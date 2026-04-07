const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
require("dotenv/config");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@blogcms.com" },
    update: {},
    create: {
      email: "admin@blogcms.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("✅ Admin user created:", admin.email);
  console.log("   Password: admin123");
  console.log("");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
