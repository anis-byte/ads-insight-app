import { createClient } from "@/lib/supabase/server";
import type { CampaignWithMetrics, Insight } from "./types";

type ScoredCampaign = {
  campaignName: string;
  score: number;
  reasons: string[];
  current: {
    spend: number;
    conversions: number;
    ctr: number;
    cpa: number;
    roas: number;
  };
  previous?: {
    spend: number;
    conversions: number;
    ctr: number;
    cpa: number;
    roas: number;
  };
};

type GeneratedInsight = Pick<
  Insight,
  "insight_type" | "title" | "body" | "body_source" | "body_confidence" | "body_review_status"
> & {
  metric_context: Record<string, unknown>;
};

export async function runReportAnalysis(reportId: string) {
  const supabase = await createClient();
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select(
      "id,report_id,campaign_name,platform,status,metric_snapshots(id,campaign_id,report_id,period_label,spend,impressions,clicks,conversions,ctr,cpl,cpa,roas)",
    )
    .eq("report_id", reportId);

  if (error) throw new Error(error.message);

  const normalized = (campaigns ?? []).map((campaign) => ({
    id: campaign.id,
    report_id: campaign.report_id,
    campaign_name: campaign.campaign_name,
    platform: campaign.platform,
    status: campaign.status,
    metrics: campaign.metric_snapshots ?? [],
  })) as CampaignWithMetrics[];

  const scored = scoreCampaigns(normalized);
  const openAiInsights = await generateWithOpenAI(scored).catch(() => null);
  const insights = openAiInsights?.insights ?? generateRuleBasedInsights(scored);
  const narrative = openAiInsights?.narrative ?? generateRuleBasedNarrative(scored);
  const source = openAiInsights ? "openai-gpt4o" : "rule-based-v1";

  await supabase.from("insights").delete().eq("report_id", reportId);
  await supabase.from("report_outputs").delete().eq("report_id", reportId);

  const { error: insightError } = await supabase.from("insights").insert(
    insights.map((insight) => ({
      report_id: reportId,
      insight_type: insight.insight_type,
      title: insight.title,
      body: insight.body,
      body_source: source,
      body_confidence: insight.body_confidence,
      body_review_status: "unreviewed",
      metric_context: insight.metric_context,
    })),
  );
  if (insightError) throw new Error(insightError.message);

  const { error: outputError } = await supabase.from("report_outputs").insert({
    report_id: reportId,
    narrative,
    narrative_source: source,
    narrative_confidence: openAiInsights ? 0.86 : 0.72,
    narrative_review_status: "unreviewed",
  });
  if (outputError) throw new Error(outputError.message);

  await Promise.all([
    audit(reportId, "score_campaigns", "score_campaigns", `${scored.length} campaigns scored`, "Scores computed", null),
    audit(
      reportId,
      "generate_insights",
      "generate_insights",
      `${scored.length} scored campaigns`,
      `${insights.length} insights stored`,
      openAiInsights ? "gpt-4o" : null,
    ),
    audit(
      reportId,
      "generate_report_output",
      "generate_report_output",
      `${insights.length} insights summarized`,
      "Narrative stored",
      openAiInsights ? "gpt-4o" : null,
    ),
  ]);

  return { insights: insights.length, source };
}

export function scoreCampaigns(campaigns: CampaignWithMetrics[]) {
  return campaigns.map((campaign) => {
    const current = pickMetric(campaign, "This Week") ?? campaign.metrics[0];
    const previous = pickMetric(campaign, "Last Week");
    const reasons: string[] = [];
    let score = 0;

    if (current && previous) {
      if (previous.cpa > 0 && delta(current.cpa, previous.cpa) < -10) {
        score += 2;
        reasons.push(`CPA improved ${Math.abs(delta(current.cpa, previous.cpa)).toFixed(0)}%`);
      }
      if (previous.roas > 0 && delta(current.roas, previous.roas) > 15) {
        score += 2;
        reasons.push(`ROAS increased ${delta(current.roas, previous.roas).toFixed(0)}%`);
      }
      if (previous.ctr > 0 && delta(current.ctr, previous.ctr) < -20) {
        score -= 2;
        reasons.push(`CTR dropped ${Math.abs(delta(current.ctr, previous.ctr)).toFixed(0)}%`);
      }
    }

    if (current && current.spend > 0 && current.conversions === 0) {
      score -= 3;
      reasons.push(`Spent $${current.spend.toFixed(0)} with no conversions`);
    }

    if (reasons.length === 0) reasons.push("Performance is stable against available data");

    return {
      campaignName: campaign.campaign_name,
      score,
      reasons,
      current: {
        spend: Number(current?.spend ?? 0),
        conversions: Number(current?.conversions ?? 0),
        ctr: Number(current?.ctr ?? 0),
        cpa: Number(current?.cpa ?? 0),
        roas: Number(current?.roas ?? 0),
      },
      previous: previous
        ? {
            spend: Number(previous.spend),
            conversions: Number(previous.conversions),
            ctr: Number(previous.ctr),
            cpa: Number(previous.cpa),
            roas: Number(previous.roas),
          }
        : undefined,
    };
  });
}

function generateRuleBasedInsights(scored: ScoredCampaign[]): GeneratedInsight[] {
  const sorted = [...scored].sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  const totalSpend = scored.reduce((sum, campaign) => sum + campaign.current.spend, 0);
  const totalConversions = scored.reduce((sum, campaign) => sum + campaign.current.conversions, 0);
  const insights: GeneratedInsight[] = sorted.slice(0, 4).map((campaign) => {
    const isWinner = campaign.score > 0;
    const isAnomaly = campaign.current.spend > 0 && campaign.current.conversions === 0;
    return {
      insight_type: isAnomaly ? "anomaly" : isWinner ? "top_winner" : "top_loser",
      title: isAnomaly
        ? `${campaign.campaignName}: spend with no conversions`
        : isWinner
          ? `${campaign.campaignName} is gaining efficiency`
          : `${campaign.campaignName} needs attention`,
      body: `${campaign.reasons.join(". ")}. Current spend is $${campaign.current.spend.toFixed(
        0,
      )}, CPA is $${campaign.current.cpa.toFixed(2)}, and ROAS is ${campaign.current.roas.toFixed(
        2,
      )}x.`,
      body_source: "rule-based-v1",
      body_confidence: 0.72,
      body_review_status: "unreviewed",
      metric_context: campaign,
    };
  });

  insights.unshift({
    insight_type: "summary",
    title: "Overall performance summary",
    body: `Across this report, spend totals $${totalSpend.toFixed(
      0,
    )} with ${totalConversions} conversions. The strongest actions are to scale clear winners, inspect campaigns with no conversions, and refresh any campaign with weakening efficiency.`,
    body_source: "rule-based-v1",
    body_confidence: 0.72,
    body_review_status: "unreviewed",
    metric_context: { totalSpend, totalConversions },
  });

  return insights.slice(0, 5);
}

function generateRuleBasedNarrative(scored: ScoredCampaign[]) {
  const totalSpend = scored.reduce((sum, campaign) => sum + campaign.current.spend, 0);
  const totalConversions = scored.reduce((sum, campaign) => sum + campaign.current.conversions, 0);
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const concern = [...sorted].reverse()[0];

  return `Hi [Client],

Here is the latest paid ads performance summary.

The headline: total spend was $${totalSpend.toFixed(0)} and the account generated ${totalConversions} conversions. ${
    winner
      ? `${winner.campaignName} is the clearest campaign to protect or scale because ${winner.reasons[0].toLowerCase()}.`
      : "No campaign rows were available to rank."
  } ${
    concern && concern !== winner
      ? `${concern.campaignName} needs attention because ${concern.reasons[0].toLowerCase()}.`
      : ""
  }

What to do next:
1. Shift budget toward campaigns with improving CPA or ROAS.
2. Review any campaign spending without conversions and confirm tracking is working.
3. Refresh creative or targeting where CTR, CPA, or ROAS is weakening.

Let me know if you have questions.`;
}

async function generateWithOpenAI(scored: ScoredCampaign[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write factual paid ads performance insights. Return JSON with insights array and narrative string.",
        },
        {
          role: "user",
          content: JSON.stringify({
            scoredCampaigns: scored,
            schema:
              "insights: [{insight_type,title,body,body_confidence,metric_context}], narrative: string",
          }),
        },
      ],
    }),
  });

  if (!response.ok) throw new Error("OpenAI analysis failed");
  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI analysis returned no content");
  const parsed = JSON.parse(content) as {
    insights: GeneratedInsight[];
    narrative: string;
  };
  return parsed;
}

async function audit(
  reportId: string,
  action: string,
  toolUsed: string,
  inputSummary: string,
  outputSummary: string,
  aiModel: string | null,
) {
  const supabase = await createClient();
  await supabase.from("audit_logs").insert({
    report_id: reportId,
    action,
    tool_used: toolUsed,
    input_summary: inputSummary,
    output_summary: outputSummary,
    ai_model: aiModel,
  });
}

function pickMetric(campaign: CampaignWithMetrics, label: string) {
  return campaign.metrics.find((metric) => metric.period_label.toLowerCase() === label.toLowerCase());
}

function delta(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((Number(current) - Number(previous)) / Number(previous)) * 100;
}
