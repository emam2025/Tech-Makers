# TKA-Egypt Academy Management System — Design System & Screen Architecture

> **Version:** 1.0  
> **Date:** 2026-06-14  
> **Status:** Implementation-Ready Blueprint  
> **Inspired by:** Stripe, Notion, Linear, Vercel Dashboard

---

# PART 1 — DESIGN SYSTEM (CORE UI FOUNDATION)

---

## 1. Design Tokens

### 1.1 Color System

```css
:root {
  /* ── Brand ── */
  --color-primary:        #4169E1;    /* Royal Blue — main brand */
  --color-primary-hover:  #3658C8;
  --color-primary-active: #2D4AB0;
  --color-primary-light:  #EEF2FF;    /* 5% opacity for backgrounds */
  --color-primary-muted:  #C7D2FE;    /* 20% for borders/tags */

  --color-secondary:      #FD761A;    /* Orange — secondary actions */
  --color-secondary-hover:#E86A12;
  --color-secondary-light:#FFF4ED;

  --color-tertiary:       #F7BE1D;    /* Gold — highlights, CTAs, badges */
  --color-tertiary-hover: #E5AE0F;
  --color-tertiary-light: #FFFBEB;

  /* ── Neutral ── */
  --color-bg:             #F9FAFB;    /* Page background */
  --color-surface:        #FFFFFF;    /* Card / panel background */
  --color-surface-dim:    #F3F4F6;    /* Secondary surface */
  --color-surface-hover:  #F9FAFB;    /* Hover state */

  --color-border:         #E5E7EB;    /* Default border */
  --color-border-subtle:  #F3F4F6;    /* Subtle separators */
  --color-border-strong:  #D1D5DB;    /* Emphasized borders */

  --color-text-primary:   #111827;    /* Main text */
  --color-text-secondary: #6B7280;    /* Subdued text */
  --color-text-tertiary:  #9CA3AF;    /* Placeholder / disabled */
  --color-text-inverse:   #FFFFFF;    /* On dark backgrounds */

  /* ── Semantic ── */
  --color-success:        #059669;
  --color-success-light:  #ECFDF5;
  --color-success-border: #A7F3D0;

  --color-warning:        #D97706;
  --color-warning-light:  #FFFBEB;
  --color-warning-border: #FDE68A;

  --color-danger:         #DC2626;
  --color-danger-light:   #FEF2F2;
  --color-danger-border:  #FECACA;

  --color-info:           #2563EB;
  --color-info-light:     #EFF6FF;
  --color-info-border:    #BFDBFE;
}
```

### 1.2 Typography Scale

| Token       | Size (px) | Weight | Line Height | Use Case                    |
|-------------|-----------|--------|-------------|-----------------------------|
| `display`   | 36        | 800    | 44px        | Hero headings               |
| `h1`        | 30        | 700    | 38px        | Page titles                 |
| `h2`        | 24        | 700    | 32px        | Section headings            |
| `h3`        | 20        | 600    | 28px        | Card headings               |
| `h4`        | 16        | 600    | 24px        | Sub-section headings        |
| `body-lg`   | 16        | 400    | 24px        | Primary body text           |
| `body`      | 14        | 400    | 20px        | Default body text           |
| `body-sm`   | 13        | 400    | 18px        | Secondary / helper text     |
| `caption`   | 12        | 500    | 16px        | Labels, timestamps, badges  |
| `overline`  | 11        | 600    | 16px        | Uppercase labels, tags      |

**Font Family:** `Inter, system-ui, -apple-system, sans-serif`

### 1.3 Spacing System (4px grid)

| Token | Value | Use Case                              |
|-------|-------|---------------------------------------|
| `0`   | 0px   | Reset                                 |
| `0.5` | 2px   | Micro gaps (icon-text)                |
| `1`   | 4px   | Tight spacing                         |
| `1.5` | 6px   | Inline element spacing                |
| `2`   | 8px   | Compact padding / gap                 |
| `3`   | 12px  | Default padding                       |
| `4`   | 16px  | Standard padding / gap                |
| `5`   | 20px  | Section internal padding              |
| `6`   | 24px  | Card padding / section gap            |
| `8`   | 32px  | Major section spacing                 |
| `10`  | 40px  | Page section separation               |
| `12`  | 48px  | Large section gaps                    |
| `16`  | 64px  | Hero / major section padding          |

### 1.4 Radius System

| Token | Value  | Use Case                              |
|-------|--------|---------------------------------------|
| `sm`  | 6px    | Badges, small tags, inline elements   |
| `md`  | 8px    | Buttons, inputs, small cards          |
| `lg`  | 12px   | Cards, modals, dropdowns              |
| `xl`  | 16px   | Large cards, hero sections            |
| `2xl` | 24px   | Feature cards, hero containers        |
| `full`| 9999px | Avatars, pills, circular buttons      |

### 1.5 Shadow System

```css
--shadow-soft:    0 1px 2px rgba(0,0,0,0.05);
--shadow-medium:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
--shadow-elevated:0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
--shadow-modal:   0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05);
```

| Token       | Use Case                              |
|-------------|---------------------------------------|
| `soft`      | Cards at rest, subtle depth           |
| `medium`    | Hover states, dropdowns, tooltips     |
| `elevated`  | Floating panels, sticky headers       |
| `modal`     | Modals, popovers, notifications       |

### 1.6 Motion System

```css
--transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow:   300ms cubic-bezier(0.4, 0, 0.2, 1);
```

| Token    | Duration | Use Case                              |
|----------|----------|---------------------------------------|
| `fast`   | 150ms    | Hover states, color changes, opacity  |
| `normal` | 200ms    | Transitions, scaling, transforms      |
| `slow`   | 300ms    | Page transitions, modals, drawers     |

---

## 2. Component Library

### 2.1 Button System

```
┌─────────────────────────────────────────────────────────┐
│  VARIANT      │  BG         │  TEXT        │  BORDER    │
├─────────────────────────────────────────────────────────┤
│  Primary      │  Primary    │  White      │  None      │
│  Secondary    │  White      │  Primary    │  Primary   │
│  Ghost        │  Transparent│  Gray-700   │  None      │
│  Danger       │  Red-600    │  White      │  None      │
│  Danger Ghost │  Transparent│  Red-600    │  Red-300   │
│  Link         │  Transparent│  Primary    │  None      │
└─────────────────────────────────────────────────────────┘

Sizes: sm (32px) / md (40px) / lg (48px)
States: default → hover → active → loading → disabled
Loading: replaces label with spinner, keeps width
```

**Component:** `Button.jsx`
```jsx
<Button variant="primary" size="md" loading={false} icon="add">
  إنشاء جديد
</Button>
```

### 2.2 Input System

```
┌─────────────────────────────────────────────────────────┐
│  TYPE        │  FEATURES                               │
├─────────────────────────────────────────────────────────┤
│  Text        │  Label + helper text + error state       │
│  Select      │  Custom dropdown, search filter          │
│  Search      │  Icon prefix, live filter                │
│  Password    │  Toggle visibility, strength indicator   │
│  Date        │  Calendar picker, range support          │
│  Number      │  Increment/decrement, min/max            │
│  Textarea    │  Auto-resize, character count            │
└─────────────────────────────────────────────────────────┘

States: default → focus → error → disabled
Height: 40px (md)
Padding: 12px horizontal
Border: 1px solid --color-border
Focus: 2px ring --color-primary/20
```

**Component:** `Input.jsx`
```jsx
<Input
  label="اسم الطالب"
  placeholder="أدخل الاسم الكامل"
  error={errors.name}
  helperText="الاسم كما يظهر في البطاقة"
  prefix={<Icon name="person" />}
/>
```

### 2.3 Card System

#### KPI Card
```
┌──────────────────────────┐
│  📊  icon                │
│  1,234                   │  ← large number
│  إجمالي الطلاب           │  ← label
│  ↑ 12% عن الشهر الماضي  │  ← trend indicator
└──────────────────────────┘
```

#### Info Card
```
┌──────────────────────────┐
│  Title                 ⋮ │  ← header + actions
│  ─────────────────────── │
│  Content area            │
│  with padding            │
│  ─────────────────────── │
│  Footer / meta info      │
└──────────────────────────┘
```

#### Pricing Card (CRITICAL)
```
┌──────────────────────────┐
│  ★ Most Popular          │  ← badge (optional)
│                          │
│  Basic Plan              │  ← plan name
│  $29/month               │  ← price
│                          │
│  ✓ Feature 1             │
│  ✓ Feature 2             │
│  ✓ Feature 3             │
│  ✗ Feature 4 (disabled)  │
│                          │
│  ┌──────────────────────┐│
│  │   اختر هذا الخطة     ││  ← CTA
│  └──────────────────────┘│
└──────────────────────────┘

Variants: default / featured (border glow)
```

#### Ad Preview Card (CRITICAL)
```
┌──────────────────────────┐
│  🖼  preview image        │
│  ─────────────────────── │
│  Ad Title                 │
│  Target:Students, Groups  │
│  Status: ● Active         │
│  ─────────────────────── │
│  📊 1.2K views  👆 340   │  ← analytics
│  ─────────────────────── │
│  ✏️  Edit   🗑️  Delete    │  ← actions
└──────────────────────────┘
```

### 2.4 Table System

```
┌──────────────────────────────────────────────────────────┐
│  Search: [________]    Filter: [All ▾]  + Add New       │
├──────────────────────────────────────────────────────────┤
│  ☐  │ Name      │ Status   │ Date     │ Actions        │
├──────────────────────────────────────────────────────────┤
│  ☐  │ Ahmed     │ ● Active │ Jan 12   │  ✏️  🗑️  👁️    │
│  ☐  │ Sara      │ ● Pending│ Jan 13   │  ✏️  🗑️  👁️    │
│  ☐  │ Omar      │ ● Expired│ Jan 14   │  ✏️  🗑️  👁️    │
├──────────────────────────────────────────────────────────┤
│  Showing 1-10 of 156       ‹ 1 2 3 ... 16 ›            │
└──────────────────────────────────────────────────────────┘

Features:
- Sortable columns (click header)
- Inline actions (edit, delete, view)
- Bulk selection (checkboxes)
- Pagination (10/25/50 per page)
- Empty state with illustration
- Loading skeleton state
```

**Component:** `DataTable.jsx`
```jsx
<DataTable
  columns={columns}
  data={students}
  searchable={['name', 'email']}
  sortable
  pagination={{ pageSize: 10 }}
  actions={[
    { icon: 'edit', onClick: handleEdit },
    { icon: 'delete', onClick: handleDelete, danger: true },
  ]}
/>
```

### 2.5 Navigation System

#### Sidebar (Collapsible, Role-Based)
```
┌──────────────┐     ┌──────┐
│ 🏠 Dashboard │     │  🏠  │
│ 👨‍🎓 Students  │     │  👨‍🎓  │
│ 👥 Groups    │  →  │  👥  │
│ 📅 Sessions  │     │  📅  │
│ 💳 Subs     │     │  💳  │
│ 💰 Payments │     │  💰  │
│ 📢 Ads      │     │  📢  │
│ 👤 Users    │     │  👤  │
│ 🔔 Alerts   │     │  🔔  │
│ ─────────── │     │      │
│ ⚙️ Settings │     │  ⚙️  │
│ 👤 Profile  │     │  👤  │
└──────────────┘     └──────┘
   Expanded             Collapsed

- Width: 256px expanded / 72px collapsed
- Role-based menu items
- Active state: primary bg tint
- Hover: subtle bg change
- Mobile: overlay drawer
```

#### Topbar (Context-Aware)
```
┌──────────────────────────────────────────────────────┐
│  ☰  │  Page Title    │  🔍  Search  │  🔔  👤 ▾    │
└──────────────────────────────────────────────────────┘

- Sticky top
- Height: 64px
- Breadcrumbs below (optional)
- Actions slot (right side)
```

### 2.6 Modal System

```
┌─────────────────────────────────────────┐
│  Title                          ✕      │
│  ──────────────────────────────────────│
│                                         │
│  Content area                           │
│                                         │
│  ──────────────────────────────────────│
│                    Cancel  │  Confirm   │
└─────────────────────────────────────────┘

Variants:
- Confirm: warning icon + message + actions
- Form: embedded form with validation
- Payment: payment details + processing state
- Ad Creation: multi-step form + preview
```

### 2.7 Feedback System

#### Toast
```
┌─────────────────────────────┐
│  ✅  Operation successful   │  ← success
├─────────────────────────────┤
│  ⚠️  Warning message        │  ← warning
├─────────────────────────────┤
│  ❌  Error occurred         │  ← error
└─────────────────────────────┘

Position: bottom-right
Duration: 4s auto-dismiss
Stack: newest on top
```

#### Loading Skeleton
```
┌──────────────────────────┐
│  ▓▓▓▓▓▓▓▓  ▓▓▓▓         │  ← shimmer animation
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓       │
│  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓       │
└──────────────────────────┘
```

#### Empty State
```
┌──────────────────────────┐
│                          │
│     📭  illustration      │
│                          │
│   No data available      │
│   Description text       │
│                          │
│     [ Action Button ]    │
│                          │
└──────────────────────────┘
```

---

## 3. Layout System

### 3.1 App Shell

```
┌──────────────────────────────────────────────────────┐
│                    TOPBAR (64px)                      │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  SIDEBAR   │           CONTENT AREA                  │
│  (256px)   │                                         │
│            │   ┌─────────────────────────────────┐   │
│            │   │  Page Header                     │   │
│            │   │  Title + Subtitle + Actions      │   │
│            │   ├─────────────────────────────────┤   │
│            │   │                                  │   │
│            │   │  Page Content                    │   │
│            │   │  (Grid / Table / Cards)          │   │
│            │   │                                  │   │
│            │   └─────────────────────────────────┘   │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

### 3.2 Page Layout Pattern

```
┌─────────────────────────────────────────────┐
│  Page Header                                │
│  ┌─────────────────────────────────────────┐│
│  │  Title (h1)              [Action Btn]   ││
│  │  Subtitle (body-sm)                     ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  Filters / Tabs (optional)                  │
│  ┌─────────────────────────────────────────┐│
│  │  [Tab 1] [Tab 2] [Tab 3]   🔍 Search   ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  Content Section                            │
│  ┌─────────────────────────────────────────┐│
│  │  KPI Cards Row (4 columns)              ││
│  ├─────────────────────────────────────────┤│
│  │  Data Table / Card Grid                 ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│  Pagination (if table)                      │
└─────────────────────────────────────────────┘
```

### 3.3 Responsive Rules

| Breakpoint | Sidebar    | Content Grid    | Card Columns |
|------------|------------|-----------------|--------------|
| ≥1280px    | Expanded   | Full            | 4            |
| ≥1024px    | Collapsed  | Full            | 3            |
| ≥768px     | Hidden     | Full            | 2            |
| <768px     | Drawer     | Stack           | 1            |

---

## 4. Visual Style Guide

| Principle              | Implementation                              |
|------------------------|---------------------------------------------|
| **Clean & Minimal**    | No heavy borders, subtle shadows only       |
| **Whitespace**         | Generous padding, breathing room            |
| **Consistency**        | Same component everywhere, same spacing     |
| **Hierarchy**          | Clear visual weight, one primary action     |
| **Subtle Depth**       | Soft shadows, no harsh drop shadows         |
| **Color as Signal**    | Use semantic colors only for meaning        |
| **Typography First**   | Content drives layout, not decoration       |
| **Dark-on-Light**      | Light backgrounds, dark text (never reverse)|

**Background:** `#F9FAFB` (soft gray)  
**Cards:** `#FFFFFF` with `shadow-soft`  
**Borders:** `1px solid #E5E7EB` only when needed  
**Gradients:** Subtle, brand-colored, hero sections only  
**Icons:** Material Symbols Outlined, consistent sizing

---

# PART 2 — CORE PRODUCT SCREEN REDESIGN

---

## 1. Dashboard Screen

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  مرحباً، [اسم المدير] 👋                            │
│  هذه نظرة عامة على أكاديمية TKA-Egypt               │
├─────────┬─────────┬─────────┬───────────────────────┤
│ 💰      │ 👨‍🎓      │ 📅      │ 💳                    │
│ الإيراد │ الطلاب  │ الجلسات │ الاشتراكات            │
│ 45,200  │ 1,234   │ 89      │ 342 نشط              │
│ ↑ 12%   │ ↑ 8%    │ ↓ 3%   │ ↑ 15%                │
├─────────┴─────────┴─────────┴───────────────────────┤
│  📈 Revenue Chart (Line)    │  📊 Students by Track  │
│  Last 6 months              │  (Donut chart)         │
│  ─────────────────          │  ────────────          │
│  [interactive line chart]   │  Track A: 45%          │
│                             │  Track B: 30%          │
│                             │  Track C: 25%          │
├─────────────────────────────┼───────────────────────┤
│  ⚡ Quick Actions            │  🔔 Recent Activity    │
│  [+ Add Student]            │  Ahmed joined Track A  │
│  [+ Create Session]         │  Session completed     │
│  [+ Send Notification]      │  Payment received      │
│  [+ Generate Report]        │  New trainer applied   │
├─────────────────────────────┴───────────────────────┤
│  📅 Upcoming Sessions                                │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐ │
│  │ Sun  │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ │
│  │  3   │  5   │  2   │  4   │  1   │  0   │  0   │ │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘ │
└─────────────────────────────────────────────────────┘
```

### Components Used
- `KPICard` (x4) — with trend indicators
- `ChartCard` (Line chart) — revenue over time
- `ChartCard` (Donut chart) — students by track
- `QuickActions` — action buttons grid
- `ActivityFeed` — scrollable list
- `CalendarMini` — week view with session counts

### UX Flow
1. Page loads → skeleton states for all cards
2. Data populates → KPIs animate count-up
3. Charts load with subtle fade-in
4. Quick actions → navigate to relevant screens
5. Activity feed → clickable items open detail modals

### Visual Hierarchy
1. Greeting + subtitle (top, prominent)
2. KPI cards (4-col row, equal weight)
3. Charts (2-col row, visual data)
4. Quick actions + Activity (2-col, secondary)
5. Calendar (full-width, bottom)

### React Structure
```
app/admin/page.js
├── DashboardHeader (greeting + date)
├── KPICards (4x KPICard)
├── ChartsRow
│   ├── RevenueChart (recharts LineChart)
│   └── StudentsByTrack (recharts PieChart)
├── QuickActionsAndActivity (2-col)
│   ├── QuickActions
│   └── ActivityFeed
└── UpcomingSessions (CalendarMini)
```

### Before/After
| Before | After |
|--------|-------|
| Basic stats | KPI cards with trends |
| No charts | Interactive charts |
| No activity feed | Real-time activity |
| No quick actions | Action shortcuts |
| Plain layout | Premium dashboard |

---

## 2. Students Screen

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  الطلاب                        [+ إضافة طالب]       │
│  إدارة ومتابعة جميع الطلاب المسجلين                 │
├─────────────────────────────────────────────────────┤
│  🔍بحث  │  الحالة: [الكل ▾] │ المسار: [الكل ▾]     │
├─────────────────────────────────────────────────────┤
│  ┌─────┬──────────┬────────┬────────┬──────┬──────┐ │
│  │ ☐   │ الاسم    │ المسار │ الحالة │ الهاتف│ إجراء│ │
│  ├─────┼──────────┼────────┼────────┼──────┼──────┤ │
│  │ ☐   │ أحمد     │ Track A│●نشط  │ 010..│ ✏️👁️🗑️│ │
│  │ ☐   │ سارة     │ Track B│●معلق │ 011..│ ✏️👁️🗑️│ │
│  │ ☐   │ عمر      │ Track C│●منتهي│ 012..│ ✏️👁️🗑️│ │
│  └─────┴──────────┴────────┴────────┴──────┴──────┘ │
│  عرض 1-10 من 1,234          ‹ 1 2 3 ... 124 ›      │
├─────────────────────────────────────────────────────┤
│  ← Drawer opens when clicking view/edit →           │
│  ┌──────────────────────┐                           │
│  │  👤  أحمد محمد        │                           │
│  │  Track A — Actively   │                           │
│  │  ─────────────────── │                           │
│  │  البريد: a@b.com      │                           │
│  │  الهاتف: 01012345678 │                           │
│  │  تاريخ التسجيل: Jan  │                           │
│  │  ─────────────────── │                           │
│  │  [تعديل] [حذف]       │                           │
│  └──────────────────────┘                           │
└─────────────────────────────────────────────────────┘
```

### Components Used
- `PageHeader` — title + action button
- `SearchInput` — live search
- `FilterDropdown` (x2) — status, track
- `DataTable` — sortable, filterable, paginated
- `StatusBadge` — colored dots
- `Drawer` — student profile detail
- `ConfirmModal` — delete confirmation

### UX Flow
1. Page loads → table skeleton → data populates
2. Search → instant filter (debounced 300ms)
3. Filters → combine with search
4. Click row → drawer slides in from left (RTL)
5. Drawer → student details + quick actions
6. Add button → modal with form
7. Delete → confirm modal → toast success

### Visual Hierarchy
1. Page header + add button
2. Search + filters
3. Data table (main content)
4. Drawer (overlay, contextual)

### React Structure
```
app/admin/students/page.js
├── PageHeader
├── FiltersRow (Search + Dropdowns)
├── StudentsTable (DataTable)
├── StudentDrawer (Drawer)
└── AddStudentModal (FormModal)
```

### Before/After
| Before | After |
|--------|-------|
| Basic list | Sortable data table |
| No search | Live search + filters |
| No detail view | Slide-in drawer |
| Manual actions | Inline quick actions |
| No bulk operations | Checkbox selection |

---

## 3. Groups Screen

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  المجموعات                      [+ إنشاء مجموعة]    │
│  تنظيم المجموعات وتعيين المدربين                     │
├─────────────────────────────────────────────────────┤
│  🔍بحث  │  المسار: [الكل ▾] │ الحالة: [الكل ▾]     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────┐ │
│  │ 🟢 Track A-1    │ │ 🔵 Track B-1    │ │ ⚪ ...  │ │
│  │ 23 طالب         │ │ 18 طالب         │ │        │ │
│  │ المدرب: أحمد    │ │ المدرب: سارة    │ │        │ │
│  │ الأحد 4-6 م     │ │ الإثنين 5-7 م   │ │        │ │
│  │ ─────────────── │ │ ─────────────── │ │        │ │
│  │ [عرض] [تعديل]  │ │ [عرض] [تعديل]  │ │        │ │
│  └─────────────────┘ │ └─────────────────┘ │        │ │
│  ┌─────────────────┐ └─────────────────────┘        │ │
│  │ 🟡 Tech English │                                │ │
│  │ 15 طالب         │                                │ │
│  │ ...             │                                │ │
│  └─────────────────┘                                │ │
└─────────────────────────────────────────────────────┘
```

### Components Used
- `GroupCard` — card with status, trainer, schedule
- `FilterBar` — track + status filters
- `SearchInput` — search groups
- `StatusBadge` — group status indicator
- `EmptyState` — when no groups match

### UX Flow
1. Card grid view (default) or table view toggle
2. Each card shows: name, student count, trainer, schedule
3. Click card → group detail page/modal
4. Add group → multi-step modal (info → schedule → assign trainer → add students)

### Visual Hierarchy
1. Page header + create button
2. View toggle (grid/table)
3. Group cards (visual, scannable)
4. Each card: status → name → count → trainer → schedule

### React Structure
```
app/admin/groups/page.js
├── PageHeader
├── ViewToggle + Filters
├── GroupGrid / GroupTable (toggle)
├── GroupCard (repeated)
├── CreateGroupModal (multi-step)
└── GroupDetailModal
```

---

## 4. Sessions Screen

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  الجلسات                    [+ إنشاء جلسة]          │
│  جدولة الجلسات وتسجيل الحضور                       │
├─────────────────────────────────────────────────────┤
│  📅 Calendar View  │  📋 List View                  │
├─────────────────────────────────────────────────────┤
│  ◄  يونيو 2026  ►                                  │
│  ┌────┬────┬────┬────┬────┬────┬────┐               │
│  │ Sun│ Mon│ Tue│ Wed│ Thu│ Fri│ Sat│               │
│  ├────┼────┼────┼────┼────┼────┼────┤               │
│  │    │  2 │  3 │  4 │  5 │  6 │    │               │
│  │    │ •3 │ •5 │ •2 │ •4 │ •1 │    │               │
│  └────┴────┴────┴────┴────┴────┴────┘               │
│                                                     │
│  ─── جلسات اليوم: الثلاثاء 3 يونيو ───              │
│  ┌────────────────────────────────────────┐         │
│  │ 🟢 10:00 AM  Track A-1  أحمد   23/25 │         │
│  │ 🔵 02:00 PM  Track B-1  سارة  18/20 │         │
│  │ 🟡 05:00 PM  Tech Eng   خالد  15/15 │         │
│  └────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────┘
```

### Components Used
- `CalendarGrid` — month view with indicators
- `SessionList` — day view with session cards
- `SessionCard` — time, group, trainer, attendance ratio
- `AttendanceModal` — mark attendance per student
- `CreateSessionModal` — form with group/time selection

### UX Flow
1. Calendar view (default) → click day → show sessions
2. List view → all sessions in scrollable list
3. Click session → attendance modal
4. Create session → select group → pick time → confirm

### React Structure
```
app/admin/sessions/page.js
├── ViewToggle (Calendar / List)
├── CalendarGrid
├── SessionList
├── SessionCard (repeated)
├── AttendanceModal
└── CreateSessionModal
```

---

## 5. Subscriptions Screen (CRITICAL)

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  الاشتراكات                    [+ اشتراك جديد]      │
│  إدارة خطط الاشتراكات وحالات الطلاب                 │
├──────────┬──────────┬──────────┬────────────────────┤
│ 💳       │ ✅       │ ⏳       │ ❌                  │
│ الإجمالي │ النشط   │ المعلق  │ المنتهي            │
│ 342      │ 289      │ 23      │ 30                 │
├──────────┴──────────┴──────────┴────────────────────┤
│  Plans Overview                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ ★ Basic      │ │ Pro          │ │ Enterprise   │ │
│  │ $29/month    │ │ $79/month    │ │ $199/month   │ │
│  │ 156 طالب     │ │ 120 طالب     │ │ 66 طالب      │ │
│  │ [تعديل]     │ │ [تعديل]     │ │ [تعديل]     │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────┤
│  Active Subscriptions                                │
│  ┌─────┬──────────┬────────┬──────┬──────┬──────┐   │
│  │ ☐   │ الطالب   │ الخطة  │الحالة│ المدة│ إجراء│   │
│  ├─────┼──────────┼────────┼──────┼──────┼──────┤   │
│  │ ☐   │ أحمد     │ Pro    │●نشط │ 3 شهر│ ✏️👁️│   │
│  │ ☐   │ سارة     │ Basic  │●معلق│ شهر  │ ✏️👁️│   │
│  └─────┴──────────┴────────┴──────┴──────┴──────┘   │
└─────────────────────────────────────────────────────┘
```

### Subscription Lifecycle
```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Pending  │ →  │  Active   │ →  │ Expiring │ →  │  Expired  │
│  (新建)   │    │  (生效中) │    │ (即将到期)│    │  (已过期) │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
      │               │               │               │
      │               │               └─── renew ────→│
      │               └────── upgrade/downgrade ──────┘
      └───────────────── cancel ──────────────────────┘
```

### Billing UX Flow
1. Admin creates subscription → selects student + plan
2. System calculates: start date, end date, price
3. Payment modal opens → choose payment method
4. On payment → status becomes "Active"
5. Before expiry (7 days) → "Expiring" status
6. On expiry → "Expired" → notification to renew

### Payment History Section
```
┌─────────────────────────────────────────────┐
│  سجل المدفوعات — أحمد محمد                  │
│  ┌──────────┬────────┬────────┬──────┐      │
│  │ التاريخ  │ المبلغ │ الطريقة│الحالة│      │
│  ├──────────┼────────┼────────┼──────┤      │
│  │ Jan 15   │ $79    │ Fawry  │●مدفوع│      │
│  │ Apr 15   │ $79    │ Cash   │●مدفوع│      │
│  │ Jul 15   │ $79    │ —      │●معلق │      │
│  └──────────┴────────┴────────┴──────┘      │
└─────────────────────────────────────────────┘
```

### React Structure
```
app/admin/subscriptions/page.js
├── PageHeader
├── StatusKPIs (4 cards)
├── PlansOverview (3 pricing cards)
├── SubscriptionsTable (DataTable)
├── SubscriptionDetailDrawer
├── CreateSubscriptionModal
└── PaymentHistoryModal
```

---

## 6. Payments Screen (CRITICAL)

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  المدفوعات                     [+ تسجيل دفعة]       │
│  تتبع جميع المعاملات المالية                        │
├──────────┬──────────┬──────────┬────────────────────┤
│ 💰       │ ✅       │ ⏳       │ ❌                  │
│ الإيراد  │ مدفوع   │ معلق    │ فاشل               │
│ 45,200   │ 38,500  │ 4,200   │ 2,500              │
├──────────┴──────────┴──────────┴────────────────────┤
│  Payment Gateway Status                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ Fawry ●      │ │ Paymob ●     │ │ Manual ●     │ │
│  │ Connected    │ │ Connected    │ │ Active       │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────┤
│  Transactions                                        │
│  ┌─────┬──────────┬────────┬──────┬──────┬──────┐   │
│  │ ☐   │ التاريخ  │ الطالب │المبلغ│الحالة│ إجراء│   │
│  ├─────┼──────────┼────────┼──────┼──────┼──────┤   │
│  │ ☐   │ Jun 14   │ أحمد   │ $79  │●مدفوع│ 👁️✓ │   │
│  │ ☐   │ Jun 13   │ سارة  │ $29  │●معلق │ 👁️✓ │   │
│  └─────┴──────────┴────────┴──────┴──────┴──────┘   │
└─────────────────────────────────────────────────────┘
```

### Payment Lifecycle
```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Pending  │ →  │  Paid     │ →  │Verified  │
│  (معلق)  │    │ (مدفوع)  │    │(مُتحقق) │
└──────────┘    └──────────┘    └──────────┘
      │                               │
      └──────→ Failed ←───────────────┘
              (فشل)

Manual Verification Flow:
1. Student submits payment proof
2. Payment shows as "Pending"
3. Admin reviews evidence
4. Admin clicks "Verify" → status = "Verified"
5. OR Admin clicks "Reject" → status = "Failed"
```

### Revenue Summary Cards
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  اليوم       │ │  هذا الأسبوع │ │  هذا الشهر  │ │  هذا العام   │
│  $1,200      │ │  $8,400      │ │  $32,500     │ │  $45,200     │
│  ↑ 15%       │ │  ↑ 8%        │ │  ↑ 12%       │ │  ↑ 22%       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### React Structure
```
app/admin/payments/page.js
├── PageHeader
├── RevenueKPIs (4 cards)
├── GatewayStatus (3 cards)
├── TransactionsTable (DataTable)
├── VerifyPaymentModal
└── PaymentDetailDrawer
```

---

## 7. Ads Management Screen (CRITICAL)

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  الإعلانات                     [+ إنشاء إعلان]      │
│  إدارة الحملات الإعلانية والتواصل                    │
├──────────┬──────────┬──────────┬────────────────────┤
│ 📢       │ 🟢       │ 📅       │ ❌                  │
│ الإجمالي │ النشطة  │ المجدولة │ المنتهية           │
│ 12       │ 5        │ 3       │ 4                  │
├──────────┴──────────┴──────────┴────────────────────┤
│  ┌────────────────────────────────────────────────┐  │
│  │  🖼  [Ad Preview Image]                       │  │
│  │  ─────────────────────────────────────────────│  │
│  │  خصم 20% على كورس Python                     │  │
│  │  🟢 نشط  │  الهدف: جميع الطلاب  │  1.2K مشاهدة│  │
│  │  ─────────────────────────────────────────────│  │
│  │  📊 1,200 views  👆 340 clicks  📈 28% CTR   │  │
│  │  ─────────────────────────────────────────────│  │
│  │  ✏️  تعديل   📋 نسخ   ⏸️ إيقاف   🗑️ حذف     │  │
│  └────────────────────────────────────────────────┘  │
│                                                     │
│  ┌────────────────────────────────────────────────┐  │
│  │  🖼  [Another Ad]                             │  │
│  │  ...                                          │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Ad Targeting System
```
┌─────────────────────────────────────────┐
│  تحديد الجمهور المستهدف                  │
│                                         │
│  ○ جميع المستخدمين                      │
│  ○ الطلاب فقط                           │
│  ○ المدربين فقط                         │
│  ○ مجموعات محددة  [اختيار المجموعات ▾] │
│  ○ مستخدمين محددين [اختيار المستخدمين ▾]│
│                                         │
│  الجدولة:                               │
│  من: [__/__/____]  إلى: [__/__/____]   │
│  ○ نشر فوري                            │
│  ○ مجدول                               │
└─────────────────────────────────────────┘
```

### Ad Creation Flow (Multi-Step)
```
Step 1: Content        → Title + Description + Image
Step 2: Targeting      → Select audience
Step 3: Scheduling     → Set dates or publish now
Step 4: Preview        → See ad as user would
Step 5: Confirm        → Launch / Schedule
```

### Campaign Lifecycle
```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Draft    │ →  │Scheduled │ →  │  Active   │ →  │ Expired   │
│  (مسودة) │    │(مجدول)  │    │ (نشط)    │    │ (منتهي)  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │               │
                     └─── pause ────→│←── resume ────┘
```

### React Structure
```
app/admin/ads/page.js
├── PageHeader
├── StatusKPIs (4 cards)
├── AdsGrid (AdPreviewCard repeated)
├── CreateAdModal (multi-step wizard)
│   ├── Step1Content
│   ├── Step2Targeting
│   ├── Step3Scheduling
│   ├── Step4Preview
│   └── Step5Confirm
├── AdDetailModal
└── AnalyticsModal
```

---

## 8. Users / Admin Screen

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  المستخدمين                     [+ إنشاء مستخدم]    │
│  إدارة المستخدمين وصلاحياتهم                        │
├─────────────────────────────────────────────────────┤
│  🔍بحث  │  الدور: [الكل ▾] │ الحالة: [الكل ▾]     │
├─────────────────────────────────────────────────────┤
│  ┌─────┬──────────┬────────┬──────┬────────┬──────┐ │
│  │ ☐   │ الاسم    │الدور   │الحالة│ الفرع  │ إجراء│ │
│  ├─────┼──────────┼────────┼──────┼────────┼──────┤ │
│  │ ☐   │ أحمد     │ admin  │●نشط │ المقر  │ ✏️👁️│ │
│  │ ☐   │ سارة     │super.  │●نشط │فرع 1  │ ✏️👁️│ │
│  │ ☐   │ عمر      │ trainer│●متوقف│فرع 2  │ ✏️👁️│ │
│  └─────┴──────────┴────────┴──────┴────────┴──────┘ │
└─────────────────────────────────────────────────────┘
```

### Permissions Overview
```
┌──────────────┬───────┬───────────┬─────────┬─────────┐
│  الصلاحية    │ Admin │Supervisor │ Trainer │ Student │
├──────────────┼───────┼───────────┼─────────┼─────────┤
│  Dashboard   │  ✓    │    ✓      │   ✓     │   ✓     │
│  Students    │  ✓    │    ✓*     │   ✓*    │   ✗     │
│  Groups      │  ✓    │    ✓*     │   ✓*    │   ✗     │
│  Sessions    │  ✓    │    ✓*     │   ✓     │   ✗     │
│  Subscriptions│ ✓    │    ✓      │   ✗     │   ✗     │
│  Payments    │  ✓    │    ✓      │   ✗     │   ✗     │
│  Ads         │  ✓    │    ✗      │   ✗     │   ✗     │
│  Users       │  ✓    │    ✗      │   ✗     │   ✗     │
│  Settings    │  ✓    │    ✗      │   ✗     │   ✗     │
└──────────────┴───────┴───────────┴─────────┴─────────┘
* = scoped to assigned groups/branch
```

### React Structure
```
app/admin/users/page.js
├── PageHeader
├── FiltersRow
├── UsersTable (DataTable)
├── UserDetailDrawer
├── CreateUserModal (multi-step)
└── PermissionsModal
```

---

## 9. Notifications Screen

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  الإشعارات                     [تحديد الكل كمقروء]  │
│  تتبع جميع الإشعارات والتنبيهات                    │
├─────────────────────────────────────────────────────┤
│  الفلتر: [الكل] [الطلاب] [المدربين] [المالية]       │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐   │
│  │  🔵  •  أحمد انضم لـ Track A                │   │
│  │      منذ 5 دقائق  │  طلاب                   │   │
│  ├──────────────────────────────────────────────┤   │
│  │  🟢  •  تم تسجيل دفعة $79 من سارة           │   │
│  │      منذ 15 دقيقة │  مالية                   │   │
│  ├──────────────────────────────────────────────┤   │
│  │  ⚪     جلسة Track B-1 مكتملة                │   │
│  │      منذ ساعة    │  جلسات                   │   │
│  ├──────────────────────────────────────────────┤   │
│  │  ⚪     اشتراك عمر على وشك الانتهاء          │   │
│  │      منذ 3 ساعات │  اشتراكات                │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  تجميع حسب اليوم:                                   │
│  ─── اليوم ───                                      │
│  ─── أمس ───                                        │
│  ─── هذا الأسبوع ───                                │
└─────────────────────────────────────────────────────┘
```

### Notification States
```
● (unread) → bold text, colored dot
○ (read)   → normal text, no dot
```

### Notification Types
| Type       | Icon      | Color  | Group      |
|------------|-----------|--------|------------|
| Student    | person_add| Blue   | طلاب       |
| Payment    | payment   | Green  | مالية       |
| Session    | event     | Purple | جلسات      |
| Subscription| card     | Orange | اشتراكات   |
| System     | info      | Gray   | نظام       |

### React Structure
```
app/admin/notifications/page.js
├── PageHeader
├── FilterTabs
├── NotificationList
├── NotificationItem (grouped by day)
└── NotificationDetailModal
```

---

# PART 3 — UX ARCHITECTURE RULES

---

## 1. Universal Layout Rules

| Rule | Implementation |
|------|----------------|
| Every screen follows same layout | PageHeader + Filters + Content |
| One primary action per screen | Top-right action button |
| Consistent spacing | 4px grid system |
| Same component patterns | DataTable, Modals, Drawers everywhere |
| Content-first design | Text drives layout |

## 2. Interaction Rules

| Rule | Implementation |
|------|----------------|
| Every action has feedback | Toast on success/error |
| Destructive actions require confirm | ConfirmModal before delete |
| Loading states everywhere | Skeleton → Content transition |
| Empty states with guidance | Illustration + CTA button |
| No dead ends | Every screen has a way back |

## 3. Navigation Rules

| Rule | Implementation |
|------|----------------|
| Sidebar always visible | Collapsible, never hidden on desktop |
| Breadcrumbs for deep navigation | Level 3+ pages |
| Back button in drawers/modals | Always accessible |
| Active state reflects current page | Sidebar highlight |
| Max 3 clicks to any action | Shallow navigation depth |

## 4. Visual Consistency Rules

| Rule | Implementation |
|------|----------------|
| Same card style everywhere | White bg, soft shadow, lg radius |
| Same table style everywhere | Striped rows, hover state |
| Same button hierarchy | Primary (1) + Secondary (1) max |
| Same color meaning | Green = success, Red = danger, always |
| Same typography scale | Never deviate from tokens |

## 5. Accessibility Rules

| Rule | Implementation |
|------|----------------|
| Color contrast | 4.5:1 minimum for text |
| Focus visible | 2px ring on all interactive elements |
| Keyboard navigation | Tab order, Enter to select |
| RTL support | Full Arabic RTL layout |
| Touch targets | 44px minimum on mobile |

## 6. Performance Rules

| Rule | Implementation |
|------|----------------|
| Skeleton loading | Show before data loads |
| Optimistic updates | UI updates before API confirms |
| Debounced search | 300ms delay |
| Virtual scrolling | For lists >100 items |
| Lazy loading | Images and heavy components |

---

# IMPLEMENTATION ROADMAP

---

## Phase 1: Foundation (Week 1)
- [ ] Design tokens in CSS variables
- [ ] Base components (Button, Input, Card)
- [ ] Layout system (AppShell, Sidebar, Topbar)
- [ ] Typography and spacing utilities

## Phase 2: Core Components (Week 2)
- [ ] DataTable (sortable, filterable, paginated)
- [ ] Modal system (Confirm, Form, Payment)
- [ ] Drawer component
- [ ] Toast / Alert system
- [ ] Loading skeletons

## Phase 3: Screen Redesign (Week 3-4)
- [ ] Dashboard
- [ ] Students
- [ ] Groups
- [ ] Sessions
- [ ] Subscriptions
- [ ] Payments
- [ ] Ads Management
- [ ] Users
- [ ] Notifications

## Phase 4: Polish & Testing (Week 5)
- [ ] Responsive testing
- [ ] RTL validation
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing

---

**END OF DOCUMENT**
