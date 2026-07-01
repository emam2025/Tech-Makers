# خطة التنفيذ الشاملة — Tech Makers Egypt

> **تاريخ الخطة:** 2026-06-30
> **الحالة:** الموقع لايف على Vercel — البيانات حقيقية
> **مبدأ أساسي:** كل تغيير يُختبر أولاً على بيئة staging قبل الإنتاج
> **الهدف:** تحويل المشروع من MVP إلى نظام إنتاجي آمن ونظيف وقابل للتطوير

---

## جدول المحتويات

1. [المرحلة 0: التحضير والنسخ الاحتياطي](#المرحلة-0-التحضير-والنسخ-الاحتياطي)
2. [المرحلة 1: إصلاح الثغرات الأمنية الحرجة](#المرحلة-1-إصلاح-الثغرات-الأمنية-الحرجة)
3. [المرحلة 2: تنظيف قاعدة البيانات وتوحيد الترحيلات](#المرحلة-2-تنظيف-قاعدة-البيانات-وتوحيد-الترحيلات)
4. [المرحلة 3: إعادة هيكلة API وتوحيد المصادقة](#المرحلة-3-إعادة-هيكلة-api-وتوحيد-المصادقة)
5. [المرحلة 4: تنظيف المشروع من الملفات القديمة](#المرحلة-4-تنظيف-المشروع-من-الملفات-القديمة)
6. [المرحلة 5: تحسين الأداء وتقسيم المكونات الكبيرة](#المرحلة-5-تحسين-الأداء-وتقسيم-المكونات-الكبيرة)
7. [المرحلة 6: تحسين UI/UX وإزالة البيانات الوهمية](#المرحلة-6-تحسين-uiux-وإزالة-البيانات-الوهمية)
8. [المرحلة 7: الاختبارات والتدقيق النهائي](#المرحلة-7-الاختبارات-والتدقيق-النهائي)
9. [المرحلة 8: النشر والمتابعة](#المرحلة-8-النشر-والمتابعة)

---

## هيكل فريق العمل (الوكلاء)

| الوكيل | الاختصاص | المسؤوليات |
|--------|----------|------------|
| **Agent A: Security** | الأمن والصلاحيات | إصلاح الثغرات، Rate Limiting، CSRF، Cookies، Middleware |
| **Agent B: Database** | قواعد البيانات | توحيد SQL، إضافة الفهارس، إصلاح RLS، تنظيف الترحيلات |
| **Agent C: API Core** | خدمات API | توحيد verifyAuth، إضافة Pagination، تحسين Validation |
| **Agent D: Code Cleanup** | تنظيف الكود | حذف الملفات القديمة، تقسيم المكونات الكبيرة، توحيد CSS |
| **Agent E: Frontend** | واجهات المستخدم | إصلاح Dashboard، Hardcoded Data، تحسين UX |
| **Agent F: Testing** | الاختبارات والجودة | إضافة Tests، Linting، Type Checking |

---

## المرحلة 0: التحضير والنسخ الاحتياطي

**المدة المقدرة:** يوم واحد
**المسؤول:** جميع الوكلاء
**الخطر:** عالي — يجب التأكد من وجود نسخة احتياطية كاملة قبل أي تغيير

### 0.1 نسخ احتياطي لقاعدة البيانات (Supabase)

```sql
-- عبر Supabase Dashboard → Database → Backup → Create a backup
-- أو عبر pg_dump:
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  --schema=public --format=custom --file=./backups/pre_cleanup_backup.dump
```

### 0.2 نسخ احتياطي للبيانات الحساسة

```bash
# تصدير Environment Variables من Vercel
vercel env list > ./backups/vercel_env_backup_$(date +%Y%m%d).txt

# توثيق جميع المتغيرات البيئية المستخدمة في الكود
grep -r "process.env." --include="*.js" --include="*.jsx" --include="*.mjs" . | \
  grep -oP 'process\.env\.\w+' | sort -u > ./backups/env_vars_used.txt
```

### 0.3 إنشاء فرع Git للسلامة

```bash
git checkout -b staging/phase-0-preparation
git tag "backup-$(date +%Y-%m-%d)"
git checkout master
git checkout -b production-stable-$(date +%Y%m%d)
git checkout master
```

### 0.4 إنشاء بيئة Staging

- إنشاء مشروع Supabase منفصل للاختبار
- إنشاء مشروع Vercel منفصل (tech-makers-staging)
- ربط فرع staging بـ Vercel preview deployments

### 0.5 التحقق من صحة النسخة الاحتياطية

```sql
SELECT schemaname, tablename, n_live_tup as row_count FROM pg_stat_user_tables ORDER BY tablename;
```

### ✅ معايير النجاح

- [ ] نسخة احتياطية كاملة لقاعدة البيانات موجودة ومؤكدة
- [ ] جميع Environment Variables موثقة
- [ ] فرع Git للاستقرار موجود
- [ ] بيئة Staging جاهزة ومنفصلة تماماً عن الإنتاج
- [ ] يمكن استعادة البيانات من النسخة الاحتياطية

---

## المرحلة 1: إصلاح الثغرات الأمنية الحرجة

**المدة المقدرة:** 2-3 أيام
**المسؤول:** Agent A (Security)
**الخطورة:** عالية جداً — يتعامل مع بيانات حقيقية ومفاتيح API

### 1.1 إزالة مفتاح Google API من `opencode.json` (عاجل — يجب التنفيذ فوراً)

**الملف:** `opencode.json`

```diff
- "X-Goog-Api-Key": "AQ.Ab8RN6KU-ckxYmDQ7C-TizH6cqofO_UooQYCi6u8SkouSWwHsQ"
+ "X-Goog-Api-Key": ""
```

**خطوات إضافية:**
1. إبطال المفتاح من Google Cloud Console (يدوياً فوراً)
2. إزالة المفتاح من git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch opencode.json" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. إضافة `opencode.json` إلى `.gitignore`

### 1.2 إصلاح Rate Limiting ليعمل مع Vercel Serverless

**الملف:** `lib/security.js`

**المشكلة:** الـ `Map` في الذاكرة لا يعمل مع Serverless Functions.

**الحل:** استخدام Supabase DB كـ backend للـ Rate Limiting.

تغيير الدوال التالية:
- `rateLimit()` → تصبح async وتستخدم Supabase
- `checkOrigin()` → يبقى كما هو
- `getClientIp()` → يبقى كما هو

### 1.3 إضافة جدول `rate_limits` في قاعدة البيانات

```sql
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL DEFAULT '/',
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
```

### 1.4 إصلاح Cookie Security

**الملف:** `app/api/admin/auth/route.js`

```diff
- sameSite: 'lax',
+ sameSite: 'strict',
```

### 1.5 إضافة Rate Limiting لكل Admin Routes

**الملفات المتأثرة:** جميع ملفات `app/api/admin/*/route.js` (34 ملف)

كل GET handler يحتاج إلى:
```javascript
const ip = getClientIp(request);
if (!await rateLimit(ip, 60, 60000)) {
  return NextResponse.json({ error: 'تم تجاوز الحد المسموح' }, { status: 429 });
}
```

كل POST/PUT/DELETE handler يحتاج إلى:
```javascript
if (!await rateLimit(ip, 20, 60000)) {
  return NextResponse.json({ error: 'تم تجاوز الحد المسموح' }, { status: 429 });
}
```

### 1.6 إصلاح `GRANT SELECT TO anon` في جدول `students`

**الملف:** `supabase/migrations/001_students_landing.sql`

```diff
- GRANT SELECT ON students TO anon;
+ -- ملغى: هذا يكشف بيانات الطلاب للعامة
```

### 1.7 إضافة Content Security Policy

**الملف:** `next.config.mjs` — إضافة `async headers()` مع CSP.

### 1.8 إضافة CSRF Protection

**الملف الجديد:** `lib/csrf.js`

### 1.9 إخفاء `SUPABASE_SERVICE_KEY` من المصادقة

**الملف:** `lib/adminAuth.js` — استخدام anon key + user token بدلاً من service key.

### ✅ معايير النجاح للمرحلة 1

- [ ] مفتاح Google API مُزال من الكود ومن git history
- [ ] Rate Limiting يعمل عبر Supabase (ليس in-memory)
- [ ] Cookies تستخدم `SameSite=Strict`
- [ ] جميع Admin Routes لديها Rate Limiting
- [ ] `GRANT SELECT TO anon` مُزال
- [ ] CSP headers مُضافة
- [ ] CSRF protection مُضافة
- [ ] `SUPABASE_SERVICE_KEY` لا يُستخدم للمصادقة

---

## المرحلة 2: تنظيف قاعدة البيانات وتوحيد الترحيلات

**المدة المقدرة:** 2 أيام
**المسؤول:** Agent B (Database)
**الخطورة:** متوسطة — يتعامل مع هيكل قاعدة البيانات

### 2.1 توحيد ملفات SQL في ملف ترحيل واحد

**الملفات الحالية:** 34 ملفاً SQL (13 في `sql/` + 21 في `supabase/migrations/`)

**الإجراء:**
1. إنشاء: `supabase/migrations/100_final_schema.sql`
2. دمج كل الترحيلات فيه مع `IF NOT EXISTS`
3. حذف `sql/` directory بالكامل
4. إعادة تسمية `supabase/migrations/` الملفات بأرقام متسلسلة

### 2.2 إضافة Soft Delete

إضافة عمود `deleted_at TIMESTAMPTZ` لكل الجداول الرئيسية:
- `profiles`, `students_enhanced`, `trainers`, `groups`
- `sessions`, `tasks`, `task_submissions`
- `subscriptions`, `payments`, `messages`, `notifications`
- `student_progress`, `evaluations`, `certificates`

مع تحديث RLS policies لاستبعاد `deleted_at IS NOT NULL`.

### 2.3 إضافة الفهارس المفقودة

لجداول: `evaluations`, `certificates`, `alerts`, `ads`, `salaries`
وفهارس مركبة: `(group_id, scheduled_date)`, `(student_id, status)` إلخ.

### 2.4 إصلاح RLS Policies

التأكد من أن جميع الجداول الـ 23 لديها RLS policies كاملة.

### 2.5 إضافة قيود UNIQUE

`students_enhanced(email)`, `trainers(email)`, `groups(name, track)`

### 2.6 حذف جدول `students` القديم

بعد ترحيل أي بيانات متبقية إلى `students_enhanced`:
```sql
DROP TABLE IF EXISTS students CASCADE;
```

### ✅ معايير النجاح للمرحلة 2

- [ ] ملف SQL موحد واحد بدلاً من 34 ملفاً
- [ ] `sql/` directory مُزال
- [ ] Soft-delete مضاف لجميع الجداول الرئيسية
- [ ] جميع الفهارس المفقودة مضافة
- [ ] RLS policies كاملة على جميع الجداول
- [ ] قيود UNIQUE مضافة
- [ ] جدول `students` القديم مُزال

---

## المرحلة 3: إعادة هيكلة API وتوحيد المصادقة

**المدة المقدرة:** 3 أيام
**المسؤول:** Agent C (API Core)
**الخطورة:** متوسطة

### 3.1 توحيد `verifyAuth()` في Middleware واحد

**الملف الجديد:** `lib/auth-middleware.js`

إزالة النسخ المكررة من 15+ ملف API route واستبدالها باستيراد واحد.

### 3.2 إضافة Pagination إجباري لكل GET routes

جميع GET endpoints تستخدم الآن `page` (default: 1) و `pageSize` (default: 20, max: 100).

**إزالة كل حالات `limit=500`.**

### 3.3 إضافة Validation موحد

**الملف الجديد:** `lib/validation.js` مع دوال validateField, validateBody.

### 3.4 إضافة Service Layer

**الملف الجديد:** `lib/supabase-service.js` مع كلاس `SupabaseService`.

### ✅ معايير النجاح للمرحلة 3

- [ ] `verifyAuth()` في مكان واحد فقط
- [ ] Pagination في كل GET routes
- [ ] Validation موحد
- [ ] Service layer جاهز

---

## المرحلة 4: تنظيف المشروع من الملفات القديمة

**المدة المقدرة:** يوم واحد
**المسؤول:** Agent D (Code Cleanup)
**الخطورة:** منخفضة

### 4.1 مجلدات للحذف

```bash
rm -rf stitch_smart_academy_management_system/  # 11MB — AI-generated screens
rm -rf "update design/"                          # تصميمات قديمة
rm docs/UI-UX-DESIGN-BRIEF.md                    # مكرر في DESIGN-SYSTEM.md
```

### 4.2 ملفات SQL القديمة للحذف

بعد الدمج في المرحلة 2:
```bash
rm sql/*.sql
```

### 4.3 ملفات أخرى

```bash
rm skills-lock.json
```

### 4.4 تحديث `.gitignore`

إضافة: `opencode.json`, `skills-lock.json`, `stitch_*`, `update design/`, `sql/*.sql`, `backups/`, `.env.local`

### ✅ معايير النجاح للمرحلة 4

- [ ] مجلد `stitch_smart_academy_management_system/` محذوف
- [ ] مجلد `update design/` محذوف
- [ ] ملفات SQL الفردية محذوفة
- [ ] `.gitignore` محدث

---

## المرحلة 5: تحسين الأداء وتقسيم المكونات الكبيرة

**المدة المقدرة:** 3 أيام
**المسؤول:** Agent D + Agent F

### 5.1 تقسيم `app/page.js` (38KB)

إنشاء مجلد `app/home/` مع:
- `HeroSection.js`
- `StatsSection.js`
- `TracksSection.js`
- `TestimonialsSection.js`
- `FaqSection.js`
- `PricingSection.js`
- `CTASection.js`

### 5.2 تقسيم `app/globals.css` (31KB)

إنشاء مجلد `app/styles/` مع:
- `tokens.css` — المتغيرات
- `base.css` — القواعد الأساسية
- `components.css` — المكونات
- `admin.css` — أنماط admin
- `animations.css` — الحركات
- `responsive.css` — التجاوب

### 5.3 Lazy Loading للمكونات الثقيلة

استخدام `next/dynamic` لـ `Sidebar`, `Topbar`, `DataTable`.

### ✅ معايير النجاح للمرحلة 5

- [ ] `app/page.js` مقسم إلى 7+ مكونات
- [ ] `app/globals.css` مقسم إلى ملفات نمطية
- [ ] Lazy Loading مفعل

---

## المرحلة 6: تحسين UI/UX وإزالة البيانات الوهمية

**المدة المقدرة:** 2 يوم
**المسؤول:** Agent E (Frontend)

### 6.1 إزالة Hardcoded Data

| الموقع | البيانات | الاستبدال |
|--------|---------|-----------|
| `app/admin/page.js:141` | `+12%` | ديناميكي من API |
| `app/admin/page.js:151` | `مستقر` | ديناميكي من API |
| `app/admin/page.js:161` | `+8%` | ديناميكي من API |
| `app/admin/page.js:171` | `-2%` | ديناميكي من API |
| `app/admin/page.js:174` | `92%` | ديناميكي من API |
| `app/admin/page.js:215-217` | `34 طالباً` | ديناميكي من API |
| `app/admin/page.js:226` | `8 جلسات` | ديناميكي من API |
| `app/admin/page.js:269-291` | جدول اليوم | ديناميكي من API |
| `app/admin/page.js:304` | `85%` | ديناميكي من API |

### 6.2 إضافة "نسيت كلمة المرور" في Login

### 6.3 إضافة Empty States

### 6.4 إضافة Error Boundaries

### ✅ معايير النجاح للمرحلة 6

- [ ] لا يوجد Hardcoded data في Dashboard
- [ ] Login يحتوي على "نسيت كلمة المرور"
- [ ] Error Boundaries في كل مكان
- [ ] Dashboard يعرض بيانات حقيقية 100%

---

## المرحلة 7: الاختبارات والتدقيق النهائي

**المدة المقدرة:** 2 يوم
**المسؤول:** Agent F (Testing)

### 7.1 اختبارات API

`__tests__/api/security.test.js` — Rate limiting, Auth, CSRF, Validation

### 7.2 اختبارات UI

`__tests__/components/Dashboard.test.jsx` — Dashboard, Skeleton, Hardcoded data

### 7.3 تشغيل ESLint والتدقيق

```bash
npx next lint
npx jest --coverage
npx npm audit
```

### 7.4 اختبار الأداء

```bash
npx lighthouse https://tka-egypt.com --view
```

### ✅ معايير النجاح للمرحلة 7

- [ ] اختبارات API تغطي 80%+ من الـ routes
- [ ] اختبارات UI تغطي المكونات الرئيسية
- [ ] ESLint بدون أخطاء
- [ ] Jest tests pass
- [ ] لا توجد ثغرات في npm audit

---

## المرحلة 8: النشر والمتابعة

**المدة المقدرة:** يوم واحد
**المسؤول:** جميع الوكلاء

### 8.1 النشر على Staging

```bash
git checkout staging
git merge master --no-ff
vercel --prod
```

### 8.2 اختبار Staging

- اختبار تسجيل الدخول
- اختبار CRUD لكل وحدة
- اختبار الأداء
- اختبار الأمان

### 8.3 النشر على الإنتاج

```bash
git checkout master
git merge staging --no-ff
vercel --prod
```

### 8.4 المراقبة بعد النشر

- مراقبة Vercel logs
- مراقبة Supabase logs
- مراقبة Rate Limiting
- مراقبة الأخطاء

### 8.5 جدول المتابعة الأسبوعي

- الأسبوع 1: مراقبة يومية
- الأسبوع 2-4: مراقبة أسبوعية
- بعد الشهر: مراقبة شهرية

### ✅ معايير النجاح للمرحلة 8

- [ ] Staging يعمل بشكل صحيح
- [ ] الإنتاج يعمل بشكل صحيح
- [ ] لا توجد أخطاء في logs
- [ ] الأداء طبيعي
- [ ] خطة المتابعة موثقة

---

## ملخص الجدول الزمني

| المرحلة | الأيام | المسؤول | الخطورة |
|---------|--------|---------|---------|
| 0. التحضير والنسخ الاحتياطي | 1 | جميعاً | عالية |
| 1. إصلاح الثغرات الأمنية | 2-3 | Agent A | حرجة |
| 2. تنظيف قاعدة البيانات | 2 | Agent B | متوسطة |
| 3. إعادة هيكلة API | 3 | Agent C | متوسطة |
| 4. تنظيف المشروع | 1 | Agent D | منخفضة |
| 5. تحسين الأداء | 3 | Agent D+F | متوسطة |
| 6. تحسين UI/UX | 2 | Agent E | منخفضة |
| 7. الاختبارات | 2 | Agent F | منخفضة |
| 8. النشر والمتابعة | 1 | جميعاً | عالية |

**المجموع:** 17-20 يوم عمل
