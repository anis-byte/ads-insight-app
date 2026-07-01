import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Campaign,
  CampaignWithMetrics,
  Insight,
  MetricSnapshot,
  Report,
  ReportOutput,
} from "./types";

export async function getReports() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id,name,platform,date_range_start,date_range_end,status,created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Report[];
}

export async function getReportBundle(reportId: string) {
  const supabase = await createClient();
  const [reportResult, campaignsResult, metricsResult, insightsResult, outputResult] =
    await Promise.all([
      supabase
        .from("reports")
        .select("id,name,platform,date_range_start,date_range_end,status,created_at")
        .eq("id", reportId)
        .single(),
      supabase
        .from("campaigns")
        .select("id,report_id,campaign_name,platform,status")
        .eq("report_id", reportId)
        .order("campaign_name", { ascending: true }),
      supabase
        .from("metric_snapshots")
        .select(
          "id,campaign_id,report_id,period_label,spend,impressions,clicks,conversions,ctr,cpl,cpa,roas",
        )
        .eq("report_id", reportId)
        .order("period_label", { ascending: false }),
      supabase
        .from("insights")
        .select(
          "id,report_id,insight_type,title,body,body_source,body_confidence,body_review_status,created_at",
        )
        .eq("report_id", reportId)
        .order("created_at", { ascending: true }),
      supabase
        .from("report_outputs")
        .select(
          "id,report_id,narrative,narrative_source,narrative_confidence,narrative_review_status",
        )
        .eq("report_id", reportId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (reportResult.error) {
    if (reportResult.error.code === "PGRST116") notFound();
    throw new Error(reportResult.error.message);
  }
  for (const result of [campaignsResult, metricsResult, insightsResult, outputResult]) {
    if (result.error) throw new Error(result.error.message);
  }

  const campaigns = (campaignsResult.data ?? []) as Campaign[];
  const metrics = (metricsResult.data ?? []) as MetricSnapshot[];
  const metricsByCampaign = new Map<string, MetricSnapshot[]>();
  for (const metric of metrics) {
    metricsByCampaign.set(metric.campaign_id, [
      ...(metricsByCampaign.get(metric.campaign_id) ?? []),
      metric,
    ]);
  }

  return {
    report: reportResult.data as Report,
    campaigns: campaigns.map((campaign) => ({
      ...campaign,
      metrics: metricsByCampaign.get(campaign.id) ?? [],
    })) as CampaignWithMetrics[],
    insights: (insightsResult.data ?? []) as Insight[],
    output: outputResult.data as ReportOutput | null,
  };
}

export function summarizeCampaigns(campaigns: CampaignWithMetrics[]) {
  const current = campaigns.flatMap((campaign) =>
    campaign.metrics.filter((metric) => metric.period_label === "This Week"),
  );
  const source = current.length > 0 ? current : campaigns.flatMap((campaign) => campaign.metrics);
  const totals = source.reduce(
    (acc, metric) => ({
      spend: acc.spend + Number(metric.spend),
      impressions: acc.impressions + Number(metric.impressions),
      clicks: acc.clicks + Number(metric.clicks),
      conversions: acc.conversions + Number(metric.conversions),
      roasWeighted: acc.roasWeighted + Number(metric.roas) * Number(metric.spend),
    }),
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, roasWeighted: 0 },
  );

  return {
    ...totals,
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    cpa: totals.conversions > 0 ? totals.spend / totals.conversions : 0,
    roas: totals.spend > 0 ? totals.roasWeighted / totals.spend : 0,
  };
}
