# TKA-Egypt Academy Management System — Roadmap & Implementation Plan

> **Version:** 1.0  
> **Date:** 2026-06-14  
> **Status:** Planning Phase  
> **Goal:** Transform landing page → Full Academy ERP System

---

## Current State Analysis

### What Exists Today

```
┌─────────────────────────────────────────────────────────────┐
│  LANDING PAGE (Current)                                      │
│                                                              │
│  Public Pages: 7 (home, about, tracks, register, join,      │
│                   certificate, english-test, technomath,     │
│                   techenglish)                                │
│                                                              │
│  Admin Pages: 5 (dashboard, students, team, users,           │
│                   test-codes, profile)                        │
│                                                              │
│  API Routes: 11                                              │
│  Components: 5                                               │
│  DB Tables: 5 (profiles, test_codes, team_applications,      │
│                 students, english_test_results)               │
│                                                              │
│  Auth: Email/Password only, no guest mode                    │
│  Roles: admin, supervisor only                               │
│  Missing: 8 sidebar modules, messaging, tasks, groups,       │
│           subscriptions, notifications, progress tracking     │
└─────────────────────────────────────────────────────────────┘
```

### Gap Analysis

| Requirement | Current | Needed | Gap |
|---|---|---|---|
| Auth | Email/Password | + Guest Mode + nationalId | ⚠️ Partial |
| User Model | 10 fields | 8 fields (new model) | 🔴 Redesign |
| Roles | 2 (admin, supervisor) | 4 (admin, trainer, supervisor, student) | 🔴 Expand |
| Sidebar Modules | 5 | 13 | 🔴 +8 modules |
| DB Tables | 5 | ~15 | 🔴 +10 tables |
| API Routes | 11 | ~30+ | 🔴 +19 routes |
| Components | 5 | ~25+ | 🔴 +20 components |

---

## Target Architecture

### System Blueprint

```
┌──────────────────────────────────────────────────────────────────┐
│                    TKA-Egypt Academy System                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   PUBLIC     │  │   ADMIN     │  │   STUDENT   │              │
│  │   WEBSITE    │  │   PANEL     │  │   PORTAL    │              │
│  │              │  │              │  │              │              │
│  │  • Home      │  │  • Dashboard │  │  • Dashboard │              │
│  │  • About     │  │  • Students  │  │  • My Groups │              │
│  │  • Tracks    │  │  • Trainers  │  │  • Sessions  │              │
│  │  • Register  │  │  • Supervis. │  │  • Tasks     │              │
│  │  • Join      │  │  • Groups    │  │  • Progress  │              │
│  │  • Certs     │  │  • Subs/Pay  │  │  • Messages  │              │
│  │  • English   │  │  • Users     │  │  • Profile   │              │
│  │  • Techno    │  │  • Notifs    │  │              │              │
│  │  • Tech Eng  │  │  • Messages  │  │              │              │
│  │              │  │  • Tasks     │  │              │              │
│  │              │  │  • Progress  │  │              │              │
│  │              │  │  • Profile   │  │              │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                    SHARED LAYER                           │    │
│  │  • Design System (Tokens + Components)                    │    │
│  │  • Auth (Supabase Auth + Guest Mode)                      │    │
│  │  • API Routes (Next.js Route Handlers)                    │    │
│  │  • Database (Supabase PostgreSQL)                         │    │
│  │  • Real-time (Supabase Realtime)                          │    │
│  │  • Storage (Supabase Storage)                             │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Database Schema (Target)

```
┌──────────────────────────────────────────────────────────────────┐
│                     DATABASE SCHEMA                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  AUTH & USERS                                                    │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │ auth.users    │───→│  profiles    │                           │
│  │ (Supabase)   │    │  (extended)  │                           │
│  └──────────────┘    └──────────────┘                           │
│                                                                   │
│  CORE MODULES                                                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  students    │    │  trainers    │    │  groups      │       │
│  │  (enhanced)  │    │  (new)       │    │  (new)       │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
│  OPERATIONS                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  sessions    │    │  attendance  │    │  tasks       │       │
│  │  (new)       │    │  (new)       │    │  (new)       │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
│  FINANCIAL                                                       │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │ subscriptions│    │  payments    │                           │
│  │  (new)       │    │  (new)       │                           │
│  └──────────────┘    └──────────────┘                           │
│                                                                   │
│  COMMUNICATION                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  messages    │    │ notifications│    │ group_space  │       │
│  │  (new)       │    │  (new)       │    │  (new)       │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
│  TRACKING                                                        │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │  evaluations │    │  progress    │                           │
│  │  (new)       │    │  (new)       │                           │
│  └──────────────┘    └──────────────┘                           │
│                                                                   │
│  EXISTING (keep)                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ test_codes   │    │team_applicat.│    │english_test  │       │
│  │              │    │              │    │_results      │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### API Architecture (Target)

```
┌──────────────────────────────────────────────────────────────────┐
│                      API ROUTES                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PUBLIC (no auth)                                                │
│  ├── POST   /api/register                                        │
│  ├── POST   /api/join                                            │
│  ├── GET    /api/certificate                                     │
│  ├── POST   /api/english-test                                    │
│  ├── POST   /api/english-test/submit                              │
│  ├── POST   /api/validate-code                                   │
│  └── PATCH  /api/validate-code                                   │
│                                                                   │
│  AUTH                                                             │
│  ├── POST   /api/admin/auth          (login)                     │
│  ├── GET    /api/admin/auth          (session)                   │
│  ├── DELETE /api/admin/auth          (logout)                    │
│  └── POST   /api/admin/auth/guest    (guest mode) [NEW]          │
│                                                                   │
│  USERS                                                            │
│  ├── GET    /api/admin/users                                     │
│  ├── POST   /api/admin/users                                     │
│  ├── PUT    /api/admin/users                                     │
│  └── DELETE /api/admin/users                                     │
│                                                                   │
│  STUDENTS (enhanced)                                              │
│  ├── GET    /api/admin/students                                  │
│  ├── PUT    /api/admin/students                                  │
│  └── GET    /api/admin/students/[id]    [NEW]                    │
│                                                                   │
│  TRAINERS [NEW]                                                   │
│  ├── GET    /api/admin/trainers                                  │
│  ├── POST   /api/admin/trainers                                  │
│  └── PUT    /api/admin/trainers                                  │
│                                                                   │
│  GROUPS [NEW]                                                     │
│  ├── GET    /api/admin/groups                                    │
│  ├── POST   /api/admin/groups                                    │
│  ├── PUT    /api/admin/groups                                    │
│  ├── DELETE /api/admin/groups                                    │
│  ├── POST   /api/admin/groups/[id]/assign-students               │
│  └── POST   /api/admin/groups/[id]/assign-trainer                │
│                                                                   │
│  SESSIONS [NEW]                                                   │
│  ├── GET    /api/admin/sessions                                  │
│  ├── POST   /api/admin/sessions                                  │
│  ├── PUT    /api/admin/sessions                                  │
│  └── DELETE /api/admin/sessions                                  │
│                                                                   │
│  ATTENDANCE [NEW]                                                 │
│  ├── GET    /api/admin/attendance                                │
│  ├── POST   /api/admin/attendance                                │
│  └── PUT    /api/admin/attendance                                │
│                                                                   │
│  SUBSCRIPTIONS [NEW]                                              │
│  ├── GET    /api/admin/subscriptions                             │
│  ├── POST   /api/admin/subscriptions                             │
│  └── PUT    /api/admin/subscriptions                             │
│                                                                   │
│  PAYMENTS [NEW]                                                   │
│  ├── GET    /api/admin/payments                                  │
│  ├── POST   /api/admin/payments                                  │
│  └── PUT    /api/admin/payments                                  │
│                                                                   │
│  MESSAGES [NEW]                                                   │
│  ├── GET    /api/admin/messages                                  │
│  ├── POST   /api/admin/messages                                  │
│  └── GET    /api/admin/messages/[conversationId]                 │
│                                                                   │
│  NOTIFICATIONS [NEW]                                              │
│  ├── GET    /api/admin/notifications                             │
│  ├── PUT    /api/admin/notifications/[id]/read                   │
│  └── PUT    /api/admin/notifications/read-all                    │
│                                                                   │
│  TASKS [NEW]                                                      │
│  ├── GET    /api/admin/tasks                                     │
│  ├── POST   /api/admin/tasks                                     │
│  ├── PUT    /api/admin/tasks                                     │
│  └── POST   /api/admin/tasks/[id]/submit                         │
│                                                                   │
│  PROGRESS [NEW]                                                   │
│  ├── GET    /api/admin/progress/[studentId]                      │
│  └── GET    /api/admin/progress/[studentId]/timeline             │
│                                                                   │
│  TEAM (existing)                                                  │
│  ├── GET    /api/admin/team                                      │
│  └── PUT    /api/admin/team                                      │
│                                                                   │
│  TEST CODES (existing)                                            │
│  ├── GET    /api/admin/test-codes                                │
│  └── POST   /api/admin/test-codes                                │
│                                                                   │
│  TOTAL: ~40 API routes                                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 0: Foundation & Design System (Week 1)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 0: FOUNDATION                                        │
│  Duration: 5 days                                           │
│  Priority: CRITICAL (blocks everything)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 1-2: Design System                                     │
│  ├── CSS Variables (tokens) in globals.css                  │
│  ├── Base components: Button, Input, Card, Badge            │
│  ├── Layout: AppShell, Sidebar, Topbar                      │
│  └── Typography + spacing utilities                         │
│                                                              │
│  Day 3: Auth System Upgrade                                 │
│  ├── Update profiles table (add nationalId, status)         │
│  ├── Add guest mode API (/api/admin/auth/guest)             │
│  ├── nationalId validation on registration                  │
│  └── Role expansion (admin/trainer/supervisor/student)      │
│                                                              │
│  Day 4: Database Schema                                     │
│  ├── Create all new tables (SQL migrations)                 │
│  ├── RLS policies for each table                            │
│  ├── Auto-triggers for new tables                           │
│  └── Indexes for performance                                │
│                                                              │
│  Day 5: Component Library                                    │
│  ├── DataTable (sortable, filterable, paginated)            │
│  ├── Modal system (Confirm, Form, Payment)                  │
│  ├── Drawer component                                       │
│  ├── Toast / Alert system                                   │
│  ├── Loading skeletons + Empty states                       │
│  └── Sidebar (role-based, collapsible)                      │
│                                                              │
│  Deliverables:                                               │
│  ✅ Design tokens in CSS                                     │
│  ✅ 10+ reusable components                                  │
│  ✅ Auth system with guest mode                              │
│  ✅ Database schema (15 tables)                              │
│  ✅ Updated profiles table                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Core Modules (Week 2-3)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: CORE MODULES                                      │
│  Duration: 10 days                                          │
│  Priority: HIGH                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 1-2: Students Module (enhanced)                        │
│  ├── Redesign students page with DataTable                  │
│  ├── Student profile drawer                                 │
│  ├── Add/Edit student modal                                 │
│  ├── Status management (active/suspended/trial)             │
│  ├── Search + filters (track, status, name)                 │
│  └── Bulk actions                                           │
│                                                              │
│  Day 3-4: Trainers Module (new)                             │
│  ├── Trainers list page                                     │
│  ├── Add/Edit trainer modal                                 │
│  ├── Trainer profile with assigned groups                   │
│  ├── Specialties management                                 │
│  └── Status controls                                        │
│                                                              │
│  Day 5-6: Groups Module (new)                               │
│  ├── Groups list (card grid + table toggle)                 │
│  ├── Create group modal (multi-step)                        │
│  ├── Assign students to group                               │
│  ├── Assign trainer to group                                │
│  ├── Schedule preview                                       │
│  └── Group detail page                                      │
│                                                              │
│  Day 7-8: Supervisors Module (new)                          │
│  ├── Supervisors list page                                  │
│  ├── Add/Edit supervisor modal                              │
│  ├── Assign groups to supervisor                            │
│  ├── Branch assignment                                      │
│  └── Permission scopes                                      │
│                                                              │
│  Day 9-10: Dashboard Redesign                               │
│  ├── KPI cards (students, revenue, attendance, subs)        │
│  ├── Charts (recharts: line + donut)                        │
│  ├── Recent activity feed                                   │
│  ├── Quick actions panel                                    │
│  ├── Upcoming sessions widget                               │
│  └── Notification preview                                   │
│                                                              │
│  Deliverables:                                               │
│  ✅ Students module (enhanced)                               │
│  ✅ Trainers module (new)                                    │
│  ✅ Groups module (new)                                      │
│  ✅ Supervisors module (new)                                 │
│  ✅ Dashboard (redesigned)                                   │
│  ✅ 15+ API routes                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Phase 2: Operations (Week 4-5)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: OPERATIONS                                        │
│  Duration: 10 days                                          │
│  Priority: HIGH                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 1-3: Sessions Module (new)                             │
│  ├── Calendar view (month/week/day)                         │
│  ├── List view toggle                                       │
│  ├── Create session modal                                   │
│  ├── Session detail with attendance                         │
│  ├── Recurring sessions support                             │
│  └── Status indicators (upcoming/ongoing/completed)         │
│                                                              │
│  Day 4-5: Attendance Module (new)                           │
│  ├── Mark attendance per session                            │
│  ├── Bulk mark (present/absent/late)                        │
│  ├── Attendance stats per student                           │
│  ├── Attendance stats per group                             │
│  └── Export attendance report                               │
│                                                              │
│  Day 6-7: Tasks Module (new)                                │
│  ├── Tasks list page                                        │
│  ├── Create task modal (assign to group/student)            │
│  ├── Task detail with submission tracking                   │
│  ├── Student submission UI                                  │
│  ├── Grading/feedback interface                             │
│  └── Task status pipeline (pending/submitted/graded)        │
│                                                              │
│  Day 8-10: Student Progress Journey (new)                   │
│  ├── Student progress page                                  │
│  ├── Timeline view (sessions → attendance → tasks → evals)  │
│  ├── Progress charts                                        │
│  ├── Evaluation records                                     │
│  └── Export progress report                                 │
│                                                              │
│  Deliverables:                                               │
│  ✅ Sessions module (new)                                    │
│  ✅ Attendance module (new)                                  │
│  ✅ Tasks module (new)                                       │
│  ✅ Student Progress Journey (new)                           │
│  ✅ 10+ API routes                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Phase 3: Financial & Communication (Week 6-7)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: FINANCIAL & COMMUNICATION                         │
│  Duration: 10 days                                          │
│  Priority: HIGH                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 1-3: Subscriptions Module (new)                        │
│  ├── Subscription plans management                          │
│  ├── Plan comparison table                                  │
│  ├── Create subscription modal                              │
│  ├── Subscription lifecycle (pending/active/expiring/       │
│  │   expired)                                               │
│  ├── Student subscription tracking                          │
│  ├── Upgrade/downgrade flow                                 │
│  └── Subscription stats                                     │
│                                                              │
│  Day 4-5: Payments Module (new)                             │
│  ├── Payment transactions table                             │
│  ├── Record payment modal                                   │
│  ├── Payment verification flow                              │
│  ├── Revenue summary cards                                  │
│  ├── Payment status tracking (paid/pending/failed)          │
│  └── Payment history per student                            │
│                                                              │
│  Day 6-7: Notifications Module (new)                        │
│  ├── Notifications list page                                │
│  ├── Real-time notifications (Supabase Realtime)            │
│  ├── Filter by type (students/sessions/payments/tasks)      │
│  ├── Read/unread states                                     │
│  ├── Mark all as read                                       │
│  ├── Notification grouping (by day)                         │
│  └── Notification triggers (on events)                      │
│                                                              │
│  Day 8-10: Messages Module (new)                            │
│  ├── Conversation list                                      │
│  ├── 1:1 chat (student ↔ trainer)                           │
│  ├── Group chat space                                       │
│  ├── Message bubbles (sent/received)                        │
│  ├── Real-time messages (Supabase Realtime)                 │
│  ├── Read receipts                                          │
│  └── File/image sharing                                     │
│                                                              │
│  Deliverables:                                               │
│  ✅ Subscriptions module (new)                               │
│  ✅ Payments module (new)                                    │
│  ✅ Notifications module (new)                               │
│  ✅ Messages module (new)                                    │
│  ✅ 15+ API routes                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Phase 4: Polish & Production (Week 8)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: POLISH & PRODUCTION                               │
│  Duration: 5 days                                           │
│  Priority: MEDIUM                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 1: Responsive Design                                   │
│  ├── Mobile sidebar drawer                                  │
│  ├── Responsive tables (card view on mobile)                │
│  ├── Touch-friendly interactions                            │
│  └── Breakpoint testing                                     │
│                                                              │
│  Day 2: RTL & Accessibility                                 │
│  ├── Full RTL layout validation                             │
│  ├── Keyboard navigation                                    │
│  ├── Focus management                                       │
│  ├── ARIA labels                                            │
│  └── Color contrast check                                   │
│                                                              │
│  Day 3: Performance                                         │
│  ├── Loading states for all pages                           │
│  ├── Skeleton UI                                            │
│  ├── Error boundaries                                       │
│  ├── Lazy loading                                           │
│  └── Image optimization                                     │
│                                                              │
│  Day 4: Testing                                             │
│  ├── All pages render correctly                             │
│  ├── All API routes work                                    │
│  ├── All CRUD operations                                    │
│  ├── Role-based access verification                         │
│  └── Guest mode testing                                     │
│                                                              │
│  Day 5: Deployment                                          │
│  ├── Vercel deploy                                          │
│  ├── Environment variables check                           │
│  ├── Database migrations verification                       │
│  ├── SSL/HTTPS check                                        │
│  └── Final smoke test                                       │
│                                                              │
│  Deliverables:                                               │
│  ✅ Fully responsive                                         │
│  ✅ RTL complete                                             │
│  ✅ Performance optimized                                    │
│  ✅ All tests passing                                        │
│  ✅ Production deployed                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        8-WEEK TIMELINE                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Week 1   │████████████████████│ Phase 0: Foundation                 │
│  Week 2   │████████████████████│ Phase 1: Core Modules (part 1)      │
│  Week 3   │████████████████████│ Phase 1: Core Modules (part 2)      │
│  Week 4   │████████████████████│ Phase 2: Operations (part 1)        │
│  Week 5   │████████████████████│ Phase 2: Operations (part 2)        │
│  Week 6   │████████████████████│ Phase 3: Financial (part 1)         │
│  Week 7   │████████████████████│ Phase 3: Communication (part 2)     │
│  Week 8   │████████████████████│ Phase 4: Polish & Production        │
│                                                                       │
│  MILESTONES:                                                          │
│  • End of Week 1: Design system + Auth + DB ready                     │
│  • End of Week 3: Core modules working (Students, Trainers, Groups)   │
│  • End of Week 5: Operations working (Sessions, Attendance, Tasks)    │
│  • End of Week 7: Full system working (Financial + Communication)     │
│  • End of Week 8: Production deployed                                 │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## File Structure (Target)

```
landingpage/
├── app/
│   ├── (public routes)/
│   │   ├── page.js                    # Homepage
│   │   ├── about/page.js              # About
│   │   ├── tracks/page.js             # Tracks
│   │   ├── register/page.js           # Registration
│   │   ├── join/page.js               # Join team
│   │   ├── certificate/page.js        # Certificates
│   │   ├── english-test/page.js       # English test
│   │   ├── technomath/page.js         # Techno Math
│   │   └── techenglish/page.js        # Tech English
│   │
│   ├── login/page.js                  # Login
│   │
│   ├── admin/
│   │   ├── layout.js                  # DashboardLayout (Sidebar + Topbar)
│   │   ├── page.js                    # Dashboard
│   │   ├── students/page.js           # Students Management
│   │   ├── trainers/page.js           # Trainers Management [NEW]
│   │   ├── supervisors/page.js        # Supervisors Management [NEW]
│   │   ├── groups/page.js             # Groups Management [NEW]
│   │   ├── sessions/page.js           # Sessions [NEW]
│   │   ├── attendance/page.js         # Attendance [NEW]
│   │   ├── tasks/page.js              # Tasks [NEW]
│   │   ├── subscriptions/page.js      # Subscriptions [NEW]
│   │   ├── payments/page.js           # Payments [NEW]
│   │   ├── notifications/page.js      # Notifications [NEW]
│   │   ├── messages/page.js           # Messages [NEW]
│   │   ├── progress/page.js           # Student Progress [NEW]
│   │   ├── users/page.js              # Users Management
│   │   ├── team/page.js               # Team Applications
│   │   ├── test-codes/page.js         # Test Codes
│   │   └── profile/page.js            # Profile
│   │
│   └── api/
│       ├── register/route.js
│       ├── join/route.js
│       ├── certificate/route.js
│       ├── english-test/route.js
│       ├── english-test/submit/route.js
│       ├── validate-code/route.js
│       └── admin/
│           ├── auth/route.js
│           ├── auth/guest/route.js     [NEW]
│           ├── users/route.js
│           ├── students/route.js
│           ├── students/[id]/route.js  [NEW]
│           ├── trainers/route.js       [NEW]
│           ├── groups/route.js         [NEW]
│           ├── groups/[id]/route.js    [NEW]
│           ├── sessions/route.js       [NEW]
│           ├── attendance/route.js     [NEW]
│           ├── subscriptions/route.js  [NEW]
│           ├── payments/route.js       [NEW]
│           ├── messages/route.js       [NEW]
│           ├── messages/[id]/route.js  [NEW]
│           ├── notifications/route.js  [NEW]
│           ├── tasks/route.js          [NEW]
│           ├── tasks/[id]/route.js     [NEW]
│           ├── progress/[id]/route.js  [NEW]
│           ├── team/route.js
│           └── test-codes/route.js
│
├── components/
│   ├── ui/                             # Design System Components [NEW]
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   ├── Drawer.jsx
│   │   ├── DataTable.jsx
│   │   ├── Skeleton.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── Toast.jsx
│   │   └── Avatar.jsx
│   │
│   ├── layout/                         # Layout Components [NEW]
│   │   ├── AppShell.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── PageHeader.jsx
│   │
│   ├── charts/                         # Chart Components [NEW]
│   │   ├── LineChart.jsx
│   │   ├── PieChart.jsx
│   │   └── BarChart.jsx
│   │
│   └── (existing components)
│       ├── SiteHeader.js
│       ├── HeroWithHalo.js
│       ├── CountdownTimer.js
│       ├── RevealObserverClient.js
│       └── PromoPopup.js
│
├── lib/
│   ├── security.js
│   ├── gemini.js
│   └── supabase.js                    # Supabase helper utilities [NEW]
│
├── sql/
│   ├── admin-setup.sql
│   ├── 001_profiles_enhanced.sql       [NEW]
│   ├── 002_students_enhanced.sql       [NEW]
│   ├── 003_trainers.sql                [NEW]
│   ├── 004_groups.sql                  [NEW]
│   ├── 005_sessions.sql                [NEW]
│   ├── 006_attendance.sql              [NEW]
│   ├── 007_tasks.sql                   [NEW]
│   ├── 008_subscriptions.sql           [NEW]
│   ├── 009_payments.sql                [NEW]
│   ├── 010_messages.sql                [NEW]
│   ├── 011_notifications.sql           [NEW]
│   ├── 012_progress.sql                [NEW]
│   └── 013_rls_policies.sql            [NEW]
│
├── tailwind.config.js
├── globals.css                         # Design tokens added here
├── middleware.js
├── package.json
└── next.config.mjs
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep | HIGH | Stick to phased approach, no new features mid-sprint |
| Database complexity | MEDIUM | Use RLS properly, test each table before building UI |
| Auth complexity (guest mode) | MEDIUM | Implement guest as separate flow, not modifying core auth |
| Real-time messaging | HIGH | Use Supabase Realtime, fallback to polling |
| Mobile responsiveness | MEDIUM | Design mobile-first, test on real devices |
| Performance (many pages) | LOW | Lazy loading, skeleton states, code splitting |

---

## Success Criteria

| Criterion | Target |
|---|---|
| All 13 sidebar modules | ✅ Working |
| All pages render UI | ✅ No blank pages |
| All data states handled | ✅ Loading/Empty/Error |
| Role-based access | ✅ 4 roles working |
| Guest mode | ✅ Auto-generate credentials |
| nationalId required | ✅ Validation on registration |
| RTL complete | ✅ Full Arabic support |
| Mobile responsive | ✅ Works on phones |
| Production deployed | ✅ Live on Vercel |
| No broken navigation | ✅ All routes accessible |

---

**END OF ROADMAP**
