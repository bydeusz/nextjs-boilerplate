import { PrismaClient } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users...");

  const users = [
    { name: "John Doe", email: "john.doe@example.com", isAdmin: true },
    { name: "Jane Smith", email: "jane.smith@example.com", isAdmin: false },
    { name: "Alice Johnson", email: "alice.johnson@example.com", isAdmin: false },
    { name: "Bob Wilson", email: "bob.wilson@example.com", isAdmin: false },
    { name: "Charlie Brown", email: "charlie.brown@example.com", isAdmin: false },
    { name: "Diana Prince", email: "diana.prince@example.com", isAdmin: false },
    { name: "Edward Stone", email: "edward.stone@example.com", isAdmin: false },
    { name: "Fiona Green", email: "fiona.green@example.com", isAdmin: false },
    { name: "George Miller", email: "george.miller@example.com", isAdmin: false },
    { name: "Helen Davis", email: "helen.davis@example.com", isAdmin: false },
  ];

  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}
