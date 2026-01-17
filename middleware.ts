import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface DecodedToken {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}

// Add routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/invoices',
];

// Admin-only routes
const adminRoutes = ['/admin'];

// Add routes that should redirect to home if already authenticated
const authRoutes = ['/login'];

// Simple JWT decode function (without library)
function decodeJWT(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;
  
  // Decode token to get user role
  let userRole: 'ADMIN' | 'USER' | null = null;
  if (accessToken) {
    const decoded = decodeJWT(accessToken);
    if (decoded) {
      userRole = decoded.role;
    }
  }

  // Check if the route is an admin route
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if trying to access admin route without authentication
  if (isAdminRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if trying to access admin route without ADMIN role
  if (isAdminRoute && isAuthenticated && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to login if trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login page
  if (isAuthRoute && isAuthenticated) {
    // Redirect ADMIN to admin panel, others to dashboard
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect authenticated users from home page to their dashboard
  if (pathname === '/' && isAuthenticated) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
