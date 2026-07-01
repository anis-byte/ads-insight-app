# Ads Insight App

Upload a Meta or Google Ads CSV, parse campaign metrics, generate insight cards, and copy a ready-to-send client report.

## Demo Flow

1. Visit `/` and open the seeded Meta demo report.
2. Open `/upload`.
3. Upload `public/samples/demo_meta_ads.csv`.
4. The app redirects to the generated report with campaign rows, insights, and report copy.
5. Use **Copy Report** to copy the narrative or **Regenerate** to rebuild insights.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Database | Supabase Postgres |
| Storage | Supabase Storage |
| AI | OpenAI when `OPENAI_API_KEY` is configured, rule-based fallback otherwise |
| Deploy | Vercel |

## Local Development

```bash
npm install
vercel env pull .env.local --yes
npm run dev
```

The Supabase schema lives in `supabase/migrations`. The app can run without login for the MVP demo because v1 RLS policies are intentionally permissive.

## Verification

```bash
npm run typecheck
npm run build
```
