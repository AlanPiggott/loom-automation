import { NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    campaignId?: string;
    leads?: Record<string, unknown>[];
  };

  if (!body.campaignId || !Array.isArray(body.leads) || body.leads.length === 0) {
    return NextResponse.json({ error: "campaignId & leads required" }, { status: 400 });
  }

  // quick sanity check for required fields
  const missing = body.leads.find(
    (l) => typeof l.email !== "string" || typeof l.website !== "string"
  );
  if (missing) {
    return NextResponse.json({ error: "each lead needs email & website" }, { status: 400 });
  }

  const rows = body.leads.map((lead) => ({
    campaign_id: body.campaignId,
    lead_json: lead,
    status: "queued"
  }));

  const supabase = createSupabaseServerWithServiceRole();
  const { error } = await supabase.from("jobs").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ inserted: rows.length }, { status: 201 });
}