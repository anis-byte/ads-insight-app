# Security — Ads Insight App

## Secret Handling
- `OPENAI_API_KEY` lives only in Vercel environment variables — never in client code or logs
- Supabase `service_role` key used only in server-side API routes
- Frontend uses only the Supabase `anon` key with RLS as the guard

## Permission Model (v1 → lock-down)
- **v1 (demo):** Permissive RLS — all rows readable/writable without login; safe because no real user data yet
- **Lock-down sprint:** RLS policies changed to `auth.uid() = user_id`; every write stamps `user_id`
- **Agent permissions:** AI tools inherit the session context — they can only read/write rows the current user owns

## Approved-Tools Rule
- Only the four named tools (`parse_csv`, `score_campaigns`, `generate_insights`, `generate_report_output`) may call OpenAI
- No `eval`, no dynamic code execution, no `run_any` patterns
- Tool inputs are validated server-side before the AI call

## Audit Principle
- Every AI call writes one `audit_log` row: action, tool, model, input summary (no raw PII), output summary, timestamp
- Report deletions are logged before the delete executes
- Logs are append-only; no UI to delete audit rows
