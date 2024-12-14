import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { Buffer } from "buffer";

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const id = formData.get("id") as string;

    if (!file || !id) {
      return new NextResponse(
        JSON.stringify({
          error: "File and ID are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const buffer = await file.arrayBuffer();
    const fileContent = Buffer.from(buffer);
    const columnId = "file";

    // Prepare the query and form-data payload
    const query = `mutation ($file: File!) {
      add_file_to_column(item_id: ${id}, column_id: "${columnId}", file: $file) {
        id
      }
    }`;

    const boundary = "xxxxxxxxxx";
    let data = "";

    // Construct query part
    data += "--" + boundary + "\r\n";
    data += 'Content-Disposition: form-data; name="query"; \r\n';
    data += "Content-Type:application/json\r\n\r\n";
    data += query + "\r\n";

    // Construct file part
    data += "--" + boundary + "\r\n";
    data += `Content-Disposition: form-data; name="variables[file]"; filename="${file.name}"\r\n`;
    data += "Content-Type:application/octet-stream\r\n\r\n";
    const payload = Buffer.concat([
      Buffer.from(data, "utf8"),
      fileContent,
      Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
    ]);

    // Make the request to Monday.com
    const url = "https://api.monday.com/v2/file";
    const API_KEY = process.env.MONDAY_API_TOKEN;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${API_KEY}`,
      },
      body: payload,
    });

    const mondayData = await response.json();

    if (!response.ok) {
      console.error("Failed to update data on Monday.com", mondayData);
      throw new Error(
        mondayData.errors?.[0]?.message ||
          "Failed to update data on Monday.com",
      );
    }

    console.log("Monday.com response:", mondayData);

    // Return the response from Monday.com
    return new NextResponse(JSON.stringify({ mondayData }), { status: 200 });
  } catch (error) {
    console.error("Error uploading file to Monday.com:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to update data on Monday.com",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 },
    );
  }
}
