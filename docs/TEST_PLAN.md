# Test Plan

## v1 Success Scenario — Manual Steps
1. Open app URL (no login). Confirm demo campaign cards are visible.
2. Click **Upload CSV**. Upload a valid CSV with columns: `campaign_name`, `platform`, `spend`, `impressions`, `clicks`, `conversions`.
3. Confirm preview table shows all parsed rows with correct values.
4. Confirm dashboard shows calculated CPC, CTR, CVR, CPA for each campaign.
5. Click **Generate Insights**. Confirm loading spinner appears.
6. Confirm insight panel populates: best campaign, worst campaign, possible reason, recommendation.
7. Open Report page. Confirm AI summary is rendered.
8. Click **Copy** on an insight. Confirm clipboard receives the text.
9. Click **Export**. Confirm file downloads or print dialog opens.
10. Check Supabase `campaigns`, `reports`, `report_insights`, `audit_logs` — confirm rows were written.

## Empty State Tests
- Upload a CSV with no data rows → show "No campaign rows found" error.
- Click Generate Insights before uploading → show "Please upload a CSV first" message.
- Open Report page with no report generated → show "No report yet" empty state.

## Error Case Tests
- Upload a CSV missing the `spend` column → show specific column-name error.
- Upload a file > 5 MB → show file size error before parsing.
- Simulate OpenAI timeout (mock) → show "Insight generation failed, try again" toast; dashboard metrics still visible.
- Upload a CSV with zero conversions for all campaigns → CPA shown as "N/A"; best/worst ranked by CTR fallback.

## Regression Checks (after Sprint 4)
- Log in as User A, upload CSV. Log in as User B — confirm User B cannot see User A's campaigns.
- Anonymous visitor sees demo rows but cannot see any authenticated user's data.
