---
name: Royal Institutional
colors:
  surface: '#f9f9ff'
  surface-dim: '#d0daf0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d9e3f9'
  on-surface: '#121c2c'
  on-surface-variant: '#414751'
  inverse-surface: '#273141'
  inverse-on-surface: '#ebf1ff'
  outline: '#717782'
  outline-variant: '#c0c7d3'
  surface-tint: '#0061a5'
  primary: '#005ea1'
  on-primary: '#ffffff'
  primary-container: '#2178c3'
  on-primary-container: '#fdfcff'
  inverse-primary: '#9fcaff'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#845000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36712'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#9fcaff'
  on-primary-fixed: '#001d37'
  on-primary-fixed-variant: '#00497e'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#ffb866'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#f9f9ff'
  on-background: '#121c2c'
  surface-variant: '#d9e3f9'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
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
    letterSpacing: 0.05em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

The design system is built upon a foundation of authority, modernism, and regional prestige. It balances the robust nature of an institutional entity with the clean, airy aesthetics of contemporary digital products. The brand personality is professional and reliable, yet dynamic enough to feel forward-thinking.

The style is **Corporate / Modern**. It leverages a generous use of whitespace to reduce cognitive load and emphasize content hierarchy. The visual language moves away from heavy, dated blocks in favor of light-weight containers, subtle depth, and high-contrast interactions. This creates an environment that feels spacious, organized, and premium.

## Colors

The palette is dominated by **Royal Blue (#3182ce)**, serving as the primary anchor for all high-intent actions, active states, and navigation headers. This vibrant blue provides a sense of energy and modern professionalism.

**Gold/Sand (#d4af37)** is utilized strictly as an accent color for celebratory details, secondary status indicators, or subtle decorative borders to acknowledge heritage without overwhelming the modern aesthetic.

The background uses a pure white or very light cool grey (#f7fafc) to maximize contrast. Text and iconography utilize a range of slate and charcoal tones to ensure WCAG AA/AAA compliance while maintaining a softer feel than pure black.

## Typography

The design system exclusively utilizes **IBM Plex Sans** (with full support for Arabic scripts) to provide a systematic, technical, yet highly legible experience. 

- **Headlines:** Use Bold or SemiBold weights to create a strong visual anchor. The primary Royal Blue can be applied to H2 and H3 levels to reinforce brand presence.
- **Body Text:** Focused on readability with a comfortable 1.5x line height. Use the Slate/Neutral tones for body text to maintain high contrast against white backgrounds.
- **Arabic Context:** Ensure that line-height is monitored carefully when switching to Arabic scripts, as the glyph heights may require an additional 10-15% vertical clearance compared to Latin characters.

## Layout & Spacing

This design system follows a **Fixed-Fluid hybrid grid**. Content is contained within a 1280px max-width wrapper on desktop, centered with wide margins to create a focused, premium feel.

- **Desktop:** 12-column grid with 24px (1.5rem) gutters.
- **Tablet:** 8-column grid with 24px gutters and 32px side margins.
- **Mobile:** 4-column grid with 16px (1rem) gutters and 16px side margins.

Vertical rhythm is strictly 8px-based. Components should use generous internal padding (e.g., 16px or 24px) to emphasize the "Modern & Professional" aesthetic through increased whitespace.

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and clean tonal layering. 

- **Level 1 (Cards/Inputs):** A very soft, wide-dispersion shadow (0px 2px 10px rgba(0,0,0, 0.05)) to lift elements off the background without creating harsh edges.
- **Level 2 (Dropdowns/Modals):** A more pronounced shadow (0px 10px 25px rgba(0,0,0, 0.1)) to indicate high-priority interaction layers.
- **Outlines:** Use 1px borders in a light grey (#E2E8F0) for inactive states, switching to a 2px Royal Blue border for focused or active states. This ensures structural clarity even when shadows are subtle.

## Shapes

The design system employs a **Soft** shape language. This provides a professional "edge" that is approachable but not overly casual. 

- **Standard Elements:** 0.25rem (4px) border radius for buttons, inputs, and small widgets.
- **Containers:** 0.5rem (8px) for cards and main content modules.
- **Large Sections:** 0.75rem (12px) for modals and large surface areas.

## Components

- **Buttons:** Primary buttons use a solid Royal Blue background with white text. Hover states should darken the blue slightly. Secondary buttons use a Royal Blue outline with a transparent background.
- **Navigation:** Top navigation bars should utilize a white background with a subtle bottom border. Active links are indicated by a 3px Royal Blue bottom bar or a Bold Royal Blue font weight.
- **Inputs:** Form fields feature a light grey border and a 4px corner radius. Upon focus, the border transitions to 2px Royal Blue with a soft blue outer glow (3px spread).
- **Cards:** Cards are white with a Level 1 ambient shadow. Content within cards should have at least 24px of padding to maintain the "Modern & Professional" airy feel.
- **Chips/Badges:** Use light tints of the primary color (e.g., Royal Blue at 10% opacity) with dark Royal Blue text for status indicators. Gold/Sand accents are reserved for "Special" or "Premium" status chips.
- **Lists:** Clean, borderless list items separated by subtle horizontal dividers (1px, #EDF2F7).