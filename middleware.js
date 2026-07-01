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

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

function getTokenFromCookie(cookieHeader) {
  const match = cookieHeader.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

function isPublicEndpoint(pathname) {
  const publicPaths = [
    '/api/admin/auth',
    '/api/admin/auth/guest',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
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
  const publicPages = ['/', '/about', '/tracks', '/register', '/join', '/certificate', '/english-test', '/technomath', '/techenglish', '/login', '/forgot-password', '/reset-password'];
  return publicPages.some(p => pathname === p || pathname.startsWith(p + '/'));
}

function addSecurityHeaders(response) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get('cookie') || '';
  const token = getTokenFromCookie(cookieHeader);

  // Allow public endpoints and pages
  if (isPublicEndpoint(pathname) || isPublicPage(pathname)) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // For admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Check if token exists
    if (!token) {
      if (pathname.startsWith('/api/admin')) {
        const response = NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
        return addSecurityHeaders(response);
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      return addSecurityHeaders(response);
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
