import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";
import { supabase } from "@/config/supabase";
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
    const { fullname, email, role, avatar } = await request.json();

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

    let avatarUrl: string | undefined = undefined;
    
    // Handle avatar upload if provided
    if (avatar && avatar.startsWith('data:image')) {
      try {
        // Convert base64 to buffer
        const base64Data = avatar.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Get file extension from mime type
        const mimeType = avatar.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1];
        
        // Create file path
        const filePath = `users/${session.user.id}/${session.user.id}-avatar.${extension}`;
        
        // Upload to Supabase
        const { error: uploadError } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_BUCKET_ID!)
          .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(process.env.NEXT_PUBLIC_BUCKET_ID!)
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      } catch (error) {
        console.error('Error uploading avatar:', error);
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 }
        );
      }
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
        avatar: avatarUrl || avatar || undefined,
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
