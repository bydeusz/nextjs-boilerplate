import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get request body
    const { fullname, email, role } = await request.json();

    // Basic validation
    if (!fullname || !email || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if email domain is allowed (reusing logic from register route)
    const allowedDomain = process.env.ALLOWED_DOMAIN;
    if (!email.endsWith(`@${allowedDomain}`)) {
      return NextResponse.json(
        { error: `Only ${allowedDomain} email addresses are allowed` },
        { status: 403 },
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: fullname,
        email,
        role,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        fullname: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
