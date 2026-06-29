create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  campaign_name text not null,
  platform text not null,
  objective text,
  spend numeric not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  leads integer not null default 0,
  conversions integer not null default 0,
  cpc numeric,
  ctr numeric,
  cvr numeric,
  cpa numeric,
  upload_batch_id uuid,
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
  upload_batch_id uuid,
  summary text,
  summary_source text,
  summary_confidence numeric,
  summary_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table reports enable row level security;
drop policy if exists "reports_v1_read" on reports;
create policy "reports_v1_read" on reports for select using (true);
drop policy if exists "reports_v1_write" on reports;
create policy "reports_v1_write" on reports for all using (true) with check (true);

create table if not exists report_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  report_id uuid references reports(id) on delete cascade,
  insight_type text not null,
  value text not null,
  source text not null default 'openai-gpt-4o',
  confidence numeric,
  review_status text not null default 'unreviewed',
  created_at timestamptz not null default now()
);

alter table report_insights enable row level security;
drop policy if exists "report_insights_v1_read" on report_insights;
create policy "report_insights_v1_read" on report_insights for select using (true);
drop policy if exists "report_insights_v1_write" on report_insights;
create policy "report_insights_v1_write" on report_insights for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  object_type text not null,
  object_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into campaigns (id, campaign_name, platform, objective, spend, impressions, clicks, leads, conversions, cpc, ctr, cvr, cpa, upload_batch_id) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Summer Sale — Search', 'Google Ads', 'Conversions', 4200, 180000, 3600, 210, 95, 1.17, 2.00, 2.64, 44.21, 'demo-batch-0001'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Brand Awareness — Meta', 'Meta Ads', 'Reach', 1800, 520000, 4160, 48, 12, 0.43, 0.80, 0.29, 150.00, 'demo-batch-0001'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Retargeting — Meta', 'Meta Ads', 'Conversions', 900, 62000, 1860, 140, 78, 0.48, 3.00, 4.19, 11.54, 'demo-batch-0001'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Lead Gen — LinkedIn', 'LinkedIn Ads', 'Lead Generation', 3100, 95000, 760, 88, 31, 4.08, 0.80, 4.08, 100.00, 'demo-batch-0001');

insert into reports (id, upload_batch_id, summary, summary_source, summary_confidence, summary_review_status) values
  ('b1b2c3d4-0001-0001-0001-000000000001', 'demo-batch-0001', 'The Retargeting campaign on Meta delivered the strongest efficiency with a CPA of $11.54 and a 4.19% CVR, well above all other campaigns. The Brand Awareness campaign on Meta generated high reach but poor conversion efficiency at a $150 CPA, suggesting audience or landing page misalignment. Reallocating budget from Brand Awareness to Retargeting and Search is recommended.', 'openai-gpt-4o', 0.91, 'unreviewed');

insert into report_insights (report_id, insight_type, value, source, confidence, review_status) values
  ('b1b2c3d4-0001-0001-0001-000000000001', 'best_campaign', 'Retargeting — Meta: lowest CPA ($11.54), highest CVR (4.19%). Strong signal to increase budget here.', 'openai-gpt-4o', 0.93, 'unreviewed'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'worst_campaign', 'Brand Awareness — Meta: CPA of $150 with only 12 conversions from 520k impressions. Poor ROI.', 'openai-gpt-4o', 0.89, 'unreviewed'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'possible_reason', 'Brand Awareness audience is too broad and likely not purchase-intent. Retargeting warm audiences converts 14x cheaper.', 'openai-gpt-4o', 0.85, 'unreviewed'),
  ('b1b2c3d4-0001-0001-0001-000000000001', 'recommendation', 'Shift 30% of Meta Brand Awareness budget to Meta Retargeting and monitor CPA weekly. Pause LinkedIn if lead quality is low.', 'openai-gpt-4o', 0.88, 'unreviewed');