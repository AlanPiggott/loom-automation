import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerWithServiceRole();

  // ── 1. read file from multipart/form‑data
  const data = await req.formData();
  const file = data.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

  // ── 2. upload to Storage
  const fileName = `${params.id}.mp4`;
  const { error: upErr } = await supabase.storage
    .from(process.env.SUPABASE_MASTER_BUCKET || "master-videos")
    .upload(fileName, Buffer.from(await file.arrayBuffer()), {
      contentType: "video/mp4",
      upsert: true
    });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_MASTER_BUCKET || "master-videos"}/${fileName}`;

  // ── 3. save URL on campaign
  const { error } = await supabase
    .from("campaigns")
    .update({ master_video_url: publicUrl })
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, url: publicUrl });
}