# Task Sprints — Ads Insight App

---

## Sprint 1 — Database + Demo Data + Metric Table
**Goal:** Schema live, seed data visible, anonymous visitors see a real-looking report with a metric table.

- [ ] Run migration SQL — create all tables with RLS v1 policies
- [ ] Seed 1 demo report, 3 campaigns, metric snapshots, 4 insights, 1 report output
- [ ] Build `/` homepage: renders demo report list (no login wall)
- [ ] Build `/reports/[id]` page: metric table from DB, campaign rows, period comparison
- [ ] Empty state: "No campaigns found in this report"
- [ ] Loading skeleton for table

**Definition of Done:** Visiting `/` shows demo reports; `/reports/[id]` shows metric table with real numbers from seeded data. No login required.

---

## Sprint 2 — CSV Upload + Parse Engine *(Core Engine)* ✅ v1 functional milestone
**Goal:** Upload a CSV → data appears in the metric table. The one core action works end-to-end.

- [ ] Upload UI: drag-and-drop + file picker, accepts `.csv`
- [ ] `POST /api/reports/upload` — saves file to Supabase Storage, creates `report` row
- [ ] `parse_csv` tool: normalise column names, extract campaigns + metrics, write to DB
- [ ] Error handling: wrong format, empty file, missing required columns
- [ ] Report status transitions: `processing → ready | error`
- [ ] After upload, redirect to `/reports/[id]` — user sees their data immediately
- [ ] Test with Meta Ads CSV and Google Ads CSV sample exports

**Definition of Done:** User uploads a real CSV; campaigns and metrics appear in the table within 5 seconds; bad file shows a clear error message.

---

## Sprint 3 — AI Insights + Report Output
**Goal:** Metrics trigger AI analysis; insight cards and copyable report appear.

- [ ] `score_campaigns` tool: compute WoW deltas, rank by score
- [ ] `generate_insights` tool: call OpenAI with structured JSON, store insight rows
- [ ] `generate_report_output` tool: call OpenAI, store narrative in `report_outputs`
- [ ] Insight cards UI: title, body, insight_type badge, `review_status` indicator
- [ ] "Regenerate" button → re-runs AI, shows diff, user confirms
- [ ] Copyable report block with one-click copy button
- [ ] AI error fallback: if OpenAI fails, metric table still renders with rule-based score labels
- [ ] Store `audit_log` row for every AI tool call

**Definition of Done:** After upload, AI insights render within 30 seconds; copy button works; if AI fails, metric table and score labels still show.

---

## Sprint 4 — Polish + Report History
**Goal:** App looks portfolio-ready; demo is shareable.

- [ ] Report list page: all reports with status badges, date, platform icon
- [ ] Delete report (with confirm dialog; logs to audit before delete)
- [ ] Platform selector on upload (Meta / Google / Other) to improve parser hints
- [ ] Mobile-responsive layout
- [ ] Empty state for new users ("Upload your first CSV")
- [ ] Page titles, meta description, favicon
- [ ] README with live link + how-to-demo instructions

**Definition of Done:** App is shareable as a live link; demo dataset looks real; all buttons persist to DB; no dead UI.

---

## Sprint 5 — Lock It Down (Auth + Per-User Data)
**Goal:** Real users can sign up; their data is private.

- [ ] Supabase Auth: email/password sign-up + login page
- [ ] Stamp `user_id` on all new rows
- [ ] Replace v1 RLS policies with owner-scoped (`auth.uid() = user_id`) policies
- [ ] Redirect unauthenticated users to login (except public demo page)
- [ ] Keep seed demo rows accessible on a public `/demo` route

**Definition of Done:** Two test accounts cannot see each other's reports; demo route still works without login.

---

## Gantt Overview
```
Sprint 1 — Week 1, Days 1-2  — Schema + Seed + Metric Table
Sprint 2 — Week 1, Days 3-5  — Upload + CSV Parse Engine  ← v1 functional
Sprint 3 — Week 2, Days 1-3  — AI Insights + Report Output
Sprint 4 — Week 2, Days 4-5  — Polish + Report History
Sprint 5 — Week 3            — Auth + Lock Down
```
