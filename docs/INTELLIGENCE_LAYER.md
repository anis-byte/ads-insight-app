# Intelligence Layer — Ads Insight App

## Messy Input
Raw CSV with inconsistent column names, mixed platforms, missing cells, varied date formats.

## Auto-Structure Step
Server-side parser normalises every CSV row into this shape before storing:
```json
{
  "campaign_name": "Retargeting — US",
  "platform": "meta",
  "period": "2024-W23",
  "spend": 1420.50,
  "impressions": 84200,
  "clicks": 1263,
  "conversions": 47,
  "ctr": 1.50,
  "cpa": 30.22,
  "roas": 4.1
}
```
Unrecognised columns are stored in a `raw_extras` jsonb field — not discarded.

## Events to Track
- CSV uploaded
- Parse succeeded / failed
- AI insight generated (per insight)
- Report output generated
- User copied report
- User edited insight (sets `review_status = 'edited'`)

## Scoring Rules (rule-based v1)
| Signal | Score bump |
|---|---|
| CPA decreased >10% WoW | +2 |
| ROAS increased >15% WoW | +2 |
| CTR dropped >20% WoW | −2 |
| Spend with zero conversions | −3 |
Insights sorted by `abs(score) DESC` → top 3 surfaced first.

## AI Prompt Strategy
- Input: structured JSON of top/bottom campaigns + WoW deltas
- Output: 3–5 insight bullets + 1 narrative paragraph
- Temperature: 0.3 (factual, not creative)

## v1 vs Later
**v1:** Rule-based scoring + GPT-4o narrative on demand
**Later:** Fine-tuned tone matching, automated weekly digest, anomaly detection with statistical significance
