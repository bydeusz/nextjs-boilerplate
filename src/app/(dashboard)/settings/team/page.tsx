import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";

import { UserItem } from "@/components/team/UserItem/UserItem";
import { AddUser } from "@/components/modals/Add/Add";

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

  return (
    <>
      <div className="flex justify-end">
        <AddUser isAdmin={currentUser?.isAdmin || false} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <UserItem key={user.id} user={user} currentUser={currentUser} />
        ))}
      </div>
    </>
  );
}
