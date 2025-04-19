import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    firstname: "Tadeusz",
    surname: "de Ruijter",
    email: "hello@bydeusz.com",
    password: "test@123",
    isAdmin: true,
    role: "Software Developer",
    emailVerified: new Date(),
  },
  {
    firstname: "Jane",
    surname: "Smith",
    email: "jane@bydeusz.com",
    password: "test@123",
    isAdmin: false,
    role: "Manager",
    emailVerified: new Date(),
  },
  {
    firstname: "Mike",
    surname: "Johnson",
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
        firstname: user.firstname,
        surname: user.surname,
        isAdmin: user.isAdmin,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      create: {
        firstname: user.firstname,
        surname: user.surname,
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
