import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Get token from NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  // Define public/auth pages
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  // If user is on an auth page
  if (isAuthPage) {
    if (isAuth) {
      // Redirect authenticated users away from auth pages to their buddy
      return NextResponse.redirect(new URL("/buddy", req.url));
    }
    // Allow unauthenticated users to see auth pages
    return null;
  }

  // If user is not authenticated and trying to access a protected route or home page
  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // If user is authenticated and hits the root path, redirect to buddy page
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/buddy", req.url));
  }
}

export const config = {
  // Apply middleware to specific paths
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
