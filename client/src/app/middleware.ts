import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value || localStorage.getItem("token");
  const user = req.cookies.get("user")?.value || localStorage.getItem("user");

  if (!token && user && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*"],
};
