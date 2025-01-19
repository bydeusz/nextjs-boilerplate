import type { Metadata } from "next";
import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";

import { TeamList } from "@/components/Lists/TeamList/TeamList";

export const metadata: Metadata = {
  title: "Team - Next JS Dashboard Boilerplate by @bydeusz.com",
};

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Fetch the current user from the database using their ID
  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  // Fetch all users from the database
  const users = await prisma.user.findMany();

  // Sort users alphabetically by name
  const sortedUsers = users.sort((a, b) =>
    (a.name || "").localeCompare(b.name || ""),
  );

  return <TeamList users={sortedUsers} currentUser={currentUser} />;
}
