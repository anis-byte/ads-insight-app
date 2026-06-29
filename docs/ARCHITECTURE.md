# Architecture — Ads Insight App

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Database | Supabase (Postgres + Storage) |
| AI | OpenAI GPT-4o via server-side API route |
| Hosting | Vercel |
| File upload | Supabase Storage (CSV files) |

## What to Build Now vs Later
**Now (v1):** CSV upload → parse → metric table → AI insights → copyable report
**Next:** Saved report history, PDF export, multi-platform CSV templates
**Later:** Direct API connections (Meta/Google), scheduled reports, team sharing

## Key User Action — Step by Step
1. User drops a CSV on the upload page
2. Next.js API route reads the file, parses rows into campaign + metric objects
3. Parsed data is written to `campaigns` and `metric_snapshots` tables in Supabase, linked to a `report` row
4. A second API route sends structured metric data to OpenAI; response is stored as `insights` rows and a `report_outputs` record
5. Frontend fetches and renders: metric table, insight cards, copyable report block
6. User copies the report or downloads it

## Layer Plan
1. **Data first** — tables, seed data, CSV parser work without AI
2. **App logic** — upload, parse, display metrics (no AI needed to see numbers)
3. **Smart layer** — AI insight generation on top; if it fails, the metric table still works

## Why the Core Runs Without AI
The CSV parser and metric aggregation are pure code. Switching off the AI leaves a functional data viewer — useful on its own, safely degradable.
