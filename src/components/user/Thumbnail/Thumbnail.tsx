import { prisma } from "@/config/prisma";
import { auth } from "@/config/auth";
import Link from "next/link";

export async function Thumbnail() {
  const session = await auth();

  const data = await prisma.user.findUnique({
    where: {
      id: session?.user?.id as string,
    },
  });

  if (!data) {
    return null;
  }

  return (
    <Link
      href="/settings"
      className="flex transition-all items-center justify-center font-semibold text-xs h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white ring-2 ring-gray-200 hover:ring-primary">
      {data.name?.charAt(0)}
    </Link>
  );
}
