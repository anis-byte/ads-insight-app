import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  await supabase.from("audit_logs").insert({
    report_id: id,
    action: "delete_report",
    tool_used: "delete_report",
    input_summary: "User confirmed report deletion",
    output_summary: "Report deletion requested",
  });

  await supabase.from("reports").delete().eq("id", id);
  redirect("/");
}
