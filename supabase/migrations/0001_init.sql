create extension if not exists pgcrypto;

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text,
  platform text not null default 'meta',
  date_range_start date,
  date_range_end date,
  status text not null default 'ready',
  csv_file_path text,
  created_at timestamptz not null default now()
);

alter table reports add column if not exists user_id uuid;
alter table reports add column if not exists name text;
alter table reports add column if not exists platform text not null default 'meta';
alter table reports add column if not exists date_range_start date;
alter table reports add column if not exists date_range_end date;
alter table reports add column if not exists status text not null default 'ready';
alter table reports add column if not exists csv_file_path text;
alter table reports add column if not exists created_at timestamptz not null default now();
update reports set name = coalesce(name, title, 'Untitled report') where name is null;
alter table reports alter column name set not null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'reports' and column_name = 'title'
  ) then
    alter table reports alter column title drop not null;
    update reports set title = coalesce(title, name, 'Untitled report') where title is null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'reports' and column_name = 'period_label'
  ) then
    alter table reports alter column period_label drop not null;
  end if;
end $$;

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references reports(id) on delete cascade,
  campaign_name text not null,
  platform text not null default 'meta',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table campaigns add column if not exists user_id uuid;
alter table campaigns add column if not exists report_id uuid references reports(id) on delete cascade;
alter table campaigns add column if not exists campaign_name text;
alter table campaigns add column if not exists platform text not null default 'meta';
alter table campaigns add column if not exists status text not null default 'active';
alter table campaigns add column if not exists created_at timestamptz not null default now();
update campaigns set campaign_name = coalesce(campaign_name, 'Untitled campaign') where campaign_name is null;
alter table campaigns alter column campaign_name set not null;

create table if not exists metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  campaign_id uuid references campaigns(id) on delete cascade,
  report_id uuid references reports(id) on delete cascade,
  period_label text not null default 'This Week',
  spend numeric default 0,
  impressions integer default 0,
  clicks integer default 0,
  conversions integer default 0,
  ctr numeric default 0,
  cpl numeric default 0,
  cpa numeric default 0,
  roas numeric default 0,
  raw_extras jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table metric_snapshots add column if not exists raw_extras jsonb not null default '{}'::jsonb;

create table if not exists insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references reports(id) on delete cascade,
  insight_type text not null default 'summary',
  title text not null,
  body text not null,
  body_source text not null default 'openai-gpt4o',
  body_confidence numeric not null default 0.85,
  body_review_status text not null default 'unreviewed',
  metric_context jsonb,
  created_at timestamptz not null default now()
);

create table if not exists report_outputs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references reports(id) on delete cascade,
  narrative text not null,
  narrative_source text not null default 'openai-gpt4o',
  narrative_confidence numeric not null default 0.85,
  narrative_review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references reports(id) on delete set null,
  action text not null,
  tool_used text,
  input_summary text,
  output_summary text,
  ai_model text,
  created_at timestamptz not null default now()
);

alter table reports enable row level security;
drop policy if exists "reports_v1_read" on reports;
create policy "reports_v1_read" on reports for select using (true);
drop policy if exists "reports_v1_write" on reports;
create policy "reports_v1_write" on reports for all using (true) with check (true);

alter table campaigns enable row level security;
drop policy if exists "campaigns_v1_read" on campaigns;
create policy "campaigns_v1_read" on campaigns for select using (true);
drop policy if exists "campaigns_v1_write" on campaigns;
create policy "campaigns_v1_write" on campaigns for all using (true) with check (true);

alter table metric_snapshots enable row level security;
drop policy if exists "metric_snapshots_v1_read" on metric_snapshots;
create policy "metric_snapshots_v1_read" on metric_snapshots for select using (true);
drop policy if exists "metric_snapshots_v1_write" on metric_snapshots;
create policy "metric_snapshots_v1_write" on metric_snapshots for all using (true) with check (true);

alter table insights enable row level security;
drop policy if exists "insights_v1_read" on insights;
create policy "insights_v1_read" on insights for select using (true);
drop policy if exists "insights_v1_write" on insights;
create policy "insights_v1_write" on insights for all using (true) with check (true);

alter table report_outputs enable row level security;
drop policy if exists "report_outputs_v1_read" on report_outputs;
create policy "report_outputs_v1_read" on report_outputs for select using (true);
drop policy if exists "report_outputs_v1_write" on report_outputs;
create policy "report_outputs_v1_write" on report_outputs for all using (true) with check (true);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;

insert into reports (id, name, platform, date_range_start, date_range_end, status)
values
  ('a1000000-0000-0000-0000-000000000001', 'Meta Ads - Week 23 Demo', 'meta', '2024-06-03', '2024-06-09', 'ready'),
  ('a1000000-0000-0000-0000-000000000002', 'Google Ads - June Demo', 'google', '2024-06-01', '2024-06-07', 'ready')
on conflict (id) do update set
  name = excluded.name,
  platform = excluded.platform,
  date_range_start = excluded.date_range_start,
  date_range_end = excluded.date_range_end,
  status = excluded.status;

insert into campaigns (id, report_id, campaign_name, platform, status)
values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Retargeting - US', 'meta', 'active'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Prospecting - Lookalike 2%', 'meta', 'active'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Brand Awareness - Video', 'meta', 'active'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Search - Branded KWs', 'google', 'active'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Search - Competitor KWs', 'google', 'active')
on conflict (id) do update set
  report_id = excluded.report_id,
  campaign_name = excluded.campaign_name,
  platform = excluded.platform,
  status = excluded.status;

delete from metric_snapshots where report_id in ('a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002');
insert into metric_snapshots (campaign_id, report_id, period_label, spend, impressions, clicks, conversions, ctr, cpl, cpa, roas)
values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'This Week', 1420.50, 84200, 1263, 47, 1.50, 30.22, 30.22, 4.10),
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Last Week', 1380.00, 79500, 1100, 38, 1.38, 36.32, 36.32, 3.60),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'This Week', 2100.00, 210000, 2940, 28, 1.40, 75.00, 75.00, 1.80),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Last Week', 1900.00, 195000, 2535, 32, 1.30, 59.38, 59.38, 2.20),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'This Week', 600.00, 320000, 960, 0, 0.30, 0, 0, 0),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'This Week', 880.00, 22000, 1540, 62, 7.00, 14.19, 14.19, 5.80),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'This Week', 540.00, 18000, 630, 11, 3.50, 49.09, 49.09, 2.10);

delete from insights where report_id = 'a1000000-0000-0000-0000-000000000001';
insert into insights (report_id, insight_type, title, body, body_source, body_confidence, body_review_status, metric_context)
values
  ('a1000000-0000-0000-0000-000000000001', 'top_winner', 'Retargeting efficiency up 17%', 'The Retargeting - US campaign cut its CPA from $36.32 to $30.22 week-on-week, a 17% improvement, while conversions grew from 38 to 47. Higher-intent audience and consistent creative are likely drivers.', 'openai-gpt4o', 0.91, 'unreviewed', '{"cpa_delta": -16.8, "conversions_delta": 23.7}'),
  ('a1000000-0000-0000-0000-000000000001', 'top_loser', 'Prospecting ROAS dropped to 1.8x', 'Prospecting - Lookalike 2% saw ROAS fall from 2.2x to 1.8x despite increased spend. Conversions dropped from 32 to 28. The audience may be saturating, so consider refreshing creative or tightening the lookalike percentage.', 'openai-gpt4o', 0.88, 'unreviewed', '{"roas_delta": -18.2, "conversions_delta": -12.5}'),
  ('a1000000-0000-0000-0000-000000000001', 'anomaly', 'Brand Awareness campaign: zero conversions on $600 spend', 'The Brand Awareness - Video campaign recorded 0 conversions this week on $600 of spend. If conversions are expected, check pixel firing and attribution window. If this is a pure awareness play, remove it from ROAS calculations.', 'openai-gpt4o', 0.85, 'unreviewed', '{"spend": 600, "conversions": 0}'),
  ('a1000000-0000-0000-0000-000000000001', 'summary', 'Overall: solid week with one concern', 'Total spend across Meta campaigns was $4,120 this week. Retargeting is your strongest performer at a 4.1x ROAS. Prospecting efficiency is slipping and needs attention before next week budget allocation. Brand Awareness spend should be evaluated against its actual goal.', 'openai-gpt4o', 0.90, 'unreviewed', '{"total_spend": 4120, "blended_roas": 2.8}');

delete from report_outputs where report_id = 'a1000000-0000-0000-0000-000000000001';
insert into report_outputs (report_id, narrative, narrative_source, narrative_confidence, narrative_review_status)
values
  ('a1000000-0000-0000-0000-000000000001', 'Hi [Client],

Here is your Meta Ads performance summary for Week 23 (3-9 June 2024).

The headline: Total spend was $4,120. Your Retargeting campaign delivered a strong 4.1x ROAS and improved CPA by 17% week-on-week, a clear win. Prospecting efficiency dipped (ROAS fell from 2.2x to 1.8x), which we should address with a creative refresh or audience adjustment next week. The Brand Awareness video campaign spent $600 with no recorded conversions, so please confirm whether conversion tracking is intentionally excluded for this campaign.

What to do next:
1. Increase budget allocation to Retargeting by about 15% while performance holds.
2. Pause or test new creatives in the Prospecting campaign.
3. Clarify conversion goal for Brand Awareness or exclude from performance reporting.

Let me know if you have questions!
', 'openai-gpt4o', 0.89, 'unreviewed');
