import { NextResponse } from "next/server";

export async function POST(req: any) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  try {
    const { locale } = await req.json();

    const response = NextResponse.json(
      { message: "Locale set" },
      { status: 200 },
    );
    response.cookies.set("i18nlang", locale, {
      path: "/",
      maxAge: 31536000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
