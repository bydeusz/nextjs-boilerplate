import { PrismaClient } from "@prisma/client";

export async function organizations(prisma: PrismaClient) {
  console.log("🌱 Seeding organizations...");

  const organizations = [
    {
      name: "byDeusz",
      website: "https://bydeusz.nl",
      phone: "+31 6 12345678",
      email: "info@bydeusz.nl",
      address: "Streetname 123",
      city: "Amsterdam",
      country: "Netherlands",
      zip: "1234 AB",
      btw: "NL123456789B01",
    },
    {
      name: "Tech Corp",
      website: "https://techcorp.com",
      phone: "+31 6 87654321",
      email: "info@techcorp.com",
      address: "Business Avenue 456",
      city: "Rotterdam",
      country: "Netherlands",
      zip: "3000 XY",
      btw: "NL987654321B01",
    },
  ];

  const createdOrganizations = await Promise.all(
    organizations.map((org) =>
      prisma.organisation.create({
        data: org,
      }),
    ),
  );

  console.log(`✅ Created ${createdOrganizations.length} organizations`);
  return createdOrganizations;
}
