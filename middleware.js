import { NextResponse } from 'next/server';

// Role-based access control
const ROLE_HIERARCHY = {
  admin: ['admin', 'supervisor', 'trainer', 'student'],
  supervisor: ['supervisor', 'trainer', 'student'],
  trainer: ['trainer', 'student'],
  student: ['student'],
};

// Route protection rules
const ROUTE_ROLES = {
  '/admin/users': ['admin'],
  '/admin/supervisors': ['admin'],
  '/admin/trainers': ['admin', 'supervisor'],
  '/admin/groups': ['admin', 'supervisor', 'trainer'],
  '/admin/sessions': ['admin', 'supervisor', 'trainer'],
  '/admin/attendance': ['admin', 'supervisor', 'trainer'],
  '/admin/tasks': ['admin', 'supervisor', 'trainer', 'student'],
  '/admin/subscriptions': ['admin', 'supervisor'],
  '/admin/payments': ['admin', 'supervisor'],
  '/admin/messages': ['admin', 'supervisor', 'trainer', 'student'],
  '/admin/notifications': ['admin', 'supervisor', 'trainer', 'student'],
  '/admin/progress': ['admin', 'supervisor', 'trainer', 'student'],
  '/admin/team': ['admin', 'supervisor'],
  '/admin/test-codes': ['admin', 'supervisor'],
  '/admin/students': ['admin', 'supervisor', 'trainer'],
  '/admin/profile': ['admin', 'supervisor', 'trainer', 'student'],
};

function getTokenFromCookie(cookieHeader) {
  const match = cookieHeader.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

function isPublicEndpoint(pathname) {
  const publicPaths = [
    '/api/admin/auth',
    '/api/admin/auth/guest',
    '/api/validate-code',
    '/api/register',
    '/api/join',
    '/api/certificate',
    '/api/english-test',
    '/api/english-test/submit',
  ];
  return publicPaths.some(p => pathname.startsWith(p));
}

function isPublicPage(pathname) {
  const publicPages = ['/', '/about', '/tracks', '/register', '/join', '/certificate', '/english-test', '/technomath', '/techenglish', '/login'];
  return publicPages.some(p => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get('cookie') || '';
  const token = getTokenFromCookie(cookieHeader);

  // Allow public endpoints and pages
  if (isPublicEndpoint(pathname) || isPublicPage(pathname)) {
    return NextResponse.next();
  }

  // For admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Check if token exists
    if (!token) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists - for API routes, let the route handler validate the token
    // For page routes, we need to check role-based access
    if (!pathname.startsWith('/api/admin')) {
      // Check role-based access for specific routes
      const requiredRoles = ROUTE_ROLES[pathname];
      if (requiredRoles) {
        // We'll do a lightweight check by looking at the cookie
        // The actual role validation happens in the API route or page component
        // For now, just ensure the user is authenticated
        // Role validation will happen in the page component
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
