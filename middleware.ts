import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/dashboard")) return NextResponse.next();
  if (!request.cookies.get("ricox_session")) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
