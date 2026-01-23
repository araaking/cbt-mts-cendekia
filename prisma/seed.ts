import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Generate password hash
  const passwordHash = await hashPassword("password123");
  console.log("🔐 Generated password hash for 'password123'");

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@mtscendekiamandiri.id" },
    update: {
      accounts: {
        updateMany: {
          where: { providerId: "credential" },
          data: {
            password: passwordHash,
          },
        },
      },
    },
    create: {
      id: "admin-001",
      email: "admin@mtscendekiamandiri.id",
      name: "Administrator",
      emailVerified: true,
      role: "ADMIN",
      accounts: {
        create: {
          id: "account-admin-001",
          accountId: "admin-001",
          providerId: "credential",
          password: passwordHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log(`✅ Admin created/updated: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
