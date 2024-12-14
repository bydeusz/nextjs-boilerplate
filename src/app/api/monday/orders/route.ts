import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function GET(request: any) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const API_KEY = process.env.MONDAY_API_TOKEN;

  const query = `
    query ($cursor: String) {
      boards(ids: 3822650183) {
        groups(ids: ["topics"]) {
          id
          title
          items_page(cursor: $cursor, limit: 50) {
            cursor
            items {
              id
              name
              group {
                id
                title
              }
              column_values {
                id
                value
                text
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "API-Version": "2024-01",
      },
      body: JSON.stringify({
        query: query,
        variables: { cursor: cursor || null },
      }),
    });

    const mondayData = await response.json();

    if (!response.ok) {
      throw new Error(
        mondayData.errors?.[0]?.message ||
          "Failed to fetch data from Monday.com",
      );
    }

    const { items, cursor: nextCursor } =
      mondayData.data.boards[0].groups[0].items_page;

    const filteredData = items.filter(
      (item: any) =>
        item.column_values[20]?.text &&
        item.column_values[28]?.text.toLowerCase() !== "done ai" &&
        item.column_values[28]?.text.toLowerCase() !== "stuck ai",
    );

    return NextResponse.json(
      { items: filteredData, nextCursor },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching data from Monday.com:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
