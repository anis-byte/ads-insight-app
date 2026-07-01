import { redirect } from "next/navigation";
import { runReportAnalysis } from "@/lib/ads/intelligence";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await runReportAnalysis(id);
  redirect(`/reports/${id}`);
}
