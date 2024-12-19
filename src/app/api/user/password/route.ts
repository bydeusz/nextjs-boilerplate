import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
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
    const { password } = await request.json();

    // Basic validation
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update user's password
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
