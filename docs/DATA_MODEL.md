# Data Model

## campaigns
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | auto |
| user_id | uuid nullable | owner (null = demo row) |
| campaign_name | text | |
| platform | text | e.g. Google Ads, Meta Ads |
| objective | text | |
| spend | numeric | raw from CSV |
| impressions | integer | |
| clicks | integer | |
| leads | integer | |
| conversions | integer | |
| cpc | numeric | calculated: spend/clicks |
| ctr | numeric | calculated: clicks/impressions |
| cvr | numeric | calculated: conversions/clicks |
| cpa | numeric | calculated: spend/conversions |
| upload_batch_id | uuid | groups one CSV upload |
| created_at | timestamptz | |

## reports
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| upload_batch_id | uuid | links to campaigns batch |
| summary | text | **AI field** |
| summary_source | text | e.g. `openai-gpt-4o` |
| summary_confidence | numeric | 0–1 |
| summary_review_status | text | `unreviewed` / `accepted` / `edited` / `rejected` |
| created_at | timestamptz | |

## report_insights
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| report_id | uuid FK → reports | |
| insight_type | text | `best_campaign` / `worst_campaign` / `possible_reason` / `recommendation` |
| value | text | **AI field** — the insight text |
| source | text | `openai-gpt-4o` |
| confidence | numeric | 0–1 |
| review_status | text | `unreviewed` / `accepted` / `edited` / `rejected` |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| action | text | e.g. `csv_uploaded`, `insights_generated` |
| object_type | text | `campaign` / `report` / `report_insight` |
| object_id | uuid | |
| payload | jsonb | relevant context snapshot |
| created_at | timestamptz | |

## RLS
All tables use permissive v1 policies (select/all = true). Sprint 4 replaces with `auth.uid() = user_id`.
