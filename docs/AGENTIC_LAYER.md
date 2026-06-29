# Agentic Layer — Ads Insight App

## Risk Levels & Actions

### Low Risk — Auto-execute
- **Generate insight bullets** from metric snapshot (summarise/tag)
- **Score campaigns** by performance delta (rule-based)
- **Draft report narrative** from structured metrics
- **Flag anomalies** (e.g. spend spike with no conversions)

### Medium Risk — User confirms before applying
- **Edit insight text** — user can accept AI draft or overwrite (`review_status → 'approved'`)
- **Regenerate report** — re-runs AI call, replaces previous output (shown as diff)

### High Risk — Always requires explicit approval
- **Export and send report** (when email delivery is added in a later sprint)

### Critical — Human only (never automated)
- Delete a report and all its data
- Bulk purge of all user data

## Named Tools (v1)
| Tool | What it does |
|---|---|
| `parse_csv` | Reads file, normalises rows, writes to DB |
| `score_campaigns` | Applies rule-based delta scoring |
| `generate_insights` | Calls OpenAI, stores insight rows |
| `generate_report_output` | Calls OpenAI, stores narrative |

## Audit Log Fields
`id, report_id, user_id, action, tool_used, input_summary, output_summary, ai_model, created_at`

## v1 vs Later
**v1:** Low-risk tools run automatically on upload; medium-risk surfaced for review in UI
**Later:** Scheduled digest agent, Slack/email delivery with approval step
