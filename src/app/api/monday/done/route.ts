import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Parse the request body to get the id
  const body = await request.json();
  const id = body.id;
  const size = body.size;
  const ratio = body.ratio;

  const height = Math.ceil(size / ratio).toString();
  const width = size.toString();

  // Define your Monday.com API key and GraphQL query
  const API_KEY = process.env.MONDAY_API_TOKEN;

  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "API-Version": "2024-01",
      },
      body: JSON.stringify({
        query: `
          mutation {
            change_multiple_column_values(
              board_id: 3822650183,
              item_id: ${id},
              column_values: "{\\"text8\\": \\"${width}\\", \\"text13\\": \\"${height}\\", \\"color5\\": {\\"index\\":107,\\"post_id\\":null,\\"changed_at\\":\\"${new Date().toISOString()}\\"}}"
            ) {
              id
            }
          }
        `,
      }),
    });

    const mondayData = await response.json();

    if (!response.ok) {
      throw new Error(
        mondayData.errors?.[0]?.message ||
          "Failed to update data on Monday.com",
      );
    }

    // Return the fetched data
    return NextResponse.json(mondayData, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Monday.com:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
