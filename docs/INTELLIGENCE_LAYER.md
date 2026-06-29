# Intelligence Layer

## Messy Input
Raw CSV rows: inconsistent column naming, missing values, mixed date formats, no derived metrics.

## Auto-Structuring (on ingest)
```json
{
  "campaign_name": "Summer Sale — Search",
  "platform": "Google Ads",
  "spend": 4200.00,
  "clicks": 8200,
  "impressions": 310000,
  "conversions": 112,
  "ctr": 0.0265,
  "cpc": 0.51,
  "roas": 4.80
}
```
Column aliases mapped at parse time (`Cost` → `spend`, `Impr.` → `impressions`, etc.).

## Events Tracked
- CSV uploaded (row count, column set)
- Metric calculation completed
- Insights generated (model, token count)
- Report exported
- Insight reviewed / edited

## Scoring Rules (rule-based first)
| Rule | Score boost |
|---|---|
| ROAS > 4× | +0.2 |
| CTR > 3% | +0.15 |
| CPC < channel average | +0.15 |
| Conversions < 10 | −0.2 (flag as low volume) |

OpenAI prompt returns a `confidence` float (0–1); stored verbatim.

## What Gets Ranked
Insights sorted by `confidence` descending before display. Best/worst performers ranked by ROAS.

## v1 vs Later
- **v1:** Rule-based metric scoring + OpenAI summary generation.
- **Later:** Fine-tuned prompts per channel; anomaly detection via statistical z-score; period-over-period delta commentary.
