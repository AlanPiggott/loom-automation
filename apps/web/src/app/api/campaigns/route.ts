import { NextResponse } from "next/server";
import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";

export async function GET() {
  const supabase = createSupabaseServerWithServiceRole();
  const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as { name?: string };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }
  const supabase = createSupabaseServerWithServiceRole();
  const { data, error } = await supabase.from("campaigns").insert({ name: body.name }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}