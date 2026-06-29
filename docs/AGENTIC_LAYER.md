# Agentic Layer

## Risk Levels & Actions

### Low Risk — Auto-execute
- Compute derived metrics (CTR, CPC, CPL, ROAS) on CSV ingest
- Tag insight type (best_performer / worst_performer / recommendation)
- Score campaigns by ROAS / CTR rules
- Draft AI insight text and store with `review_status = unreviewed`

### Medium Risk — User confirms before executing
- Overwrite existing campaign rows with a re-upload of the same date range
- Mark an insight as `approved` (user clicks Approve)
- Edit AI-generated insight text (user edits → `review_status = edited`)

### High Risk — Explicit approval required
- Export and share report externally (user must click Export)
- *(Future)* Send report via email to a client address

### Critical — Human only
- Delete a campaign batch or report
- *(Future)* Charge or bill actions

## Named Tools (v1)
| Tool | Trigger | Risk |
|---|---|---|
| `parse_csv` | File selected | Low |
| `calculate_metrics` | After parse | Low |
| `generate_insights` | Button click | Low (drafts only) |
| `export_report` | Button click | High |
| `delete_report` | Explicit confirm dialog | Critical |

## Audit Log Fields
Every meaningful action records: `action`, `object_type`, `object_id`, `actor` (user_id or 'anonymous'), `before_state`, `after_state`, `timestamp`.

## v1 vs Later
- **v1:** All tools are single-user, no approval queue UI needed.
- **Later:** Approval queue for multi-user teams; email tool with send confirmation.
