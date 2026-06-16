---
name: TKA-Egypt Institutional Identity
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#172131'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c3647'
  on-tertiary-container: '#959fb3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#d9e3f9'
  tertiary-fixed-dim: '#bdc7dc'
  on-tertiary-fixed: '#121c2c'
  on-tertiary-fixed-variant: '#3d4759'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is engineered to project **authority, academic excellence, and institutional trust**. It targets educational administrators and students within the Egyptian market, requiring a sophisticated balance between a high-end corporate SaaS aesthetic and a functional management tool.

The visual style follows a **Modern Enterprise** approach: 
- **Precision:** Clean, geometric alignments that reflect organized data.
- **Clarity:** Generous whitespace to reduce cognitive load in complex administrative tasks.
- **Trust:** A "Safe" aesthetic using deep blues and high-quality typography to ensure users feel the system is robust and secure.
- **Bilingual Focus:** The interface is designed to be bi-directional (LTR/RTL), ensuring visual parity between English and Arabic scripts.

## Colors
The palette is rooted in a **Professional Navy** (#1A365D) to establish immediate credibility. 

- **Primary (Navy):** Used for navigation, primary actions, and headers to anchor the experience.
- **Secondary (Academy Gold):** A refined gold (#C5A059) used sparingly for highlights, "excellence" markers, and specific calls to action that signify growth.
- **Neutrals:** A range of cool-toned grays are used for background surfaces and borders to maintain a "clean-room" feel.
- **Semantic Colors:** High-contrast tokens for status badges (Active/Green, Pending/Orange, Expired/Red) follow international accessibility standards for legibility against white backgrounds.

## Typography
This design system utilizes **IBM Plex Sans** (and its Arabic counterpart) for its systematic, engineering-led aesthetic. It provides exceptional legibility for data-heavy tables and administrative forms.

- **Headlines:** Use Bold or Semi-Bold weights with slight negative letter-spacing to feel compact and authoritative.
- **Body Text:** Standardized at 16px for optimal readability across all ages of staff and students.
- **Bilingual Alignment:** Ensure the `line-height` is slightly increased (approx 1.5x - 1.6x) when rendering Arabic script to accommodate the taller ascenders and descenders of the Almarai or Plex Arabic characters.

## Layout & Spacing
The layout uses a **Fixed-Fluid Hybrid Grid**. 
- **Desktop:** A 12-column grid with a maximum container width of 1440px. Gutters are fixed at 24px to ensure data clarity in tables.
- **Sidebar:** A fixed-width navigation (280px) on desktop, collapsing into a bottom-navigation or "hamburger" drawer on mobile.
- **Rhythm:** An 8px linear scale is strictly followed. Components use `24px` (md) for internal padding to maintain a "breathable" and high-end feel.

## Elevation & Depth
Depth is created using **Tonal Layers** rather than heavy shadows to maintain a modern, flat-plus feel.
- **Level 0 (Background):** Neutral Gray (#F7FAFC).
- **Level 1 (Cards/Sidebar):** Pure White (#FFFFFF) with a 1px border (#E2E8F0).
- **Level 2 (Hover/Active):** A very soft, diffused shadow (0px 4px 12px rgba(26, 54, 93, 0.05)) to indicate interactivity.
- **Overlays:** Modals and dropdowns use a crisp 1px border and a medium ambient shadow to separate them from the main management canvas.

## Shapes
The design system employs a **Rounded** (8px to 12px) shape language.
- **Buttons & Inputs:** 8px (0.5rem) corner radius to feel modern but structured.
- **KPI Cards:** 16px (1rem) corner radius to create a softer, more distinct container for high-level data.
- **Status Badges:** Fully rounded (pill) to distinguish them from interactive buttons.

## Components
- **KPI Cards:** White background, 1px border, containing a Primary-colored icon, a Large Headline for the metric, and a small Body-sm label.
- **DataTables:** No vertical borders. Use thin horizontal separators. Headers should be `label-md` with a subtle gray background. Rows should have a light blue (#EDF2F7) hover state.
- **Buttons:** 
  - *Primary:* Navy background, White text.
  - *Secondary:* Gold background, Navy text (for high-value actions).
  - *Ghost:* No background, Navy border.
- **Status Badges:** Small, uppercase text with a low-opacity background of the status color (e.g., Active has 10% green background, 100% green text).
- **Sidebar:** Dark Navy background (#1A365D). Active links use the Gold (#C5A059) as a vertical "indicator" bar on the leading edge.
- **Form Inputs:** 1px gray border that transitions to a 2px Navy border on focus, providing clear visual feedback for administrative data entry.