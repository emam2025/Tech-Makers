const rateLimitMap = new Map();

export function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > windowMs) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > limit) return false;
  return true;
}

export function checkOrigin(request) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) return true;
      return false;
    } catch { return false; }
  }
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === host) return true;
      return false;
    } catch { return false; }
  }
  return false;
}

export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizePlain(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, '');
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^\+?[\d\s-]{7,20}$/.test(phone);
}

export function validateName(name) {
  return /^[\p{L}\s\-'()]{2,100}$/u.test(name);
}

export function validateInputLength(data, limits = {}) {
  const defaults = { name: 100, email: 254, phone: 20, bio: 2000, portfolio: 500, certificate: 1000, specialty: 100, experience: 100, department: 100, country: 100 };
  const allLimits = { ...defaults, ...limits };
  for (const [key, maxLen] of Object.entries(allLimits)) {
    if (data[key] && typeof data[key] === 'string' && data[key].length > maxLen) {
      return `${key} يتجاوز الحد الأقصى (${maxLen} حرف)`;
    }
  }
  return null;
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}
