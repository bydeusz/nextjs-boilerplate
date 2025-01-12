import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    name: "Tadeusz de Ruijter",
    email: "hello@bydeusz.com",
    password: "test@123",
    isAdmin: true,
    role: "Software Engineer",
    emailVerified: new Date(),
  },
  {
    name: "John Doe",
    email: "john@techsolutions.com",
    password: "test@123",
    isAdmin: false,
    role: "designer",
    emailVerified: new Date(),
  },
  {
    name: "Jane Smith",
    email: "jane@bydeusz.com",
    password: "test@123",
    isAdmin: false,
    role: "manager",
    emailVerified: new Date(),
  },
  {
    name: "Mike Johnson",
    email: "mike@techsolutions.com",
    password: "test@123",
    isAdmin: true,
    role: "seoSpecialist",
    emailVerified: new Date(),
  },
];

export async function seedUsers() {
  console.log("🌱 Seeding users...");

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

  console.log("✅ Users seeded successfully");
}
