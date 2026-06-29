# Tasks & Sprints

## Sprint 1 — Database, Upload Engine, Demo Data
**Goal:** Core data pipeline works end-to-end; app is demoable without login.

- [ ] Apply Supabase migration SQL (campaigns, reports, report_insights, audit_logs)
- [ ] Seed 4 realistic demo campaign rows + 1 demo report + 4 demo insights
- [ ] `POST /api/upload` — parse CSV, validate columns (campaign_name, platform, spend, impressions, clicks, conversions required), calculate CPC/CTR/CVR/CPA, insert to `campaigns`
- [ ] Upload page UI — drag-and-drop CSV, column error messages, row preview table
- [ ] Homepage renders demo campaign cards without login wall
- [ ] Audit log write on upload

**Definition of Done:** A CSV upload persists rows to DB; preview table shows parsed data; homepage shows seeded campaigns to an anonymous visitor.

---

## Sprint 2 — Dashboard + AI Insights ✅ v1 functional milestone
**Goal:** Full end-to-end flow — upload → metrics → AI insights — works for a real user.

- [ ] `GET /api/dashboard` returns campaigns + aggregated metrics for a batch
- [ ] Dashboard page: spend, impressions, clicks, conversions, CPC, CTR, CPA cards
- [ ] Recharts bar/line charts per campaign (spend vs conversions, CPC comparison)
- [ ] Rule-based campaign ranking (best/worst by CPA) runs without AI
- [ ] `POST /api/generate-insights` — call OpenAI with structured batch data, store each insight with `source`, `confidence`, `review_status`
- [ ] Insight panel: best campaign, worst campaign, possible reason, recommendation
- [ ] Loading spinner, empty state, and error toast for every async action
- [ ] Audit log write on insight generation

**Definition of Done:** Upload a CSV → see metric dashboard → click Generate Insights → AI insight panel populates from DB → all states handled.

---

## Sprint 3 — Report Export & UI Polish
**Goal:** Shareable, exportable report; responsive and production-quality UI.

- [ ] `GET /api/report?reportId=` returns full report + insights
- [ ] Report page renders AI summary + insight bullets in clean layout
- [ ] Copy-to-clipboard button for each insight and full summary
- [ ] PDF or plain-text export (browser print / `jsPDF`)
- [ ] Responsive layout — works on mobile
- [ ] Empty-state illustrations for no-upload and no-report screens
- [ ] Error boundary wrapping main routes

**Definition of Done:** Report page renders correctly; copy and export buttons work; no broken layouts on mobile.

---

## Sprint 4 — Lock It Down (Auth + Per-User RLS)
**Goal:** User data is private; app is safe for real use.

- [ ] Supabase Auth: sign-up, login, logout flows
- [ ] Set `user_id` on campaigns and reports at write time from `auth.uid()`
- [ ] Replace v1 permissive RLS with `auth.uid() = user_id` owner policies on all tables
- [ ] Redirect unauthenticated users from `/dashboard` to landing page
- [ ] Landing page retains seeded demo data (visible to all) with a "Try with demo data" CTA
- [ ] Per-user report history list

**Definition of Done:** Two test accounts cannot see each other's campaigns or reports; anonymous users see only demo data.

---

## Sprint 5 — Insight Review, History & Deploy
**Goal:** Users can review AI output; app is live and documented.

- [ ] Insight review UI — Accept / Edit / Reject buttons per insight, updates `review_status` in DB
- [ ] Report history list sorted by date
- [ ] Deploy to Vercel with `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` in env
- [ ] Smoke test on production URL (upload → insights → export)
- [ ] `docs/` complete and committed

**Definition of Done:** Production URL passes full manual test plan; insight review persists to DB.

---

## Gantt (Sprint → Feature)
```
Sprint 1 | DB schema · CSV upload · demo seed · homepage
Sprint 2 | Dashboard · charts · AI insights · API endpoints   ← v1 functional
Sprint 3 | Report page · export · UI polish · responsive
Sprint 4 | Auth · RLS · per-user isolation
Sprint 5 | Insight review · history · deploy · docs
```
