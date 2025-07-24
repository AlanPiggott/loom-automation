import { NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) return NextResponse.json({ error: "campaignId required" }, { status: 400 });

  const supabase = createSupabaseServerWithServiceRole();
  const statuses = ["queued", "rendering", "done", "error"] as const;

  const counts: Record<string, number> = {};
  for (const s of statuses) {
    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("campaign_id", campaignId)
      .eq("status", s);
    counts[s] = count ?? 0;
  }
  return NextResponse.json(counts);
}