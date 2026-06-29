# Product Requirements Document

## Problem
Marketing teams waste hours exporting CSVs, calculating metrics manually, and writing stakeholder summaries. Stakeholders only want three answers: what happened, why, and what to do next.

## Target Users
- **Primary:** Performance marketers, media buyers, marketing analysts
- **Secondary:** Founders, consultants sharing results with clients

## Core Objects
| Object | Purpose |
|---|---|
| `Campaign` | One row of channel/metric data from a CSV upload |
| `Report` | Aggregated summary across a batch of campaigns |
| `AI Insight` | Single AI-generated finding tied to a report |

## MVP Checklist (v1)
- [ ] CSV upload with column validation and data preview
- [ ] Derived metric calculation (CTR, CPC, CPL, ROAS) on ingest
- [ ] Dashboard: KPI cards + bar/line charts across campaigns
- [ ] AI insight generation: best performer, worst performer, recommendations
- [ ] Store every AI field with `value`, `source`, `confidence`, `review_status`
- [ ] Report page: summary + findings + recommendations
- [ ] Export report as text/markdown download
- [ ] Copy individual insight to clipboard
- [ ] Seed demo campaigns so app is live without login

## Non-Goals (v1)
- Meta / Google Ads API integrations
- User accounts and per-user data isolation
- Team workspaces, sharing, or email delivery
- Predictive forecasting or AI chat
- Period-over-period comparison view

## Success Scenario
A visitor opens the app, uploads a 5-campaign CSV, clicks **Generate Insights**, and within 30 seconds sees a dashboard with KPI cards, a chart, three AI insights, and downloads a formatted report — without creating an account.
