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
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    return NextResponse.json(
      { message: "Reset password email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return NextResponse.json(
      { error: "Failed to send reset password email" },
      { status: 500 },
    );
  }
}
