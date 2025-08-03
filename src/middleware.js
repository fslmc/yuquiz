// src/middleware.js
import { NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/profile',
  '/quizzes/new',
  '/play'
];

// Helper to check if the pathname is protected
function isProtectedPath(pathname) {
  return protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only run middleware for protected routes
  if (isProtectedPath(pathname)) {
    // Call your session API to check authentication
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/session`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    const data = await res.json();

    if (!data.authenticated) {
      // Redirect to login page
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Specify which paths to match
export const config = {
  matcher: [
    '/profile',
    '/profile/:path*',
    '/quizzes/new',
    '/play',
    '/play/:path*',
  ],
};