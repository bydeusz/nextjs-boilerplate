import { PrismaClient } from "@prisma/client";

export async function users(prisma: PrismaClient) {
  console.log("🌱 Seeding users...");

  // Get all organizations
  const organizations = await prisma.organisation.findMany();

  const users = [
    {
      clerkId: "user_2NNEqL2nrIRdJ194ndH8",
      email: "admin@bydeusz.nl",
      firstname: "Admin",
      lastname: "User",
      initials: "AU",
      role: "Admin",
      organisationId: organizations[0].id,
      isAdmin: true,
      avatar: "https://ui-avatars.com/api/?name=Admin+User",
    },
    {
      clerkId: "user_2NNEqL2nrIRdJ194ndH9",
      email: "john@techcorp.com",
      firstname: "John",
      lastname: "Doe",
      initials: "JD",
      role: "Developer",
      organisationId: organizations[1].id,
      isAdmin: false,
      avatar: "https://avatars.githubusercontent.com/u/87654321?v=4",
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
