# Security

## Secret Handling
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live in Vercel environment variables only.
- Client-side code uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- No secrets are imported into any file under `/app` (frontend) or returned in API responses.

## Permission Model (current → lock-down)
| Phase | Model |
|---|---|
| v1 (demo) | Permissive RLS — all rows readable/writable; no login required |
| Lock-down sprint | Supabase Auth; RLS policies scoped to `auth.uid() = user_id`; service role used only in server-side route handlers |

## Approved Tools Rule
API route handlers call only named, scoped tools (`parse_csv`, `calculate_metrics`, `generate_insights`, `export_report`). No `eval`, no `exec`, no wildcard shell commands. Agent actions are implemented as discrete functions with typed inputs.

## Audit Principle
Every write operation (upload, insight generation, export, delete) logs actor + object + timestamp to Supabase. Logs are append-only; no route exposes a bulk-delete endpoint for logs.
