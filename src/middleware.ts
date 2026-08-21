import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuth = !!token;
  const pathname = req.nextUrl.pathname;

  // Public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  // If authenticated user visits login/register
  if (
    isAuth &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/buddy", req.url));
  }

  // Allow public routes, including /
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect all other matched routes
  if (!isAuth) {
    let from = pathname;

    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/buddy/:path*",
    "/profile/:path*",
    "/timeline/:path*",
    "/memory-tree/:path*",
  ],
};