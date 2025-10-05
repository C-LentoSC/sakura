import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './auth';

// Protected routes (homepage is public)
const protectedRoutes = ['/bookings', '/profile', '/dashboard'];

// Auth pages (redirect if already logged in)
const authRoutes = ['/login', '/register'];

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAuthPage = authRoutes.includes(pathname);

  // If user is not authenticated and accesses protected route, redirect to login
  if (isProtected && !session?.user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and visits login/register, redirect to home
  if (isAuthPage && session?.user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/bookings/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
