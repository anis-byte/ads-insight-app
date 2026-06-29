# Data Model — Ads Insight App

## reports
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner, set at lock-down |
| name | text | e.g. "Meta Ads — Week 23" |
| platform | text | 'meta' \| 'google' \| 'other' |
| date_range_start | date | |
| date_range_end | date | |
| status | text | 'processing' \| 'ready' \| 'error' |
| csv_file_path | text | Supabase Storage path |
| created_at | timestamptz | |

## campaigns
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| report_id | uuid FK → reports | |
| campaign_name | text | |
| platform | text | |
| status | text | |
| created_at | timestamptz | |

## metric_snapshots
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| campaign_id | uuid FK → campaigns | |
| report_id | uuid FK → reports | |
| period_label | text | e.g. 'This Week', 'Last Week' |
| spend | numeric | |
| impressions | integer | |
| clicks | integer | |
| conversions | integer | |
| ctr | numeric | |
| cpl | numeric | |
| cpa | numeric | |
| roas | numeric | |
| created_at | timestamptz | |

## insights
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| report_id | uuid FK → reports | |
| insight_type | text | 'top_winner' \| 'top_loser' \| 'anomaly' \| 'summary' |
| title | text | Short headline |
| body | text | **AI-generated** |
| body_source | text | 'openai-gpt4o' |
| body_confidence | numeric | 0–1 |
| body_review_status | text | 'unreviewed' \| 'approved' \| 'edited' |
| metric_context | jsonb | raw numbers that drove this insight |
| created_at | timestamptz | |

## report_outputs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| report_id | uuid FK → reports | |
| narrative | text | **AI-generated** full report copy |
| narrative_source | text | 'openai-gpt4o' |
| narrative_confidence | numeric | |
| narrative_review_status | text | 'unreviewed' \| 'approved' |
| created_at | timestamptz | |

## RLS Notes
- All tables: RLS enabled, v1 permissive (read + write open) — lock-down sprint replaces with `auth.uid() = user_id`.
