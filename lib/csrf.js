import crypto from 'crypto';

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(response) {
  const token = generateCsrfToken();
  response.cookies.set('csrf-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  return token;
}

export function verifyCsrfToken(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookieMatch = cookieHeader.match(/csrf-token=([^;]+)/);
  const headerToken = request.headers.get('x-csrf-token');

  if (!cookieMatch || !headerToken) return false;
  if (cookieMatch[1] !== headerToken) return false;

  if (cookieMatch[1].length !== 64 || headerToken.length !== 64) return false;

  return true;
}
