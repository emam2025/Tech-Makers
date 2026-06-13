---
name: Tech Horizons
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffc329'
  on-secondary-container: '#6f5100'
  tertiary: '#340082'
  on-tertiary: '#ffffff'
  tertiary-container: '#4e05b7'
  on-tertiary-container: '#b89cff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5417be'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  primary-deep: '#172554'
  primary-light: '#3b5bb5'
  accent-deep: '#f59e0b'
  bg-off-white: '#f8fafc'
  text-muted: '#64748b'
typography:
  display-lg:
    fontFamily: Cairo
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
  display-lg-mobile:
    fontFamily: Cairo
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-xl:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Tajawal
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Tajawal
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style
The brand identity for this design system is built on the pillars of **Empowerment, Innovation, and Educational Excellence**. It is specifically tailored for tech-focused youth in Egypt, bridging the gap between traditional academic structures and the high-energy world of modern technology startups. 

The design style follows a **Corporate / Modern** aesthetic with a distinctive **Tactile** edge. It utilizes depth and subtle gradients to move beyond flat design, creating a digital environment that feels physical and trustworthy. By prioritizing RTL (Arabic) optimization and high-quality typography, the system ensures that complex educational information is delivered in a way that feels approachable and inspiring rather than intimidating.

## Colors
This design system utilizes a foundation of **Royal Blue** to convey authority and stability, paired with a vibrant **Yellow Orange** accent to spark creativity and energy.

- **Primary Stack:** Used for core branding, primary actions, and navigational anchors. The "Primary Deep" is reserved for heavy text headers and footers.
- **Accent Stack:** Reserved for call-to-actions (CTAs), progress indicators, and "Success" states to ensure high visibility against the blue tones.
- **Functional Neutrals:** A range of blues-grays are used for text and surfaces to maintain a cohesive cool-toned environment.
- **Gradients:** Subtle linear gradients (135°) from `primary_light` to `primary_color_hex` should be used for hero sections and primary buttons to add depth.

## Typography
Typography is optimized for **Bilingual (Arabic/English) readability**, with a strong focus on the Cairo typeface for its modern geometric structure and excellent legibility in technical contexts.

- **Cairo (Primary):** Used for all major headlines and body copy. Use the 800 weight sparingly for emphasis in display settings.
- **Tajawal (Secondary):** Integrated for labels, tags, and metadata to provide a refined, slightly softer contrast to the geometric weight of Cairo.
- **RTL Considerations:** Line heights are slightly increased compared to standard Latin presets to accommodate the vertical characteristics of Arabic script.

## Layout & Spacing
The layout follows a **Fixed-Width Grid** system for desktop to maintain structural integrity of educational content, transitioning to a **Fluid Grid** for mobile devices.

- **Grid:** A 12-column grid on desktop (1280px max-width) with 24px gutters.
- **Rhythm:** An 8px spacing system is used for component-level layout, while a 4px "base" unit is used for tight internal component spacing.
- **Responsive Behavior:** 
  - **Desktop (1024px+):** 12 columns, 80px margins.
  - **Tablet (768px - 1023px):** 8 columns, 40px margins.
  - **Mobile (<767px):** 4 columns, 20px margins.
- **RTL Flow:** All layouts must be mirrored; sidebars appear on the right, and the progression of "Next/Back" actions follows a right-to-left orientation.

## Elevation & Depth
Depth is used to signify interactivity and content hierarchy through **Ambient Shadows** and **Tonal Layers**.

- **Surface Layers:** The primary background uses `bg-off-white`. Elevated containers (cards, modals) use `White` to create a clear "stack" effect.
- **Shadow Profile:** A signature soft shadow (`0 12px 30px rgba(30,58,138,0.12)`) is applied to all interactive cards and floating menus. This blue-tinted shadow prevents the design from looking "muddy" and maintains the tech-focused color harmony.
- **Hover States:** Interactive elements should increase their elevation on hover, moving from a subtle shadow to the signature shadow while slightly lifting (-4px Y-axis).

## Shapes
The shape language is **distinctively friendly yet structured**. While the system defaults to "Rounded" (0.5rem) for small components like inputs, it utilizes larger, custom radii for primary containers.

- **Standard Radius:** 8px for input fields and small UI controls.
- **Component Radius:** 18px to 28px for cards and major sections to create the "Modern Tech" look requested.
- **Full Rounding:** Pill-shaped rounding is strictly reserved for buttons, tags/chips, and search bars to differentiate them from content containers.

## Components

### Buttons
- **Primary:** Pill-shaped, using the `primary-light` to `primary_color_hex` gradient. White text.
- **Secondary/Action:** Pill-shaped, `secondary_color_hex` (Yellow Orange) with `neutral_color_hex` text.
- **State Changes:** On hover, primary buttons should expand their shadow and gain a subtle inner glow.

### Cards
- **Educational Cards:** White background, 24px padding, 20px border radius.
- **Interactive States:** Use a "Hover Lift" effect where the card moves upward and the shadow deepens. Include a subtle 1px border in `primary_light` (10% opacity) for additional definition.

### Tabs & Accordions
- **Tabs:** Underline style for secondary navigation; pill-shaped container style for primary category switching.
- **Accordions:** Used for FAQs. Use a flat background (`bg-off-white`) for the header and a clean white background for the expanded content to create clear separation.

### Form Fields
- **Inputs:** 8px border-radius, `bg-off-white` background with a subtle inset shadow to appear "carved" into the surface.
- **Focus State:** 2px solid `primary_color_hex` border with a soft blue outer glow.

### Technical Icons
- Use monolinear icons with a 2px stroke. Incorporate a secondary "spot color" from the `secondary_color_hex` palette for small details within the icons to tie them to the brand.