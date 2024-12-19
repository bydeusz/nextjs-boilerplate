import { prisma } from "@/config/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { validateDomain } from "@/utils/validateDomain";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const allowedDomains = process.env.ALLOWED_DOMAIN;

    if (!validateDomain(email, allowedDomains)) {
      return NextResponse.json(
        {
          error:
            "This email domain is not allowed. Please use an approved domain.",
        },
        { status: 400 },
      );
    }

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
