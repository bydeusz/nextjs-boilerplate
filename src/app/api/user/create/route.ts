import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstname, lastname, role, company } = body;
    const params = { firstName: firstname, lastName: lastname };

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

    if (!match) {
      const user = await clerkClient.users.updateUser(userId, params);

      // Try to find an organisation with the given company name
      let organisation = await prisma.organisation.findFirst({
        where: {
          name: company,
        },
      });

      // If the organisation does not exist, create a new one
      if (!organisation) {
        organisation = await prisma.organisation.create({
          data: {
            name: company,
          },
        });
      }

      await prisma.user.create({
        data: {
          clerkId: userId as string,
          email: user.emailAddresses[0].emailAddress as string,
          firstname: firstname,
          lastname: lastname,
          initials: `${firstname[0]}${lastname[0]}`,
          role: role,
          organisationId: organisation.id,
          isAdmin: false,
        },
      });
    } else {
      return NextResponse.json("User already exists", { status: 409 });
    }

    return NextResponse.json("User created successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
