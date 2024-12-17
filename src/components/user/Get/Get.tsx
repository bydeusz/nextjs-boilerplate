import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";

export async function GetUser() {
  const user = await currentUser();

  const data = await prisma.user.findUnique({
    where: {
      clerkId: user!.id as string,
    },
  });

  if (!data) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <p className="text-xs font-semibold">
        Fullname: {data.firstname} {data.lastname}
      </p>
      <p className="text-xs">E-mail: {data.email}</p>
    </div>
  );
}
