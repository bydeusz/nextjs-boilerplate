import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";
import { minioClient, MINIO_BUCKET_NAME } from "@/config/minio";

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

    // Get form data
    const formData = await request.formData();
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const avatarFile = formData.get("avatar") as File | null;

    // Basic validation
    if (!fullname || !email || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if email domain is allowed
    const allowedDomains = process.env.ALLOWED_DOMAIN?.split(',') || [];
    const emailDomain = email.split('@')[1];
    if (!allowedDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: `Only ${allowedDomains.join(', ')} email addresses are allowed` },
        { status: 403 },
      );
    }

    let avatarUrl: string | null = null;
    if (avatarFile) {
      // Generate avatar path
      const extension = avatarFile.name.split('.').pop();
      const avatarPath = `users/${session.user.id}/${session.user.id}-avatar.${extension}`;

      // Convert File to Buffer
      const buffer = Buffer.from(await avatarFile.arrayBuffer());

      // Upload to MinIO
      await minioClient.putObject(
        MINIO_BUCKET_NAME,
        avatarPath,
        buffer,
        avatarFile.size,
        { 'Content-Type': avatarFile.type }
      );

      // Generate URL for the avatar
      avatarUrl = `${process.env.NEXT_PUBLIC_MINIO_URL}/${MINIO_BUCKET_NAME}/${avatarPath}`;
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
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        fullname: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
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
