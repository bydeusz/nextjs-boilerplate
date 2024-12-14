import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

export async function Thumbnail() {
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
    <Link
      href="/settings"
      className="flex transition-all items-center justify-center font-semibold text-xs h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-200 hover:ring-primary">
      {data.initials}
    </Link>
  );
}
