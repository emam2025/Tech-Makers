import { NextResponse } from 'next/server';

const BASE_URL = 'https://tka-egypt.com';

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /login

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
