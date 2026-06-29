# Architecture

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Recharts |
| API | Next.js Route Handlers (Edge-compatible) |
| Database | Supabase (Postgres + RLS) |
| AI | OpenAI API (`gpt-4o`) |
| Deployment | Vercel (frontend + API), Supabase (DB) |

## Key User Action — Step-by-Step
1. **Upload** — user picks a CSV; client validates required columns.
2. **Parse** — `POST /api/upload` reads rows, computes CTR/CPC/CPL/ROAS, inserts into `campaigns`.
3. **Store** — Supabase persists campaign rows; returns new IDs.
4. **Show** — `GET /api/dashboard` aggregates rows; dashboard renders KPI cards + charts.
5. **Generate** — `POST /api/generate-insights` sends campaign rows to OpenAI, receives structured JSON.
6. **Rank** — insights sorted by confidence score before display.
7. **Act** — user exports report; `GET /api/report/[id]` returns full markdown.

## Layer Plan
1. **Data first** — schema + seed data; dashboard works with seed rows before any upload.
2. **App logic** — upload, validation, metric calculation (pure JS, no AI dependency).
3. **Smart features** — AI insight generation added on top; disabling OpenAI still leaves a fully functional metrics dashboard and export.

## Why Core Runs Without AI
All metric calculations (CTR, CPC, CPL, ROAS) are deterministic JS. The dashboard, upload, and export routes have zero OpenAI calls. AI is an enhancement layer only.
