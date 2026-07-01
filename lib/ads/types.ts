export type Report = {
  id: string;
  name: string;
  platform: string;
  date_range_start: string | null;
  date_range_end: string | null;
  status: "processing" | "ready" | "error" | string;
  created_at: string;
};

export type Campaign = {
  id: string;
  report_id: string;
  campaign_name: string;
  platform: string;
  status: string;
};

export type MetricSnapshot = {
  id: string;
  campaign_id: string;
  report_id: string;
  period_label: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpl: number;
  cpa: number;
  roas: number;
};

export type Insight = {
  id: string;
  report_id: string;
  insight_type: string;
  title: string;
  body: string;
  body_source: string;
  body_confidence: number;
  body_review_status: string;
  created_at: string;
};

export type ReportOutput = {
  id: string;
  report_id: string;
  narrative: string;
  narrative_source: string;
  narrative_confidence: number;
  narrative_review_status: string;
};

export type CampaignWithMetrics = Campaign & {
  metrics: MetricSnapshot[];
};
