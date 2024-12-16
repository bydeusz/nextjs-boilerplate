import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users...");

  const users = [
    {
      name: "John Doe",
      email: "john.doe@bydeusz.com",
      isAdmin: true,
      password: await hash("test@123", 12),
      emailVerified: new Date(),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@bydeusz.com",
      isAdmin: false,
      password: await hash("test@123", 12),
      emailVerified: new Date(),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      name: "Alice Johnson",
      email: "alice.johnson@bydeusz.com",
      isAdmin: false,
      password: await hash("test@123", 12),
      emailVerified: new Date(),
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
  ];

  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      }),
    ),
  );

  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}
