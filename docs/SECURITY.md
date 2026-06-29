# Security

## Secret Handling
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live in Vercel environment variables only.
- Never imported in `/app` (client) code — only in `/app/api` route handlers.
- `SUPABASE_ANON_KEY` is the only key exposed to the browser (read-only public client).

## Permission Model (v1 → locked)
| Phase | Rule |
|---|---|
| v1 demo | Permissive RLS — all rows readable/writable by anyone (demo mode) |
| Lock-down sprint | RLS owner policies: `auth.uid() = user_id` on all tables |
| Agent actions | Agent calls Supabase with the authenticated user's JWT — inherits their row permissions |

## Approved Tools Rule
Only `summarise_batch`, `generate_insights`, and `export_report` may call external APIs. No raw `eval`, `run_any`, or unrestricted `fetch` in agent code.

## Audit Principle
Every AI call writes a row to `audit_logs` before returning results. Includes: action name, object touched, model used, prompt token count, and timestamp. Logs are append-only — no delete policy.

## Upload Safety
- CSV parsing runs server-side only.
- File size capped at 5 MB in the API route.
- Only expected column names are mapped; all others are dropped.
