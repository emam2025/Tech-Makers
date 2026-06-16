---
name: TKA Digital Nexus
colors:
  surface: '#101418'
  surface-dim: '#101418'
  surface-bright: '#36393f'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#181c21'
  surface-container: '#1d2025'
  surface-container-high: '#272a2f'
  surface-container-highest: '#32353a'
  on-surface: '#e0e2e9'
  on-surface-variant: '#c0c7d3'
  inverse-surface: '#e0e2e9'
  inverse-on-surface: '#2d3136'
  outline: '#8b919c'
  outline-variant: '#414751'
  surface-tint: '#9fcaff'
  primary: '#9fcaff'
  on-primary: '#003259'
  primary-container: '#4894e2'
  on-primary-container: '#002b4e'
  inverse-primary: '#0061a5'
  secondary: '#ffffff'
  on-secondary: '#003737'
  secondary-container: '#00fbfb'
  on-secondary-container: '#007070'
  tertiary: '#ddb7ff'
  on-tertiary: '#4a0080'
  tertiary-container: '#b175ea'
  on-tertiary-container: '#400070'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#9fcaff'
  on-primary-fixed: '#001d37'
  on-primary-fixed-variant: '#00497e'
  secondary-fixed: '#00fbfb'
  secondary-fixed-dim: '#00dddd'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0050'
  on-tertiary-fixed-variant: '#622599'
  background: '#101418'
  on-background: '#e0e2e9'
  surface-variant: '#32353a'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  code-snippet:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
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
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The brand personality is **Electric, Visionary, and Kinetic**. It positions the academy as a high-velocity launchpad for the next generation of tech leaders in Egypt. The visual direction merges **Modern Tech** with **Futuristic Digital** aesthetics, moving away from static corporate styles toward an environment that feels "always-on" and hyper-innovative.

The design style utilizes a hybrid of **Glassmorphism** and **High-Contrast Boldness**. It features frosted surfaces, vibrant background blurs, and glowing interactive elements that simulate a digital cockpit or an advanced learning hub. The emotional goal is to evoke a sense of momentum, technical mastery, and elite academic energy.

## Colors

The palette is optimized for a **Dark Mode** first experience to maximize the "glow" of tech-forward elements.

- **Primary (Electric Blue):** The core brand color, evolved into a vibrant, high-saturation blue that represents authority and digital fluency.
- **Secondary (Neon Cyan):** Used for data visualization, highlights, and glowing borders to provide a "circuit-ready" feel.
- **Tertiary (Deep Indigo):** Serves as the foundation for container depths and subtle background layering.
- **Action Orange:** A high-visibility, aggressive orange reserved strictly for Primary CTAs and critical conversion points to inject energy.
- **Neutral:** A range of deep "Space Grays" (blue-tinted grays) to maintain a cohesive tech aesthetic without appearing flat.

## Typography

This design system utilizes **IBM Plex Sans** (with Arabic support) as the primary typeface to maintain its technical heritage while pushing weights to their limits for impact. 

- **Headlines:** Use Bold (700) or Semi-Bold (600) weights to convey strength. For Arabic script, ensure line heights are slightly increased (+10-15%) compared to Latin counterparts to prevent clipping of descenders.
- **Labels:** We introduce **Geist** for utility labels and micro-copy to provide a precise, developer-centric feel.
- **Scale:** High contrast between Display and Body sizes is encouraged to create a clear information hierarchy in data-heavy academy dashboards.

## Layout & Spacing

The layout is based on a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. 

- **The Technical Grid:** Use a subtle background pattern—a 32px square grid with 1px low-opacity lines (#FFFFFF05)—to reinforce the "digital blueprint" aesthetic.
- **Sectioning:** Use generous vertical padding (`xl`) to separate major learning modules, allowing the glassmorphic cards room to "breathe."
- **Safe Areas:** Maintain a minimum 24px side margin on mobile to ensure content does not hit the edge of the device, preserving the "floating" UI feel.

## Elevation & Depth

Depth is not created with traditional black shadows, but through **Tonal Layering** and **Ambient Glows**.

- **Surface Levels:** 
    - *Level 0 (Background):* Deep Indigo (#0A0E17).
    - *Level 1 (Cards):* Semi-transparent dark fills (White at 5% opacity) with a 20px Backdrop Blur.
    - *Level 2 (Modals/Popovers):* Slightly lighter glass (White at 10% opacity) with a more intense blur.
- **Ambient Shadows:** Instead of gray, use low-opacity Primary Blue or Indigo shadows (e.g., `0 20px 40px rgba(49, 130, 206, 0.15)`).
- **Glow Borders:** Use 1px internal strokes with linear gradients (Cyan to Transparent) to simulate "lit" edges on active components.

## Shapes

The design system adopts a **Rounded (0.5rem / 8px - 12px)** approach to balance the "friendly" nature of an academy with the "precision" of technology.

- **Standard Elements:** Use a 12px radius for cards and main containers to soften the high-tech edge.
- **Interactive Elements:** Buttons and Inputs follow the 12px rule.
- **Specialty Shapes:** Use "Cut-corner" effects (45-degree clips) sparingly on decorative accents or badge containers to lean into the futuristic/military-tech aesthetic.

## Components

- **Buttons:** 
    - *Primary:* Electric Blue gradient with a subtle outer glow on hover.
    - *Action:* "Action Orange" gradient with high-contrast white text for enrollment or urgent tasks.
    - *Glass:* Ghost buttons with a 1px Cyan border and backdrop blur.
- **Cards (Course/Module):** Feature a 1px top-left "light leak" stroke (Cyan) and a 20px backdrop blur. Background should be `rgba(255, 255, 255, 0.05)`.
- **Inputs:** Dark backgrounds with a bottom-only 2px border that glows Neon Cyan when focused.
- **Chips/Badges:** Use Neon Cyan text on a very low-opacity cyan fill. For "Live" or "Urgent" status, use Action Orange with a pulsing animation.
- **Progress Bars:** Dual-layered—a dark track with a glowing Electric Blue fill that features a moving "shimmer" effect to indicate active progress.
- **Circuit Decor:** Decorative 1px lines with 4px circular "nodes" at the ends, used to connect related pieces of information or as background motifs.