import { prisma } from "@/config/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { validateDomain } from "@/utils/validateDomain";
import { randomBytes } from "crypto";

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

    // Create verification token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create user and verification token
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email using the new endpoint
    const verificationResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/mailer/verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token }),
      },
    );

    if (!verificationResponse.ok) {
      throw new Error("Failed to send verification email");
    }

    return NextResponse.json(
      { message: "User created successfully. Please verify your email." },
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
