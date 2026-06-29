# Task Sprints

## Sprint 1 — DB, Upload Engine, Metrics Dashboard
**Goal:** Core data pipeline works end-to-end; dashboard renders with seed data for anonymous visitors.

- [ ] Initialise Next.js 14 (App Router) + Tailwind CSS
- [ ] Install Supabase JS client; configure env vars
- [ ] Run migration SQL (campaigns, reports, ai_insights + seed rows)
- [ ] Build `/upload` page: CSV file picker, column-header validation, 10-row preview table
- [ ] `POST /api/upload`: parse CSV → calculate CTR/CPC/CPL/ROAS → insert into `campaigns` → return report_id
- [ ] `GET /api/dashboard`: aggregate all campaigns → KPI totals + per-campaign rows
- [ ] Build `/dashboard` page: KPI cards (Total Spend, Impressions, Clicks, Conversions, avg ROAS) + Recharts bar chart
- [ ] Empty state: prompt to upload when no campaigns exist
- [ ] Loading skeleton for dashboard fetch

**Definition of Done:** Upload a 5-row CSV → rows in Supabase → dashboard shows correct KPIs. Seed data visible on first load without login.

---

## Sprint 2 — AI Insight Generation *(v1 functional milestone)*
**Goal:** The one core engine — generate insights — works end-to-end against the database.

- [ ] `POST /api/generate-insights`: build prompt from campaign rows, call OpenAI, parse structured JSON response
- [ ] Insert each insight into `ai_insights` (value, source, confidence, review_status)
- [ ] Insert/update `reports` row with aggregated totals
- [ ] **Generate Insights** button on dashboard — active, persists result, shows loading state
- [ ] Build `/report/[id]` page: summary card, findings list (best/worst), recommendations list
- [ ] Confidence badge per insight (e.g. 91% confident)
- [ ] Error toast if OpenAI call fails; partial results still saved

**Definition of Done:** Click Generate → AI output stored in DB → `/report/[id]` shows real insights with confidence scores. ✅ *v1 functional milestone*

---

## Sprint 3 — Export, Polish, Error Handling
**Goal:** Full flow is smooth, mobile-friendly, and handles edge cases.

- [ ] `GET /api/report/[id]`: return report + insights as JSON
- [ ] Export button: download formatted markdown/text report file
- [ ] Copy-to-clipboard button per insight
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Error boundaries on all async pages
- [ ] Validate CSV max file size (5 MB) and max rows (500)
- [ ] Handle duplicate column names and missing optional columns gracefully

**Definition of Done:** End-to-end flow works on a 375 px mobile screen; export downloads a real readable file; bad CSV shows a clear error message.

---

## Sprint 4 — Lock It Down (Auth + RLS)
**Goal:** Per-user data isolation; no user sees another's campaigns.

- [ ] Enable Supabase Auth (email/password)
- [ ] Login and signup pages
- [ ] Set `user_id = auth.uid()` on all writes
- [ ] Replace v1 permissive RLS policies with owner-scoped policies
- [ ] `/dashboard` still shows seed demo data to anonymous visitors; `/upload` and `/report` require login
- [ ] Logout button in nav

**Definition of Done:** Two test accounts cannot access each other's data; seed rows remain publicly visible.

---

## Sprint 5 — History, Comparison, Deploy
**Goal:** Production-ready, publicly accessible, demo-complete.

- [ ] Report history list page: all reports for logged-in user, sorted by date
- [ ] Period-over-period delta column in dashboard table (if ≥ 2 reports exist)
- [ ] Human review UI: Approve / Edit buttons update `review_status`
- [ ] Deploy to Vercel; confirm all env vars set (no secrets in repo)
- [ ] Create and publish demo CSV dataset in `/public/demo-data.csv`
- [ ] Verify full flow on production URL in < 30 seconds

**Definition of Done:** Public URL accessible; demo CSV produces a full AI report; no secrets in source code; Lighthouse performance score ≥ 80.

---

## Gantt (Sprint → Feature)
```
Sprint 1  |  DB schema · CSV upload · metric calc · dashboard · seed data
Sprint 2  |  AI insight generation · report page · confidence scores       ← v1 functional
Sprint 3  |  Export · copy · responsive · error handling · CSV validation
Sprint 4  |  Auth · login/signup · owner RLS · data isolation
Sprint 5  |  Report history · delta view · review UI · production deploy
```
