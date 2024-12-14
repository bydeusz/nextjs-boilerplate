import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { promises as fs } from "fs";
import path from "path";

async function getBackgroundImageUrls(): Promise<string[]> {
  const directoryPath = path.join(
    process.cwd(),
    "public",
    "img",
    "backgrounds",
  );
  try {
    const files = await fs.readdir(directoryPath);
    const urls = files.map((file) => `/img/backgrounds/${file}`);
    return urls;
  } catch (error) {
    console.error("Error reading background images directory:", error);
    return [];
  }
}

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Call the function to get background image URLs
  const backgroundImageUrls = await getBackgroundImageUrls();

  // Include the URLs in your response
  const data = {
    // Your existing data here
    backgroundImageUrls, // Add the image URLs to the response
  };

  return NextResponse.json(data, { status: 200 });
}
