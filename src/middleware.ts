import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Only allow requests from the same origin
    const origin = request.headers.get("origin");
    const currentHost = request.headers.get("host");

    if (origin && new URL(origin).host !== currentHost) {
      return new NextResponse(null, {
        status: 403,
        statusText: "Forbidden",
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // For OPTIONS request, return CORS headers
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        headers: {
          "Access-Control-Allow-Origin": `http://${currentHost}`,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Add CORS headers for actual requests
    const response = NextResponse.next();
    response.headers.set(
      "Access-Control-Allow-Origin",
      `http://${currentHost}`,
    );
    return response;
  }

  // For non-API routes, continue with normal request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all API routes
    "/api/:path*",
  ],
};
