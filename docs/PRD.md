# Product Requirements Document

## Problem
Marketing teams spend hours exporting data, comparing periods, and writing summaries. Stakeholders only want three answers: what happened, why, and what to do next. Raw CSV data gives them none of that.

## Target User
- **Primary:** Performance marketers, media buyers, marketing analysts
- **Secondary:** Founders and consultants sharing results with clients

## Core Objects
| Object | Purpose |
|---|---|
| `Campaign` | One row of campaign data from a CSV upload |
| `Report` | AI-generated summary tied to an upload batch |
| `ReportInsight` | Individual AI finding (best campaign, reason, recommendation) |
| `AuditLog` | Record of every meaningful system or user action |

## MVP Must-Haves (v1)
- [ ] CSV upload with column validation and row preview
- [ ] Calculated metrics per campaign: CPC, CTR, CVR, CPA
- [ ] Campaign metrics dashboard with charts
- [ ] AI insight generation: best campaign, worst campaign, reasons, recommendations
- [ ] Report page with copy and export
- [ ] App loads with seeded demo data — no login required

## Non-Goals (v1)
Meta/Google API integrations · real-time sync · team workspaces · email reports · predictive forecasting · AI chat · authentication (deferred to Sprint 4)

## Success Criteria
A visitor opens the app, uploads a CSV of campaign data, sees a metrics dashboard, clicks "Generate Insights", reads AI-written findings, and exports a report — all in under 30 seconds, without creating an account.
