# Test Plan — Ads Insight App

## v1 Success Scenario (Manual)
1. Visit `/` — confirm demo report list renders without login
2. Click demo report → confirm metric table shows campaign rows with CTR, CPA, ROAS, spend
3. Click **Upload CSV** → upload `demo_meta_ads.csv` (provided in `/public/samples/`)
4. Confirm loading state appears (`status: processing`)
5. Confirm redirect to new `/reports/[id]` within 5 seconds
6. Confirm campaign table populated with correct values from CSV
7. Confirm 3–5 insight cards appear with title + body
8. Confirm report output block renders narrative text
9. Click **Copy Report** → paste into text editor, confirm full narrative copied
10. Click **Regenerate** → confirm new insights appear; old ones replaced

## Empty / Edge Cases
| Scenario | Expected behaviour |
|---|---|
| Upload non-CSV file | Error toast: "Please upload a .csv file" |
| Upload CSV with missing `spend` column | Error: "Required column 'spend' not found" |
| Upload empty CSV (headers only) | Error: "No data rows found in this file" |
| OpenAI API timeout | Metric table still renders; insight cards show "Analysis unavailable — try regenerating" |
| Report with 0 conversions across all campaigns | Insight card flags: "No conversions recorded — check tracking setup" |
| Navigate to non-existent `/reports/[fake-id]` | 404 page with link back to report list |

## Regression Checks (run after each sprint)
- [ ] Demo seed data still visible at `/`
- [ ] Metric table numbers match CSV input exactly
- [ ] Audit log row created for every AI tool call
- [ ] No API keys visible in browser network tab
- [ ] Delete report removes campaigns, metrics, insights, output (cascade)
