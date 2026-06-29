# Test Plan

## v1 Success Scenario (manual walkthrough)
1. Open the app at `/` — dashboard loads with seed campaign data and KPI cards. No login required.
2. Click **Upload CSV** → upload `demo-data.csv` (5 campaigns).
3. Confirm preview table shows 5 rows with correct column mapping.
4. Click **Confirm Upload** → loading spinner → dashboard refreshes with new campaign rows added.
5. Verify KPI cards update (Total Spend, Impressions, Clicks, avg ROAS reflect uploaded data).
6. Click **Generate Insights** → loading state appears on button.
7. Wait ≤ 30 seconds → button resolves → toast "Insights ready".
8. Click **View Report** → `/report/[id]` renders: summary card, ≥ 2 findings, ≥ 1 recommendation, each with a confidence badge.
9. Click **Export Report** → `.md` file downloads with campaign summary and all insights.
10. Click **Copy** on one insight → clipboard contains insight text (browser confirms).

## Empty State Cases
- Visit `/dashboard` with no campaigns: shows "No data yet — upload a CSV to get started" prompt with Upload button.
- Visit `/report/nonexistent-id`: shows 404 message, not a blank page.

## Error Cases
| Scenario | Expected behaviour |
|---|---|
| CSV missing required `spend` column | Red validation banner listing missing columns; no rows inserted |
| CSV > 5 MB | "File too large (max 5 MB)" error before upload attempt |
| OpenAI API key missing / rate limited | Error toast; partial report saved with `value = 'Generation failed'` |
| Upload same campaign names twice | Warning: "X rows already exist for this period" with option to overwrite or cancel |
| Network drops mid-upload | Error toast "Upload failed — please retry"; no partial rows in DB |

## Regression Checks (after each sprint)
- Seed rows still visible on dashboard after new upload.
- Metric calculations: CTR = clicks ÷ impressions (verify with known values).
- `review_status` defaults to `unreviewed` on all new AI insight rows.
- No `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` appears in browser network tab responses.
