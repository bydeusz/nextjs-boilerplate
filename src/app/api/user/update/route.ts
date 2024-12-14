import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstname, lastname, role } = body;

    // Create an empty update object
    const updateData: Partial<{
      firstname: string;
      lastname: string;
      role: string;
    }> = {};

    // Only add fields to the update object if they are not empty
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (role) updateData.role = role;

    // Create params for Clerk API
    const params = {
      ...updateData,
      initials: `${firstname[0]}${lastname[0]}`,
    };

    const user = await currentUser();

    if (!user) {
      return NextResponse.json("Not authenticated", { status: 401 });
    }

    const userId = user.id as string;

    const match = await prisma.user.findUnique({
      where: {
        clerkId: userId as string,
      },
    });

    if (match) {
      await clerkClient.users.updateUser(userId, params);

      await prisma.user.update({
        where: {
          clerkId: userId as string,
        },
        data: updateData,
      });
    } else {
      return NextResponse.json("User not found", { status: 409 });
    }

    return NextResponse.json("User updated", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
