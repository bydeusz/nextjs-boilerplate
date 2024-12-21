import { NextResponse } from "next/server";
import { mailTransporter } from "@/utils/mailer";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 },
      );
    }

    const transporter = mailTransporter();
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 },
    );
  }
}
