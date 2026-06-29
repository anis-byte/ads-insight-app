# Architecture

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Recharts |
| API | Next.js API Routes (Node.js runtime) |
| Database | Supabase PostgreSQL |
| AI | OpenAI API (gpt-4o) — isolated in `/services/insights.ts` |
| Deploy | Vercel (frontend + API) + Supabase (DB) |

## Key User Action — Step by Step
1. User drops a CSV on the upload page.
2. API route `/api/upload` parses, validates required columns, calculates CPC/CTR/CVR/CPA.
3. Cleaned rows are written to `campaigns` table with an `upload_batch_id`.
4. User sees a preview table, then the metrics dashboard.
5. User clicks **Generate Insights** → `/api/generate-insights` queries the batch, calls OpenAI, stores each insight row in `report_insights` with `source`, `confidence`, `review_status`.
6. Dashboard renders insight panel from DB — not from the raw API response.
7. User opens the Report page, copies or exports.

## Layer Plan
1. **Data first** — schema, seed data, CRUD endpoints
2. **App logic** — CSV parsing, metric calculation, dashboard (works with AI off)
3. **Smart layer** — OpenAI summarisation on top of structured data

## Why It Works Without AI
All metrics (CPC, CTR, CVR, CPA) are calculated in pure TypeScript. The dashboard is fully functional. AI only enriches the insight text — removing OpenAI still leaves a working analytics tool.
