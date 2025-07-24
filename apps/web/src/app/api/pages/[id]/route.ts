import { NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerWithServiceRole();
  const { error } = await supabase.from("pages").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}