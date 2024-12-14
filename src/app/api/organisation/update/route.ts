import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, website, phone, email, address, city, country, zip, btw } =
      body;

    // Create an empty update object
    const updateData: Partial<{
      name: string;
      website: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      country: string;
      zip: string;
      btw: string;
    }> = {};

    // Only add fields to the update object if they are not empty
    if (name) {
      updateData.name = name;
    }
    if (website) {
      updateData.website = website;
    }
    if (phone) {
      updateData.phone = phone;
    }
    if (email) {
      updateData.email = email;
    }
    if (address) {
      updateData.address = address;
    }
    if (city) {
      updateData.city = city;
    }
    if (country) {
      updateData.country = country;
    }
    if (zip) {
      updateData.zip = zip;
    }
    if (btw) {
      updateData.btw = btw;
    }

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
      const organisationId = match.organisationId;

      await prisma.organisation.update({
        where: {
          id: organisationId as string,
        },
        data: updateData,
      });
    } else {
      return NextResponse.json("Organisation not found", { status: 409 });
    }

    return NextResponse.json("Organisation updated", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
