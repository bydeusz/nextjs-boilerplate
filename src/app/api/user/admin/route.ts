import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/utils/db";

export async function PATCH(req: Request) {
  try {
    const { userId } = await req.json();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json("Not authenticated", { status: 401 });
    }

    const match = await prisma.user.findUnique({
      where: {
        clerkId: userId as string,
      },
    });

    if (!match) {
      return NextResponse.json("User not found", { status: 404 });
    }

    await prisma.user.update({
      where: {
        clerkId: userId as string,
      },
      data: {
        isAdmin: !match.isAdmin,
      },
    });

    return NextResponse.json(
      {
        message: "User isAdmin status successfully updated",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
