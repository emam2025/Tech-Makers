---
name: Royal Institutional
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
  secondary: '#745a24'
  on-secondary: '#ffffff'
  secondary-container: '#ffdb98'
  on-secondary-container: '#795f27'
  tertiary: '#162132'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b3648'
  on-tertiary-container: '#949fb4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffdea3'
  secondary-fixed-dim: '#e4c281'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5a430d'
  tertiary-fixed: '#d8e3fa'
  tertiary-fixed-dim: '#bcc7dd'
  on-tertiary-fixed: '#111c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '500'
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
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 280px
  gutter-desktop: 32px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is rooted in the "Royal Institutional" aesthetic, tailored for high-stakes governance and administrative excellence. It targets high-level stakeholders, government officials, and institutional managers who require a UI that feels authoritative, stable, and highly organized.

The visual style is a refined **Modern Corporate** approach. It prioritizes clarity and structural integrity over decorative flair. The interface utilizes a "precision-first" philosophy: every element serves a functional purpose, with a focus on information density that remains legible. The emotional response should be one of confidence, security, and institutional permanence.

## Colors
The palette is dominated by **Royal Blue (#1a365d)**, symbolizing trust and authority. A secondary **Gold/Champagne (#c0a062)** is reserved for high-level emphasis, iconography, or subtle accents to reinforce the "Royal" narrative.

The background uses a hierarchy of light neutrals (`#f7fafc` for the base and `#ffffff` for elevated containers) to maintain a clean, professional canvas. Data-heavy tables and management tools must utilize high-contrast text (`#1a202c`) against these backgrounds to ensure maximum accessibility and focus during long periods of use.

## Typography
This design system exclusively employs **IBM Plex Sans** to leverage its technical yet humanistic character. The typeface communicates systematic reliability.

For desktop layouts, we emphasize a clear hierarchy through weight and scale. 
- **Headlines:** Use SemiBold (600) for primary titles to anchor the page.
- **Body:** Standard body text is set to 16px to accommodate complex data reading without eye strain.
- **Data Labels:** Use Medium (500) or SemiBold (600) at 12px-14px for table headers and metadata labels to distinguish them clearly from dynamic content.
- **Monospace:** In management tables, use IBM Plex Mono for ID numbers or specific financial figures to ensure alignment and readability.

## Layout & Spacing
The layout uses a **Fixed-Fluid Hybrid Grid**. Content is housed in a container with a max-width of 1440px to prevent excessive line lengths on ultra-wide monitors.

### Navigation Patterns
- **Public-Facing Pages:** Utilize a horizontal Mega-Menu. The menu should expand to show categorized links with clear iconography, maintaining a "white-glove" service feel.
- **Internal Dashboards:** Implement a permanent left-hand sidebar (280px). The sidebar should be dark-themed (Primary Blue) to separate navigation from the workspace.

### Spacing Rhythm
A 8px base grid is used. For desktop management views, gutters are widened to 32px to provide "visual breathing room" between dense data columns. Margins at the edges of the primary container are set to 48px to create a sense of prestige and focus.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layers and Subtle Outlines** rather than heavy shadows.

- **Level 0 (Base):** The neutral background (`#f7fafc`).
- **Level 1 (Cards/Work Areas):** White surfaces (`#ffffff`) with a 1px border in a soft neutral-gray. This defines the management workspace.
- **Level 2 (Interactive):** When a card or element is hovered, apply a very soft, diffused shadow (15% opacity Primary Blue) to indicate interactivity.
- **Overlays:** Modals and dropdowns use a sharp 1px border and a medium-depth shadow to stand out against the structured grid.

## Shapes
The design system uses **Soft (0.25rem)** roundedness. This subtle curve softens the institutional "hardness" of the grid while maintaining a professional, serious architectural feel. Large containers (like the main dashboard area) may use the `rounded-lg` (0.5rem) token to frame the content elegantly.

## Components
### Buttons
Primary buttons are solid Royal Blue with white text. They should have a minimum width of 120px on desktop to ensure a commanding presence. Secondary buttons use a 1px border in Royal Blue with no fill.

### Management Tables
Tables are the core of the dashboard.
- **Header:** Light gray background with uppercase `label-sm` typography.
- **Rows:** 56px minimum height. Use subtle zebra-striping or a 1px bottom border.
- **Status Chips:** High-contrast backgrounds (e.g., soft green for 'Active') with dark text to ensure visibility against white table rows.

### Input Fields
Inputs must have defined 1px borders. Use a focus state that adds a 2px Royal Blue ring (offset by 1px) to provide clear visual feedback during data entry.

### Cards
Cards are used to group related information. They should not have shadows by default, relying instead on the `#ffffff` fill against the `#f7fafc` background and a light border for definition.