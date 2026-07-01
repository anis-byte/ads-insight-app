import { NextResponse } from "next/server";
import { parseAdsCsv, inferDateRange } from "@/lib/ads/csv";
import { runReportAnalysis } from "@/lib/ads/intelligence";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  let reportId: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const platform = String(formData.get("platform") ?? "other").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please upload a .csv file" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json({ error: "Please upload a .csv file" }, { status: 400 });
    }

    const csv = await file.text();
    const rows = parseAdsCsv(csv, platform);
    const dateRange = inferDateRange(rows);
    const reportName = cleanReportName(file.name);

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        name: reportName,
        platform,
        date_range_start: dateRange.start,
        date_range_end: dateRange.end,
        status: "processing",
      })
      .select("id")
      .single();

    if (reportError) throw new Error(reportError.message);
    reportId = report.id;

    const filePath = `${reportId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error: storageError } = await supabase.storage
      .from("csv-uploads")
      .upload(filePath, file, { contentType: file.type || "text/csv", upsert: false });
    if (storageError) throw new Error(storageError.message);

    const { error: filePathError } = await supabase
      .from("reports")
      .update({ csv_file_path: filePath })
      .eq("id", reportId);
    if (filePathError) throw new Error(filePathError.message);

    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .insert(
        rows.map((row) => ({
          report_id: reportId,
          campaign_name: row.campaignName,
          platform: row.platform,
          status: row.status,
        })),
      )
      .select("id");

    if (campaignsError) throw new Error(campaignsError.message);
    if (!campaigns || campaigns.length !== rows.length) {
      throw new Error("Campaign insert did not return the expected rows");
    }

    const { error: metricsError } = await supabase.from("metric_snapshots").insert(
      rows.map((row, index) => ({
        report_id: reportId,
        campaign_id: campaigns[index].id,
        period_label: row.periodLabel,
        spend: row.spend,
        impressions: row.impressions,
        clicks: row.clicks,
        conversions: row.conversions,
        ctr: row.ctr,
        cpl: row.cpl,
        cpa: row.cpa,
        roas: row.roas,
        raw_extras: row.rawExtras,
      })),
    );

    if (metricsError) throw new Error(metricsError.message);

    await runReportAnalysis(report.id);

    const { error: readyError } = await supabase
      .from("reports")
      .update({ status: "ready" })
      .eq("id", reportId);
    if (readyError) throw new Error(readyError.message);

    return NextResponse.json({ reportId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    if (reportId) {
      await supabase.from("reports").update({ status: "error" }).eq("id", reportId);
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function cleanReportName(fileName: string) {
  return fileName
    .replace(/\.csv$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
