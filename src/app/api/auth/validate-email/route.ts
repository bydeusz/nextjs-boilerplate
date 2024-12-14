import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (process.env.VALIDATED_EMAIL_DOMAIN) {
      const validDomains = process.env.VALIDATED_EMAIL_DOMAIN.split(",");
      const emailDomain = email.substring(email.lastIndexOf("@") + 1);

      if (!validDomains.includes(emailDomain)) {
        return NextResponse.json(
          `Invalid email, please use an approved domain (${process.env.VALIDATED_EMAIL_DOMAIN}) email address and try again.`,
          { status: 400 },
        );
      }
    }

    return NextResponse.json("Email validated", { status: 200 });
  } catch {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
