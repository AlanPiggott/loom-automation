import { NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";
import { PageType } from "@video-outreach/shared";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  }
  const supabase = createSupabaseServerWithServiceRole();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("position");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    campaignId?: string;
    type?: PageType;
    url?: string;
  };
  if (!body.campaignId) return NextResponse.json({ error: "campaignId required" }, { status: 400 });
  if (body.type !== "COMPANY" && body.type !== "STATIC") {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  const supabase = createSupabaseServerWithServiceRole();
  // figure next position
  const { count } = await supabase
    .from("pages")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", body.campaignId);

  const insertObj = {
    campaign_id: body.campaignId,
    position: (count ?? 0) + 1,
    type: body.type,
    payload_json: body.type === "STATIC" ? { url: body.url } : {}
  };

  const { data, error } = await supabase.from("pages").insert(insertObj).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}