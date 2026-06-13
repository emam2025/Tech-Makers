# Tech Makers Egypt - AI Agent Instructions

## Project Overview
Next.js 16 landing page for Tech Makers Egypt (TKA). Arabic RTL site deploying to Vercel via GitHub.

## Tech Stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS 3.4
- Supabase (PostgreSQL)
- Brevo (email notifications)
- Vercel (deployment)
- Google Material Symbols (icons)

## Commands
- `npx next dev` - Start dev server
- `npx next build` - Production build
- `npx next start` - Start production server

## Environment Variables (Vercel)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `BREVO_API_KEY` - Brevo transactional email API key

## Key Files
- `app/page.js` - Homepage
- `app/register/page.js` - Student registration (connects to `/api/register`)
- `app/join/page.js` - Team registration (connects to `/api/join`)
- `app/api/register/route.js` - Student registration API
- `app/api/join/route.js` - Team registration API
- `app/certificate/page.js` - Certificate verification (Google Drive PDF viewer)
- `app/globals.css` - Global styles including golden-glow-border, mobile optimizations
- `components/SiteHeader.js` - Navigation with mobile drawer
- `tailwind.config.js` - Theme config
- `next.config.mjs` - Next.js config (has serverActions experimental)

## Supabase Tables
- `student_registrations` - Student registration data
- `team_applications` - Team (trainer/specialist/admin) applications

## Code Conventions
- Arabic RTL site with Cairo + Tajawal fonts
- Mobile-first responsive design (16px margin, 44px touch targets)
- Forms use `name` attributes + FormData API for collection
- API routes use direct Supabase REST API (no client library)
- Error messages displayed inline with red border-left styling
- Loading states on submit buttons

## Important Notes
- DO NOT delete `.vercel/` directory or API routes
- WhatsApp number: `201062540164`
- Email: `info@tka-egypt.com`
- Facebook: `https://www.facebook.com/TKA.Egypt/`
