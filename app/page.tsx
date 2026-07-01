import Link from "next/link";
import { formatCurrency, formatDateRange, titleCase } from "@/lib/ads/format";
import { getReports } from "@/lib/ads/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reports = await getReports();

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#171914]">
      <section className="border-b border-[#dfe3d7] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#60705a]">
                Ads Insight App
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
                Reports ready to inspect, upload, and send.
              </h1>
            </div>
            <Link
              href="/upload"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#1f5e4b] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174838]"
            >
              Upload CSV
            </Link>
          </div>
          <p className="max-w-3xl text-base leading-7 text-[#4f574b]">
            Start with the seeded demo report, then upload a Meta or Google Ads CSV to
            generate campaign metrics, insight bullets, and a copyable client summary.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Report History</h2>
          <span className="text-sm text-[#66705f]">{reports.length} reports</span>
        </div>

        {reports.length === 0 ? (
          <div className="rounded-md border border-dashed border-[#c9d0c2] bg-white p-8 text-center">
            <h3 className="text-lg font-semibold">Upload your first CSV</h3>
            <p className="mt-2 text-sm text-[#66705f]">
              No reports are available yet. Upload a CSV to build the first analysis.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-[#dfe3d7] bg-white">
            <div className="grid grid-cols-[1.3fr_0.7fr_0.8fr_0.5fr] gap-4 border-b border-[#e6eadf] px-4 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-[#66705f] max-md:hidden">
              <span>Report</span>
              <span>Platform</span>
              <span>Period</span>
              <span>Status</span>
            </div>
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="grid gap-3 border-b border-[#edf0e9] px-4 py-4 transition last:border-b-0 hover:bg-[#f9fbf7] md:grid-cols-[1.3fr_0.7fr_0.8fr_0.5fr] md:items-center"
              >
                <div>
                  <p className="font-semibold">{report.name}</p>
                  <p className="mt-1 text-sm text-[#66705f]">
                    Created {new Date(report.created_at).toLocaleDateString("en-US")}
                  </p>
                </div>
                <span className="text-sm">{titleCase(report.platform)}</span>
                <span className="text-sm">
                  {formatDateRange(report.date_range_start, report.date_range_end)}
                </span>
                <span className="w-fit rounded-full bg-[#edf5ef] px-2.5 py-1 text-xs font-semibold text-[#1f5e4b]">
                  {titleCase(report.status)}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryTile label="Demo Flow" value="No login" />
          <SummaryTile label="Core Output" value="Insights + copy" />
          <SummaryTile label="Primary KPI" value={formatCurrency(4120)} />
        </div>
      </section>
    </main>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dfe3d7] bg-white p-4">
      <p className="text-sm text-[#66705f]">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
