import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    name: "John Doe",
    email: "john@bydeusz.com",
    password: "test@123",
    isAdmin: false,
    role: "Designer",
    emailVerified: new Date(),
  },
  {
    name: "Jane Smith",
    email: "jane@bydeusz.com",
    password: "test@123",
    isAdmin: true,
    role: "Manager",
    emailVerified: new Date(),
  },
  {
    name: "Mike Johnson",
    email: "mike@bydeusz.com",
    password: "test@123",
    isAdmin: false,
    role: "SEO Specialist",
    emailVerified: new Date(),
  },
];

export async function seedUsers() {
  console.log("[SEED] Seeding users...");

  for (const user of users) {
    const hashedPassword = await hash(user.password, 12);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        isAdmin: user.isAdmin,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        isAdmin: user.isAdmin,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  }

  console.log("[SUCCESS] Users seeded successfully");
}
