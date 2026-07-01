import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyReportButton } from "./CopyReportButton";
import {
  formatCurrency,
  formatDateRange,
  formatNumber,
  formatPercent,
  formatRatio,
  titleCase,
} from "@/lib/ads/format";
import { getReportBundle, summarizeCampaigns } from "@/lib/ads/data";
import type { CampaignWithMetrics, MetricSnapshot } from "@/lib/ads/types";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  const { report, campaigns, insights, output } = await getReportBundle(id);
  const totals = summarizeCampaigns(campaigns);

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#171914]">
      <header className="border-b border-[#dfe3d7] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link href="/" className="text-sm font-medium text-[#1f5e4b] hover:underline">
                Back to reports
              </Link>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal">{report.name}</h1>
              <p className="mt-2 text-sm text-[#66705f]">
                {titleCase(report.platform)} -{" "}
                {formatDateRange(report.date_range_start, report.date_range_end)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/upload"
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#c9d0c2] bg-white px-3 text-sm font-semibold text-[#263021] hover:bg-[#f4f7f1]"
              >
                Upload CSV
              </Link>
              <form action={`/api/reports/${report.id}/regenerate`} method="post">
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#1f5e4b] px-3 text-sm font-semibold text-white hover:bg-[#174838]"
                >
                  Regenerate
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="grid gap-3 sm:grid-cols-4">
            <Kpi label="Spend" value={formatCurrency(totals.spend)} />
            <Kpi label="Conversions" value={formatNumber(totals.conversions)} />
            <Kpi label="CPA" value={formatCurrency(totals.cpa)} />
            <Kpi label="ROAS" value={formatRatio(totals.roas)} />
          </section>

          <section className="overflow-hidden rounded-md border border-[#dfe3d7] bg-white">
            <div className="border-b border-[#e6eadf] px-4 py-4">
              <h2 className="text-lg font-semibold">Campaign Metrics</h2>
              <p className="mt-1 text-sm text-[#66705f]">
                This week compared with the prior period when available.
              </p>
            </div>
            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#66705f]">
                No campaigns found in this report.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#e6eadf] bg-[#fbfcfa] text-left text-xs uppercase tracking-[0.06em] text-[#66705f]">
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Spend</th>
                      <th className="px-4 py-3">Impr.</th>
                      <th className="px-4 py-3">Clicks</th>
                      <th className="px-4 py-3">CTR</th>
                      <th className="px-4 py-3">Conv.</th>
                      <th className="px-4 py-3">CPA</th>
                      <th className="px-4 py-3">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <MetricRow key={campaign.id} campaign={campaign} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-md border border-[#dfe3d7] bg-white">
            <div className="border-b border-[#e6eadf] px-4 py-4">
              <h2 className="text-lg font-semibold">Insights</h2>
            </div>
            <div className="divide-y divide-[#edf0e9]">
              {insights.length === 0 ? (
                <p className="p-4 text-sm text-[#66705f]">
                  Analysis unavailable. Try regenerating this report.
                </p>
              ) : (
                insights.map((insight) => (
                  <article key={insight.id} className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-[#edf5ef] px-2 py-0.5 text-xs font-semibold text-[#1f5e4b]">
                        {titleCase(insight.insight_type)}
                      </span>
                      <span className="text-xs text-[#66705f]">
                        {titleCase(insight.body_review_status)}
                      </span>
                    </div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#4f574b]">{insight.body}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-md border border-[#dfe3d7] bg-white">
            <div className="border-b border-[#e6eadf] px-4 py-4">
              <h2 className="text-lg font-semibold">Ready-to-send Report</h2>
            </div>
            <div className="p-4">
              <pre className="max-h-[460px] whitespace-pre-wrap rounded-md bg-[#f4f7f1] p-4 text-sm leading-6 text-[#263021]">
                {output?.narrative ?? "Report output is not ready yet."}
              </pre>
              <CopyReportButton narrative={output?.narrative ?? ""} />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dfe3d7] bg-white p-4">
      <p className="text-sm text-[#66705f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MetricRow({ campaign }: { campaign: CampaignWithMetrics }) {
  const current = pickMetric(campaign.metrics, "This Week") ?? campaign.metrics[0];
  const previous = pickMetric(campaign.metrics, "Last Week");

  return (
    <tr className="border-b border-[#edf0e9] last:border-b-0">
      <td className="px-4 py-4">
        <p className="font-semibold">{campaign.campaign_name}</p>
        <p className="mt-1 text-xs text-[#66705f]">{titleCase(campaign.status)}</p>
      </td>
      <MetricCell current={current?.spend} previous={previous?.spend} formatter={formatCurrency} />
      <MetricCell
        current={current?.impressions}
        previous={previous?.impressions}
        formatter={formatNumber}
      />
      <MetricCell current={current?.clicks} previous={previous?.clicks} formatter={formatNumber} />
      <MetricCell current={current?.ctr} previous={previous?.ctr} formatter={formatPercent} />
      <MetricCell
        current={current?.conversions}
        previous={previous?.conversions}
        formatter={formatNumber}
      />
      <MetricCell current={current?.cpa} previous={previous?.cpa} formatter={formatCurrency} />
      <MetricCell current={current?.roas} previous={previous?.roas} formatter={formatRatio} />
    </tr>
  );
}

function MetricCell({
  current,
  previous,
  formatter,
}: {
  current?: number;
  previous?: number;
  formatter: (value: number | null | undefined) => string;
}) {
  return (
    <td className="px-4 py-4">
      <p className="font-medium">{formatter(current)}</p>
      {previous !== undefined ? (
        <p className="mt-1 text-xs text-[#66705f]">Last: {formatter(previous)}</p>
      ) : null}
    </td>
  );
}

function pickMetric(metrics: MetricSnapshot[], label: string) {
  return metrics.find((metric) => metric.period_label.toLowerCase() === label.toLowerCase());
}
