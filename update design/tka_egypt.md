# TKA-Egypt Visual Identity & Design System Specification

This document serves as the official design reference for the TKA-Egypt Academy Management System and Public Website. It defines the visual language for both **Light Mode** (Institutional) and **Dark Mode** (Tech-forward).

---

## 1. Core Brand Identity
- **Primary Color:** Royal Blue (`#3182ce`) - Used for primary actions, branding, and active states.
- **Accent Color:** Vibrant Orange (`#ed8936`) - Used for highlights, CTAs, and alerts.
- **Typography:** `IBM Plex Sans Arabic`
  - Headings: Bold (700)
  - Body: Regular (400) / Medium (500)

---

## 2. Dual-Theme Specifications

### A. Light Mode (The "Institutional" Look)
*Optimized for clarity, readability, and a formal academic feel.*

| Property | Value | Tailwind Class Equivalent |
|---|---|---|
| Background (Surface) | `#f7fafc` | `bg-surface` |
| Container (Low) | `#ffffff` | `bg-surface-container-low` |
| Primary Text | `#2a4365` | `text-primary` |
| Secondary Text | `#4a5568` | `text-on-surface-variant` |
| Borders/Outline | `#cbd5e0` | `border-outline` |
| Shadows | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | `shadow-md` |

### B. Dark Mode (The "Tech-forward" Look)
*Optimized for energy, immersion, and a futuristic tech-academy feel.*

| Property | Value | Tailwind Class Equivalent |
|---|---|---|
| Background (Surface) | `#101418` | `dark:bg-surface` |
| Container (Low) | `#1a202c` | `dark:bg-surface-container-low` |
| Primary Text | `#f7fafc` | `dark:text-on-surface` |
| Secondary Text | `#a0aec0` | `dark:text-on-surface-variant` |
| Borders/Outline | `#2d3748` | `dark:border-outline` |
| Effects | Glassmorphism / Glow | `backdrop-blur-xl` / `shadow-[0_0_15px_rgba(49,130,206,0.2)]` |

---

## 3. UI Components Standards

### Buttons
- **Primary:** Royal Blue Background (`#3182ce`), White Text. 8px Rounded.
- **Accent:** Orange Background (`#ed8936`), White Text.
- **Ghost/Outline:** Transparent BG, Royal Blue border/text.

### Cards
- **Light:** White background, subtle shadow, 8px border-radius.
- **Dark:** Glassmorphic background (translucent dark blue) with a subtle 1px border.

### Navigation
- **TopBar:** 64px Height. Fixed/Sticky.
- **BottomBar (Mobile):** 80px Height. Rounded-t 16px. Active state uses Accent color or Indicator line.

---

## 4. Iconography
- **Style:** Material Symbols Rounded.
- **Weight:** 400 (Regular).
- **Scale:** 24px (Standard), 20px (Dense UI).

---

## 5. Development Guidelines
- **Framework:** Next.js (App Router).
- **Styling:** Tailwind CSS with custom theme configuration.
- **Language:** Fully RTL (Arabic) with LTR support for code blocks.
- **Accessibility:** Minimum contrast ratio of 4.5:1 for all text.

*This specification is designed to ensure seamless synchronization between design intent and frontend implementation.*
