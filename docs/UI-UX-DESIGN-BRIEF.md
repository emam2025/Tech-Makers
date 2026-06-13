# Tech Makers Egypt — UI/UX Design Brief

> **Project:** Tech Makers Egypt (تك ميكرز)
> **Domain:** tka-egypt.com
> **Framework:** Next.js 16 (App Router) + React 19
> **Language:** Arabic (RTL)
> **Status:** Live — needs UI/UX redesign

---

## 1. Sitemap

```
tka-egypt.com
├── /                         # الصفحة الرئيسية (Landing Page)
├── /about                    # من نحن (About Us)
├── /certificate              # التحقق من الشهادة (Certificate Verification)
├── /join                     # انضم إلينا (Join the Team)
├── /register                 # تسجيل الطالب (Student Registration)
├── /tracks                   # المسارات التعليمية (Learning Tracks)
└── /api/register             # API endpoint (POST — not a page)
```

---

## 2. Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| Royal Blue | `#1e3a8a` | Primary brand, buttons, headings |
| Royal Blue Deep | `#172554` | Dark headings, gradient sections |
| Royal Blue Light | `#3b5bb5` | Button gradients, hover states |
| Yellow Orange | `#fbbf24` | Accent, ribbons, CTAs |
| Yellow Orange Deep | `#f59e0b` | Deeper accent, highlights |
| Yellow Soft | `#fde68a` | Light backgrounds on dark areas |
| White | `#ffffff` | Cards, backgrounds |
| Off White | `#f8fafc` | Page backgrounds |
| Ink | `#0f172a` | Body text |
| Muted | `#64748b` | Secondary text |
| Line | `#e2e8f0` | Borders, dividers |
| Green | `#16a34a` | Success states |
| Red | `#dc2626` | Error states |

### Fonts

| Font | Weights | Usage |
|---|---|---|
| **Cairo** | 400, 600, 700, 800, 900 | Primary body + headings |
| **Tajawal** | 500, 700, 800, 900 | Secondary accent text |

### Spacing

| Token | Value |
|---|---|
| Container max-width | 1200px |
| Section padding | 80–100px top/bottom |
| Border radius (default) | 18px |
| Border radius (large) | 28px |
| Card shadow | 0 12px 30px rgba(30,58,138,0.12) |

---

## 3. Page-by-Page Details

---

### 3.1 Homepage (`/`)

**Goal:** Convert visitors into registrations. Showcase program value.

#### Section 1 — Hero
- **Layout:** Two columns (text left / right decorative)
- **Left column:**
  - Badge: "🌟 Tech Makers Egypt"
  - Main heading (gradient text): "من مستهلك للتكنولوجيا إلى صانع ومطور وقائد"
  - Tagline: "Tech Makers • Building Future Tech Leaders"
  - Paragraph describing the program
  - Focus areas (5 items with checkmarks)
  - CTA buttons: "سجّل الآن" (primary) → `/register` | "استكشف المسارات" (ghost) → `/#tracks`
- **Right column (desktop only):**
  - Animated blob shape (border-radius morph)
  - Floating age badges: 8–11, 12–15, 16–20 (orbital animation)
  - Floating text badges: "تفكير منطقي", "ذكاء اصطناعي", "مشاريع حقيقية"
- **Mobile:** Right column hidden, text stacks full width

#### Section 2 — Pillars (عن Tech Makers)
- **Layout:** 4 cards in a grid (2×2 on desktop, 1 column on mobile)
- **Cards (numbered 01–04):**
  1. التفكير المنطقي 🧠
  2. الإبداع الرقمي 🎨
  3. التعلم بالمشاريع 🛠️
  4. التعرض المبكر للـ AI 🤖
- **Interaction:** Hover → card lifts, top gradient bar reveals, icon scales

#### Section 3 — Outcomes (النتائج المتوقعة)
- **Layout:** 7 cards in a grid (3 columns, last card full width)
- **Cards feature:** Hover lift with gradient bar

#### Section 4 — Tracks Intro (المسارات التعليمية)
- **Layout:** 3 track cards in a row
- **Tracks:**
  - **A** (8–11): Junior Tech Explorers — blue accent
  - **B** (12–15): Future AI Engineers — orange accent
  - **C** (16–20): Future Tech Engineers — purple accent
- **Interaction:** Click → `/tracks?track=a|b|c`

#### Section 5 — Students (طلابنا)
- **Layout:** Grid of student cards with photo, name, certificate number, result

#### Section 6 — Add-ons (المزيد من القيمة)
- **Layout:** 4 cards in a grid
  - Techno Math 🧠 (badge: "إضافة مستقلة")
  - Tech English 🗣️ (badge: "إضافة مستقلة")
  - إخصائي سلوكي 🛡️ (badge: "مضمّن")
  - مدعوم من TKA-Egypt 💙

#### Section 7 — Plans/Pricing (خطط الاشتراك)
- **Layout:** 3 plan cards side by side
  - **Monthly:** 1200 ج.م/شهر
  - **Quarterly:** 890 ج.م/شهر (⭐ الأكثر اختيارًا) — ribbon badge
  - **Yearly:** 690 ج.م/شهر (🏆 الأوفر) — dark gradient bg, slightly larger
- **Interaction:** Click → `/register?plan=xxx`

#### Section 8 — FAQ (الأسئلة الشائعة)
- **Layout:** Vertical accordion list (6 items)
- **Interaction:** Click question → expand/collapse with ＋/− toggle
- **Default:** First item open

#### Section 9 — CTA
- **Layout:** Dark blue gradient background, heading, paragraph, two buttons
- **Buttons:** "سجّل الآن" (primary) | "استكشف المسارات" (ghost)

---

### 3.2 About Page (`/about`)

**Goal:** Build trust. Tell the story of Tech Makers.

#### Section 1 — Hero
- **Background:** Animated tech elements (twinkling stars, moving lines, pulsing circles, binary code)
- **Content:** Title "نبني جيل عربي قادر على صناعة التكنولوجيا" + subtitle

#### Section 2 — Vision & Mission
- **Layout:** Two cards side by side
  - 🔭 رؤيتنا (Vision) — blue hover border
  - 🎯 رسالتنا (Mission) — orange hover border

#### Section 3 — Goals (6 cards numbered 01–06)
- **Layout:** Grid of 6 cards, orange hover effect

#### Section 4 — Founder (كلمة المؤسس)
- **Layout:** Two columns
  - **Left:** Founder photo in circular frame with animated yellow blob background
  - **Right:** Founder message + signature block
- **Founder details:** م/ إمام عبد العزيز — بكالريوس نظم المعلومات، ماجستير هندسة البرمجيات جامعة القاهرة

#### Section 5 — CTA (same as homepage)

---

### 3.3 Certificate Page (`/certificate`)

**Goal:** Allow students/parents to view or verify certificates.

#### Section 1 — Hero
- Badge + title "تحقق من صحة شهادتك"

#### Section 2 — Certificate Interface
- **Tab system (pill-shaped buttons):**
  - 📜 عرض الشهادة (View)
  - 🔍 التحقق من الشهادة (Verify)
- **View Tab:**
  - Input: الرقم القومي (14 digits)
  - Button: "عرض الشهادة"
  - Result: Styled certificate preview with logo, student name, course, signatures, download/print buttons
- **Verify Tab:**
  - Input: رقم الشهادة
  - Button: "التحقق من الشهادة"
  - Result: Green success card ✅ or red error card ❌ with student details

---

### 3.4 Join Page (`/join`)

**Goal:** Attract trainers, specialists, and admins.

#### Section 1 — Hero
- Dark blue gradient background
- Title "كن جزءاً من فريق Tech Makers"

#### Section 2 — Why Join (4 cards)
- بيئة عمل مرنة 🌱 | تدريب مستمر 📚 | فريق شغوف 🤝 | نمو مهني 🚀

#### Section 3 — Forms (3 tabs)
- **Tab buttons:** 👨‍🏫 مدرب | 🧑‍⚕️ اخصائي | 📋 اداري
- **Each form has 7 fields:** name, email, phone, country, specialization/department, experience, LinkedIn, about you
- **Interaction:** Tab switch changes form, no actual API submission yet

#### Section 4 — Contact Info (3 cards)
- 📧 info@techmakers.eg
- 📱 WhatsApp number
- 🌐 @TechMakersEgypt

---

### 3.5 Register Page (`/register`)

**Goal:** Enroll students. This is the main conversion page.

#### Section — Registration Form
- **Header:** Badge + title "نموذج تسجيل طالب"
- **Top row:** Track dropdown (A/B/C) + Plan dropdown (Monthly/Quarterly/Yearly) — pre-filled from URL params
- **Name fields (3 in a row):** الاسم الأول، اسم الأب، اسم العائلة — letters only validation
- **Birth date:** Date input, validates age 8–20
- **Parent email:** Email with format validation
- **Phone & WhatsApp:** Egyptian format `01[0-9]{9}`
- **Grade:** Dropdown (2–12)
- **Country:** Dropdown (20 Arab countries)
- **Governorate:** Conditional — dropdown (29 Egyptian governorates) if Egypt, else text input
- **City:** Text input
- **Note box:** Interview + test + free session message
- **Submit button:** "✅ تسجيل الطالب"

#### Success State (after submission)
- ✅ Large checkmark
- Title: "تم تسجيل الطالب بنجاح!"
- Message about interview scheduling
- Buttons: "العودة للصفحة الرئيسية" | "تسجيل طالب آخر"

#### Validation
- All fields validated client-side with inline error messages (`<span class="field-error">`)
- Server-side duplicate check (name + email) via API
- Form-level errors shown in red banner

---

### 3.6 Tracks Page (`/tracks`)

**Goal:** Showcase the learning journey for each track.

#### Section 1 — Space Journey (hidden until track selected)
- **Background:** Dark space theme (`#0a0a1a`) with twinkling stars
- **Progress bar:** Shows current step / total
- **Step indicators:** Dot navigation with labels
- **Step content (one at a time):**
  - Each step shows: badge, title, description, gains list, achievement banner
  - Animated icons per step: 🚀 rocket → 🪐 planet → 🛰️ satellite → 🏆 trophy → 🛸 UFO (Track C only)
- **Navigation:** "التالي ←" and "→ السابق" buttons
- **Last step:** "عرض الباقات ←" button → shows pricing plans

#### Track Details

| Track | Ages | Levels | Length |
|---|---|---|---|
| A (Junior Tech Explorers) | 8–11 | 4 levels | 1 year |
| B (Future AI Engineers) | 12–15 | 4 levels | 1 year |
| C (Future Tech Engineers) | 16–20 | 5 levels (4 + specialization year) | 2 years |

#### Section 2 — Plans (same as homepage, shown after journey)
- Links include track param: `/register?plan=monthly&track=a`

---

## 4. Shared Components

### Header
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] TKA-Egypt    [Nav Links]          [CTA Button]  │
│              مدعوم جزئياً من TKA-Egypt                   │
└─────────────────────────────────────────────────────────┘
```
- **Sticky** with backdrop blur
- **Desktop:** Logo left, nav center, CTA button right
- **Mobile:** Hamburger icon → slides in drawer from right (280px) with nav links + CTA
- **Bottom funding strip:** Blue gradient with animated dot

### Nav Links
- تك ميكرز → `/`
- من نحن → `/about`
- التحقق من الشهادة → `/certificate`
- انضم الينا → `/join`

### Footer
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] TKA-Egypt    © 2026 Tech Makers Egypt — ...     │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| > 768px | Desktop: multi-column grids, hero side image, horizontal nav |
| ≤ 768px | Tablet: 2-column grids, hamburger nav, hidden hero side image |
| ≤ 480px | Mobile: single column, stacked cards, smaller fonts, stacked buttons |

---

## 6. Animations Reference

| Animation | Duration | Location |
|---|---|---|
| Blob morph | 12s infinite | Hero + Founder images |
| Orbital float | 6s infinite | Hero age badges |
| Star twinkle | 3s infinite | About hero |
| Line scroll | 8s linear infinite | About hero |
| Rocket bounce | 2s infinite | Track step 1 |
| Planet float+rotate | 4s infinite | Track step 2 |
| Satellite slide | 3s infinite | Track step 3 |
| Trophy pulse | 1s infinite | Track step 4 |
| Entrance fade-in | 0.4–0.8s | All sections on scroll |

---

## 7. Design Requirements for Designer

Please provide Figma/XD designs covering:

### Required Screens
1. **Homepage** — full length, all 9 sections
2. **About page** — including founder section layout
3. **Certificate page** — both tabs + certificate preview
4. **Join page** — all 3 form variants
5. **Register page** — form + success state
6. **Tracks page** — space journey with progress + step content
7. **Mobile versions** — at least: homepage hero, register form, nav drawer

### Design Freedom
- Feel free to propose a new logo if needed
- Can suggest alternative color palette (keep royal blue + yellow as base)
- Can propose illustration style for hero/tracks
- Can redesign the certificate layout
- Can propose icon set (currently using emoji — prefer SVG icons)
- Can redesign card layouts, button styles, form fields
- Can propose new font pairings (must support Arabic well)

### Constraints
- Must be RTL-first (Arabic language)
- Must be implementable in React/Next.js (CSS modules or Tailwind-capable)
- Must work in all modern browsers (Chrome, Firefox, Safari)
- Keep animations lightweight (CSS-only preferred, no heavy JS animation libs)

### Files to Deliver
- `.fig` or `.xd` source files
- Exported assets (SVG icons, illustrations, logo variations)
- Typography scale
- Component states (hover, active, disabled, error, loading, empty)
- Responsive adaptations for mobile

---

## 8. Current Files Reference

| File | Description |
|---|---|
| `app/page.js` | Homepage (429 lines) |
| `app/about/page.js` | About page (146 lines) |
| `app/certificate/page.js` | Certificate page (228 lines) |
| `app/join/page.js` | Join page (326 lines) |
| `app/register/page.js` | Register page (322 lines) |
| `app/tracks/page.js` | Tracks page (451 lines) |
| `app/layout.js` | Root layout (header + footer) |
| `components/HeaderNav.js` | Navigation component |
| `app/globals.css` | All styles (3572 lines) |
| `app/api/register/route.js` | Register API |

---

*Prepared for designer — June 2026*
