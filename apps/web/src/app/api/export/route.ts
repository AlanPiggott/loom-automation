import { NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  }

  const supabase = createSupabaseServerWithServiceRole();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, lead_json, thumbnail_url")
    .eq("campaign_id", campaignId)
    .eq("status", "done");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Figure out site origin for landing links
  const origin =
    process.env.NEXT_PUBLIC_SITE_ORIGIN ??
    (req.headers.get("origin") || new URL(req.url).origin);

  const rows = (data || []).map((row) => {
    const email = (row.lead_json as any)?.email || "";
    const videoUrl = `${origin}/v/${row.id}`;
    const thumb = row.thumbnail_url || "";
    // Basic CSV escaping: wrap in quotes and escape quotes inside
    return [email, videoUrl, thumb].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });

  const csv = ["email,videoUrl,thumbnailUrl", ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="videos.csv"`
    }
  });
}