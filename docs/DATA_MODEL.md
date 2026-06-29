# Data Model

## campaigns
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | auto |
| user_id | uuid nullable | owner — no FK yet; set at lock-down |
| campaign_name | text | e.g. "Summer Sale — Search" |
| platform | text | Google Ads / Meta Ads / LinkedIn Ads |
| objective | text | Conversions / Reach / Lead Generation |
| spend | numeric | raw from CSV |
| impressions | bigint | |
| clicks | bigint | |
| leads | integer | |
| conversions | integer | |
| ctr | numeric | calculated on ingest: clicks/impressions |
| cpc | numeric | spend/clicks |
| cpl | numeric | spend/leads |
| roas | numeric | revenue/spend (if revenue column present) |
| date_start | date | |
| date_end | date | |
| created_at | timestamptz | |

## reports
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| title | text | e.g. "June 2024 Campaign Report" |
| period_label | text | human-readable date range |
| total_spend | numeric | |
| total_impressions | bigint | |
| total_clicks | bigint | |
| total_conversions | integer | |
| avg_ctr | numeric | |
| avg_roas | numeric | |
| created_at | timestamptz | |

## ai_insights
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| report_id | uuid FK → reports | cascade delete |
| insight_type | text | best_performer / worst_performer / recommendation / anomaly |
| value | text | **AI-generated** — the insight text |
| source | text | e.g. `openai/gpt-4o` |
| confidence | numeric | 0.0–1.0 returned by prompt |
| review_status | text | unreviewed / approved / edited |
| created_at | timestamptz | |

## RLS Notes
- v1: permissive read + write for all tables (demo-first).
- Lock-down sprint: replace with `auth.uid() = user_id` owner policies.
