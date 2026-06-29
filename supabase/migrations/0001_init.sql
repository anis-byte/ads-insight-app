create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  campaign_name text not null,
  platform text not null,
  objective text,
  spend numeric not null default 0,
  impressions bigint not null default 0,
  clicks bigint not null default 0,
  leads integer not null default 0,
  conversions integer not null default 0,
  ctr numeric,
  cpc numeric,
  cpl numeric,
  roas numeric,
  date_start date,
  date_end date,
  created_at timestamptz not null default now()
);

alter table campaigns enable row level security;
drop policy if exists "campaigns_v1_read" on campaigns;
create policy "campaigns_v1_read" on campaigns for select using (true);
drop policy if exists "campaigns_v1_write" on campaigns;
create policy "campaigns_v1_write" on campaigns for all using (true) with check (true);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  period_label text,
  total_spend numeric,
  total_impressions bigint,
  total_clicks bigint,
  total_conversions integer,
  avg_ctr numeric,
  avg_roas numeric,
  created_at timestamptz not null default now()
);

alter table reports enable row level security;
drop policy if exists "reports_v1_read" on reports;
create policy "reports_v1_read" on reports for select using (true);
drop policy if exists "reports_v1_write" on reports;
create policy "reports_v1_write" on reports for all using (true) with check (true);

create table if not exists ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references reports(id) on delete cascade,
  insight_type text not null,
  value text not null,
  source text not null default 'openai/gpt-4o',
  confidence numeric not null default 0.0,
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table ai_insights enable row level security;
drop policy if exists "ai_insights_v1_read" on ai_insights;
create policy "ai_insights_v1_read" on ai_insights for select using (true);
drop policy if exists "ai_insights_v1_write" on ai_insights;
create policy "ai_insights_v1_write" on ai_insights for all using (true) with check (true);

insert into campaigns (campaign_name, platform, objective, spend, impressions, clicks, leads, conversions, ctr, cpc, cpl, roas, date_start, date_end) values
  ('Summer Sale — Search', 'Google Ads', 'Conversions', 4200.00, 310000, 8200, 340, 112, 2.65, 0.51, 12.35, 4.80, '2024-06-01', '2024-06-30'),
  ('Brand Awareness — Meta', 'Meta Ads', 'Reach', 1800.00, 820000, 3100, 90, 28, 0.38, 0.58, 20.00, 2.10, '2024-06-01', '2024-06-30'),
  ('Retargeting — Meta', 'Meta Ads', 'Conversions', 950.00, 95000, 4200, 210, 88, 4.42, 0.23, 4.52, 7.30, '2024-06-01', '2024-06-30'),
  ('Lead Gen — LinkedIn', 'LinkedIn Ads', 'Lead Generation', 3100.00, 120000, 1800, 420, 38, 1.50, 1.72, 7.38, 1.80, '2024-06-01', '2024-06-30'),
  ('YouTube Pre-Roll — Branding', 'Google Ads', 'Brand Awareness', 2200.00, 540000, 2900, 60, 19, 0.54, 0.76, 36.67, 1.20, '2024-06-01', '2024-06-30');

insert into reports (title, period_label, total_spend, total_impressions, total_clicks, total_conversions, avg_ctr, avg_roas) values
  ('June 2024 Campaign Report', 'June 1–30 2024', 12250.00, 1885000, 20200, 285, 1.72, 3.44);

insert into ai_insights (report_id, insight_type, value, source, confidence, review_status)
select
  r.id,
  'best_performer',
  'Retargeting — Meta delivered the highest ROAS (7.3×) at the lowest CPC ($0.23), making it the most efficient campaign in June. Recommend increasing its budget by 20–30%.',
  'openai/gpt-4o',
  0.91,
  'unreviewed'
from reports r where r.title = 'June 2024 Campaign Report'
union all
select
  r.id,
  'worst_performer',
  'YouTube Pre-Roll had the lowest ROAS (1.2×) and highest CPL ($36.67). Consider pausing or shifting budget to lower-funnel channels until brand lift data confirms value.',
  'openai/gpt-4o',
  0.85,
  'unreviewed'
from reports r where r.title = 'June 2024 Campaign Report'
union all
select
  r.id,
  'recommendation',
  'Reallocate 15% of LinkedIn budget to the Meta Retargeting campaign. LinkedIn CPL ($7.38) is competitive for B2B but conversion volume (38) is low relative to spend — test a lead-magnet creative refresh first.',
  'openai/gpt-4o',
  0.78,
  'unreviewed'
from reports r where r.title = 'June 2024 Campaign Report';