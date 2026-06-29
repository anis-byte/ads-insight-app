# Intelligence Layer

## Messy Input
A raw CSV from a marketer — inconsistent column names, mixed platforms, blank cells, no calculated metrics.

## Auto-Structure
After upload, the API normalises each row to:
```json
{
  "campaign_name": "Summer Sale — Search",
  "platform": "Google Ads",
  "spend": 4200,
  "impressions": 180000,
  "clicks": 3600,
  "conversions": 95,
  "cpc": 1.17,
  "ctr": 2.00,
  "cvr": 2.64,
  "cpa": 44.21
}
```

## Events That Trigger AI
| Event | Action |
|---|---|
| User clicks "Generate Insights" | OpenAI called with structured batch summary |
| User edits an insight | `review_status` → `edited`, new value stored |
| User accepts/rejects insight | `review_status` updated in DB |

## Scoring Rules (rule-based first)
- **Best campaign:** lowest CPA where conversions > 0
- **Worst campaign:** highest CPA or lowest CTR with meaningful spend (> 10% of batch total)
- **Efficiency score:** normalised composite of CPA rank + CTR rank + CVR rank (0–100)

Rule-based ranking runs even if OpenAI is unavailable. AI adds narrative explanation on top.

## v1 vs Later
| v1 | Later |
|---|---|
| Single-batch AI summary | Multi-period trend analysis |
| Text insights in dashboard | Confidence badges + inline edit UI |
| Rule-based campaign ranking | ML-scored anomaly detection |
