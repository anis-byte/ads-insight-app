# Product Requirements — Ads Insight App

## Problem
Media buyers and marketers spend hours manually reading campaign data, writing performance summaries, and explaining results to clients. The analysis is repetitive; the storytelling is slow.

## Target Users
- Performance marketers / media buyers
- Marketing analysts
- Founders running their own paid ads
- Non-technical clients who need plain-English results

## Core Objects
| Object | What it is |
|---|---|
| **Report** | One uploaded CSV → one analysis session |
| **Campaign** | A campaign row parsed from the CSV |
| **Metric Snapshot** | Aggregated KPIs (CTR, CPL, CPA, ROAS, spend, conversions) |
| **Insight** | AI-generated finding: what changed, why, so what |
| **Report Output** | Final narrative ready to copy/send |

## MVP Must-Haves
- [ ] Upload a CSV (Meta/Google ad export format)
- [ ] Parse and display campaigns + key metrics in a clean table
- [ ] AI generates: performance summary, top insights, week-on-week highlights
- [ ] "Ready-to-send" report output (copyable text block)
- [ ] Demo dataset pre-loaded so app is useful on first visit (no login required)
- [ ] Basic error states: bad CSV format, empty data, AI failure

## Non-Goals (v1)
- Meta / Google Ads API direct connection
- Real-time data sync
- Multi-user teams / collaboration
- Forecasting or budget optimisation ML
- Slack / email delivery
- 20-chart dashboards

## Success Criteria
**End-to-end scenario:** A user lands on the app, sees a live demo report with real-looking insights, uploads their own CSV, receives an AI-written performance summary and insight bullets within 30 seconds, then copies the ready-to-send report.
