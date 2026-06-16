---
name: TKA Academy System
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dae1'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fa'
  surface-container: '#eceef4'
  surface-container-high: '#e6e8ef'
  surface-container-highest: '#e0e2e9'
  on-surface: '#181c21'
  on-surface-variant: '#414751'
  inverse-surface: '#2d3136'
  inverse-on-surface: '#eff0f7'
  outline: '#717782'
  outline-variant: '#c0c7d3'
  surface-tint: '#0061a5'
  primary: '#005ea1'
  on-primary: '#ffffff'
  primary-container: '#2178c3'
  on-primary-container: '#fdfcff'
  inverse-primary: '#9fcaff'
  secondary: '#944b00'
  on-secondary: '#ffffff'
  secondary-container: '#fe9743'
  on-secondary-container: '#6b3500'
  tertiary: '#864f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#a96400'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#9fcaff'
  on-primary-fixed: '#001d37'
  on-primary-fixed-variant: '#00497e'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ffb783'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#703700'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#f8f9ff'
  on-background: '#181c21'
  surface-variant: '#e0e2e9'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
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
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin: 24px
---

## Brand & Style

The design system is engineered for **TKA-Egypt Academy**, balancing institutional authority with the high-energy pulse of modern technology education. The brand personality is professional yet accessible, designed to evoke a sense of progress, reliability, and technical mastery.

The visual style follows a **Modern Corporate** aesthetic with **Glassmorphic** accents in dark mode. It prioritizes clarity and functional density to cater to students and professionals engaged in intensive learning. The interface utilizes high-quality typography and a structured grid to ensure that complex educational content remains digestible and engaging.

## Colors

The palette is anchored by **Royal Blue**, signifying trust and the academy's technological core, paired with **Vibrant Orange** to highlight interactive elements and calls to action.

- **Light Mode (Institutional/Clean):** Uses a high-contrast ratio between Deep Navy text and crisp white containers to promote readability during long study sessions.
- **Dark Mode (Tech-forward/Immersive):** Employs a deep black-blue foundation to reduce eye strain. Surface containers use subtle borders and backdrop blurs to create a sense of layering and technical sophistication.

## Typography

The design system utilizes **IBM Plex Sans** (with full support for Arabic script) to maintain a systematic and engineered feel. 

Headings are set in **Bold** or **Semi-Bold** to establish a clear information hierarchy and convey authority. Body text uses the **Regular** weight with generous line heights to ensure maximum legibility for educational materials. Letter spacing is slightly tightened on large displays for a more modern, "locked-in" appearance, while smaller labels use increased tracking for clarity.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The spacing logic is built on a **16px base unit**, ensuring mathematical harmony across all components.

- **Desktop:** 24px gutters and margins. Content is generally capped at a 1280px max-width for optimal reading comfort.
- **Tablet:** 16px gutters and margins. Sidebars transition to off-canvas overlays.
- **Mobile:** 16px margins with 12px vertical rhythm between smaller components.

Vertical rhythm follows a strict 8px incremental scale, providing a dense but organized feel suitable for data-heavy educational dashboards.

## Elevation & Depth

Hierarchy is established through a combination of tonal shifts and elevation effects that vary by color mode:

- **Light Mode:** Uses "Ambient Shadows"—soft, diffused shadows with a very low opacity (e.g., 4-8% alpha) tinted with the Primary Navy color. This gives the "Surface-container" levels a physical, lifted appearance against the Off-white background.
- **Dark Mode:** Relies on "Tonal Layers" and "Glassmorphism." Instead of heavy shadows, depth is created by making elevated surfaces slightly lighter (#1a202c) and adding a 1px subtle border (#2d3748). Key overlays (like modals) use a backdrop blur (12px) to maintain context.

## Shapes

The shape language is consistently **Rounded (8px)**. This radius is applied to buttons, input fields, and cards to create a modern and approachable feel that softens the "technical" nature of the academy. 

- **Small elements (Chips/Tags):** Use a 4px radius for a sharper, more precise look.
- **Large elements (Modals/Hero Sections):** Utilize the `rounded-xl` (24px) token to create distinct visual containers.

## Components

### Buttons
- **Primary:** Royal Blue background with white text. High-emphasis, 8px radius.
- **Secondary:** Vibrant Orange. Used strictly for "Action" items like "Enroll Now" or "Submit."
- **Ghost:** Transparent background with Royal Blue border and text, used for secondary navigation.

### Inputs & Form Fields
Fields use a 1px border. In Light Mode, the border is Cool Gray; in Dark Mode, it is a semi-transparent white. Focus states always utilize a 2px Royal Blue ring.

### Cards
Cards are the primary container for course content. They feature the standard 8px radius. In Light Mode, they have a soft shadow; in Dark Mode, they feature a subtle 1px border and a slightly elevated background color.

### Chips & Badges
Used for course categories or status (e.g., "In Progress," "Certified"). These use a 4px radius and "Muted" versions of the primary/secondary colors (e.g., a light blue background with dark blue text).

### Progress Bars
A critical component for the Academy. These utilize the Vibrant Orange for the "fill" to provide high-contrast feedback against the Royal Blue or Gray track.