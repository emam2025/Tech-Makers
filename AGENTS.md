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
- Fonts: Tajawal (display/headlines), Cairo (Arabic body), Poppins (English fallback)

## Commands
- `npx next dev` - Start dev server
- `npx next build` - Production build
- `npx next start` - Start production server

## Environment Variables (Vercel)
- `SUPABASE_URL` - Supabase project URL (`clofinlkbfqpplvhuywj`)
- `SUPABASE_SERVICE_KEY` - Supabase service role key (rotated)
- `BREVO_API_KEY` - Brevo transactional email API key
- `BREVO_SMTP_LOGIN` - Brevo SMTP login
- `RESEND_API_KEY` - Resend API key
- `GOOGLE_SCRIPT_URL` - Google Apps Script URL (proxied via `/api/certificate`)

## Key Files
- `app/page.js` - Homepage (hero, stats, tracks, results, testimonials, FAQ, pricing)
- `app/about/page.js` - About page (CS50/Harvard intro, TKA-Egypt info, vision, values, goals)
- `app/tracks/page.js` - Tracks page (3 tracks, educational system, plans, confirmation)
- `app/register/page.js` - Student registration (connects to `/api/register`)
- `app/join/page.js` - Team registration (banner image, photo upload, 3 tabs)
- `app/certificate/page.js` - Certificate verification (proxied via `/api/certificate`)
- `app/api/register/route.js` - Student registration API (Supabase + Brevo)
- `app/api/join/route.js` - Team registration API (Supabase)
- `app/api/certificate/route.js` - Certificate proxy (hides Google Apps Script URL)
- `app/globals.css` - Design system (hero-gradient, glassmorphism, mobile optimizations, animations)
- `components/SiteHeader.js` - Navigation with mobile drawer (tracks link hidden)
- `components/HeroWithHalo.js` - Material Symbols orbiting icons, CSS radial-gradient halo
- `tailwind.config.js` - Theme (primary #4169e1, secondary #fd761a, tertiary #f7be1d, full font scale)
- `next.config.mjs` - Image optimization (AVIF/WebP, device/sizes), serverActions
- `lib/security.js` - Security utility (rate limiting, CSRF, validation, sanitization)

## Design System
- **Colors**: Royal blue gradient (#6b8aff → #1a3fa0), NOT dark #1e3a8a
- **Track cards**: Green (Track A), Blue (Track B), Purple (Track C)
- **Hero backgrounds**: `/hero-bg.jpg` (homepage), `/join-banner.jpg` (join), `/tracks-banner.jpg` (tracks)
- **Mobile**: Fonts scaled ~40-50%, border-radius reduced, padding/spacing reduced, animations slowed

## Mobile Typography (globals.css overrides)
- text-7xl: 72→36px, text-6xl: 60→30px, text-5xl: 48→26px, text-4xl: 36→24px
- text-3xl: 30→22px, text-2xl: 24→20px
- text-headline-xl: 32→22px, text-headline-lg: 24→18px, text-headline-md: 20→16px
- text-display-lg: 48→30px, text-display-lg-mobile: 36→26px, text-body-lg: 18→14px
- All @media (max-width: 767px) with !important

## Supabase Tables
- `student_registrations` - Student registration data
- `team_applications` - Team (trainer/specialist/admin) applications

## Code Conventions
- Arabic RTL site with Tajawal (display) + Cairo (body) + Poppins (English)
- Mobile-first responsive design (16px margin, 44px touch targets)
- Forms use `name` attributes + FormData API for collection
- API routes use direct Supabase REST API (no client library)
- Error messages displayed inline with red border-left styling
- Loading states on submit buttons
- All emojis replaced with Material Symbols icons
- Orbit animation: z-index=10 (above image z-index=5), CSS radial-gradient halo
- `prefers-reduced-motion` support for animations

## Important Notes
- DO NOT delete `.vercel/` directory or API routes
- WhatsApp number: `201062540164`
- Email: `info@tka-egypt.com`
- Facebook: `https://www.facebook.com/TKA.Egypt/`
- GitHub: `emam2025/Tech-Makers`
- White logo (`w- logo.png`) for footer only
- Total public/ ~2.6MB (optimized from ~7.3MB)
