import { prisma } from "@/config/prisma";
import { auth } from "@/config/auth";
import Link from "next/link";
import Image from "next/image";
export async function Thumbnail() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const data = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  });

  if (!data) {
    return null;
  }

  console.log(data.avatar);

  return (
    <Link
      href="/settings"
      className="overflow-hidden flex transition-all items-center justify-center font-semibold text-xs h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white ring-2 ring-gray-200 hover:ring-primary">
      {data.avatar ? (
        <Image
          src={data.avatar}
          alt={`avatar picture of ${data.name}`}
          width={35}
          height={35}
        />
      ) : (
        data.name?.charAt(0)
      )}
    </Link>
  );
}
