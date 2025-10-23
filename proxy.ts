import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './app/lib/session';

// Define route categories
const protectedRoutes = ['/dashboard', '/profile', '/bookings', '/book', '/booking', '/checkout'];
const adminRoutes = ['/admin'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Check route type
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  
  // Decrypt session from cookie (optimistic check, no DB call)
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);
  
  // Check if session exists and has basic validity (not expired)
  const hasSession = session?.userId ? true : false;
  
  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('from', path); // Save where they came from
    return NextResponse.redirect(loginUrl);
  }
  
  // For auth routes: DON'T redirect even if session exists
  // Let the auth layout verify with DB first and clear invalid sessions
  // Only redirect if we're sure the session is valid (this check happens in protected layout)
  // For now, we skip the redirect on auth routes entirely
  // if (isAuthRoute && hasSession) {
  //   return NextResponse.redirect(new URL('/', req.nextUrl));
  // }
  
  // Admin routes require authentication (role check happens server-side)
  if (isAdminRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  
  // Add cache control headers to prevent browser caching of auth state
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$|.*\\.ttf$|.*\\.otf$|.*\\.woff$|.*\\.woff2$).*)',
  ],
};
