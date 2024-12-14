import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { prisma } from "@/utils/db";

export async function DELETE(req: Request) {
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

    await prisma.user.delete({
      where: {
        clerkId: userId as string,
      },
    });

    await clerkClient.users.deleteUser(userId);
    return NextResponse.json("User successfully deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
