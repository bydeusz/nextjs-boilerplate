import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/utils/db";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId as string,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  if (!user.organisationId) {
    return new NextResponse("User has no organisation", { status: 404 });
  }

  const organisation = await prisma.organisation.findUnique({
    where: {
      id: user.organisationId,
    },
  });

  // perform your Route Handler's logic
  return NextResponse.json({ user, organisation }, { status: 200 });
}
