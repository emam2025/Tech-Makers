---
name: TKA-Egypt Identity
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
  on-surface-variant: '#414751'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
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
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
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
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The brand personality is professional, authoritative, and modern, reflecting a sense of reliability and technological advancement within the Egyptian market. The target audience includes corporate stakeholders, government entities, and professional users who value efficiency and clarity. 

The design style is **Corporate / Modern**. It prioritizes high readability and a systematic hierarchy. The UI evokes an emotional response of trust and precision through a clean, structured layout that balances "Royal Blue" stability with "Vibrant Orange" energy. The interface avoids unnecessary decoration, focusing instead on functional clarity and a sense of openness.

## Colors
This design system utilizes a high-contrast light mode palette to ensure maximum accessibility. 

- **Primary (Royal Blue):** Used for primary actions, active states, and brand-heavy components. It signifies trust and corporate stability.
- **Secondary (Vibrant Orange):** Used sparingly as a highlight color for call-to-actions, alerts, or status indicators that require immediate attention.
- **Surface & Background:** The main background is pure white (#FFFFFF). Secondary surfaces or "containers within containers" use a very light blue-gray (#EDF2F7 or #F7FAFC) to create subtle visual separation without relying on heavy borders.
- **Typography Colors:** Deep charcoal (#1A202C) is used for headings to ensure a high contrast ratio against the white background.

## Typography
The typography system relies exclusively on **IBM Plex Sans Arabic** to provide a technical yet accessible feel. 

- **Headings:** Use Bold or SemiBold weights to create a strong visual anchor. The line height is kept tight for display sizes and slightly more relaxed for subheadings.
- **Body Text:** Use Regular weight for optimal legibility in long-form content. 
- **Bilingual Support:** The system is designed to handle both Arabic and Latin scripts seamlessly, maintaining vertical alignment across mixed-language strings.
- **Hierarchy:** Dramatic scale differences between display text and body copy are used to guide the user through the information architecture.

## Layout & Spacing
The design system employs a **Fixed Grid** model for desktop and a **Fluid Grid** for mobile.

- **Grid:** A 12-column grid is used for desktop (max-width 1280px) with 24px gutters. On mobile, the grid shifts to 4 columns with 16px side margins.
- **Spacing Rhythm:** All spacing is based on an 8px modular scale. This ensures consistency across padding, margins, and component heights.
- **Vertical Rhythm:** Larger gaps (40px-64px) are used to separate major sections, while smaller gaps (12px-24px) group related elements like headlines and their supporting body text.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Ambient Shadows**. 

1.  **Level 0 (Background):** Pure White (#FFFFFF).
2.  **Level 1 (Cards/Containers):** Pure White with a subtle "Soft Glow" shadow (Offset: 0px 2px, Blur: 4px, Spread: 0, Color: RGBA(0, 0, 0, 0.05)).
3.  **Level 2 (Interactive/Floating):** Used for dropdowns and modals. These feature a more pronounced shadow (Offset: 0px 10px, Blur: 20px, Spread: -5, Color: RGBA(49, 130, 206, 0.1)) to lift the element off the page.

Borders are used minimally, primarily in a light gray (#E2E8F0) to define input fields and secondary card boundaries when they sit on white backgrounds.

## Shapes
The shape language is consistently **Rounded**, using an 8px (0.5rem) base radius.

- **Standard Components:** Buttons, input fields, and small cards use the 8px radius to feel modern and approachable.
- **Large Containers:** Section containers or large cards may use a 16px (1rem) radius to soften the layout.
- **Interactive States:** Focus states should follow the container's corner radius with a 2px offset to maintain the shape language.

## Components
- **Buttons:** Primary buttons are Royal Blue with white text. High-emphasis "Alert" or "CTA" buttons use Vibrant Orange. Secondary buttons use a light blue ghost style or a light gray outline.
- **Input Fields:** Use a 1px border (#E2E8F0) and an 8px radius. On focus, the border transitions to Royal Blue with a subtle blue outer glow.
- **Chips/Badges:** Small, rounded (pill) shapes with low-opacity background tints of the primary or secondary colors (e.g., light blue background with dark blue text).
- **Cards:** Cards should have a white background, the Level 1 shadow, and an 8px radius. Headlines within cards should be bold and primary-colored.
- **Lists:** Use subtle dividers (#EDF2F7) between items. Hover states should utilize a very light blue tint to indicate interactivity.
- **Checkboxes/Radios:** When selected, these components use Royal Blue. Use standard 8px rounding for checkboxes to maintain consistency with the broader shape language.