import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";
import { EventType } from "@video-outreach/shared";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { jobId?: string; type?: EventType };

  if (!body.jobId || !["open", "play", "finish"].includes(body.type || "")) {
    return NextResponse.json({ error: "jobId & valid type required" }, { status: 400 });
  }

  const supabase = createSupabaseServerWithServiceRole();
  const { error } = await supabase.from("events").insert({
    job_id: body.jobId,
    event_type: body.type
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}