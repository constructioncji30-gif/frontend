import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   console.log("Middleware running for:", pathname);

//   // Skip middleware for /settings itself to prevent infinite redirects
//   if (pathname.startsWith("/settings")) {
//     return NextResponse.next();
//   }

//   // Get token from cookies (or headers if you prefer)
//   const token = request.cookies.get("token")?.value;

//   // If token is missing, redirect to /settings (login page)
//   if (true) {
//     return NextResponse.redirect(new URL("/settings", request.url));
//   }

//   // Optionally: verify JWT here if needed
//   // If valid, continue
//   return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/Schedule/:path*",
    "/workers/:path*",
    "/appointments/:path*",
  
  ],
};
