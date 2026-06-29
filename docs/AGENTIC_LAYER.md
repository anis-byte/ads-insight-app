# Agentic Layer

## Risk Classification

### Low Risk — Auto-execute
- Summarise campaign batch → AI writes `reports.summary`
- Tag each campaign with performance tier (top / mid / poor) → stored in `campaigns`
- Draft insight bullets → stored as `report_insights` with `review_status = unreviewed`

### Medium Risk — Light Approval
- Overwrite a previously accepted insight with a new AI version (user must confirm)
- Re-generate report for the same batch (replaces existing rows)

### High Risk — Always Approval
- Sending a report to an external email or Slack (v2 feature, not v1)

### Critical — Human Only
- Deleting campaigns or reports from the database
- Bulk data wipe

## Named Tools (v1)
| Tool | Input | Output |
|---|---|---|
| `summarise_batch` | `upload_batch_id` | `reports` row |
| `generate_insights` | `report_id` + campaign rows | `report_insights` rows |
| `export_report` | `report_id` | Markdown / PDF string |

## Audit Log Fields
`action`, `object_type`, `object_id`, `user_id`, `payload` (prompt hash, model, token count), `created_at`

## v1 vs Later
| v1 | Later |
|---|---|
| Manual trigger (button) | Scheduled auto-generation post-upload |
| Text export | Email delivery |
| Single model (gpt-4o) | Model selector / fallback chain |
