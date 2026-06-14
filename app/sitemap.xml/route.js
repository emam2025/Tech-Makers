import { NextResponse } from 'next/server';

const BASE_URL = 'https://tka-egypt.com';

const routes = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/tracks', changefreq: 'weekly', priority: '0.9' },
  { path: '/register', changefreq: 'monthly', priority: '0.8' },
  { path: '/join', changefreq: 'monthly', priority: '0.7' },
  { path: '/certificate', changefreq: 'monthly', priority: '0.6' },
  { path: '/english-test', changefreq: 'monthly', priority: '0.7' },
  { path: '/secondary', changefreq: 'monthly', priority: '0.8' },
  { path: '/secondary/first', changefreq: 'monthly', priority: '0.6' },
  { path: '/secondary/second', changefreq: 'monthly', priority: '0.6' },
  { path: '/secondary/third', changefreq: 'monthly', priority: '0.6' },
  { path: '/techenglish', changefreq: 'monthly', priority: '0.7' },
  { path: '/technomath', changefreq: 'monthly', priority: '0.7' },
];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(r => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${BASE_URL}${r.path}" />
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
