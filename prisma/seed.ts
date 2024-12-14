import { PrismaClient } from "@prisma/client";
import { seeders } from "./seeders";

const prisma = new PrismaClient();

async function resetDatabase() {
  console.log("🗑️  Resetting database...");

  // Truncate all tables with CASCADE
  await prisma.$executeRaw`DO $$ 
    BEGIN 
      EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(quote_ident(tablename), ', ') || ' CASCADE'
        FROM pg_tables
        WHERE schemaname = 'public'
      );
    END $$;`;

  console.log("✅ Database reset completed");
}

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    // Reset the database first
    await resetDatabase();

    // Run seeders in sequence
    await seeders.organizations(prisma);
    await seeders.users(prisma);

    console.log("✅ Database seeding completed");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
