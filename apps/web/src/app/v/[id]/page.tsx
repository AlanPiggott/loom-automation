import { createSupabaseServerWithServiceRole } from "@video-outreach/shared";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function Landing({ params }: Props) {
  const supabase = createSupabaseServerWithServiceRole();

  // Fetch job + parent campaign name
  const { data, error } = await supabase
    .from("jobs")
    .select("video_url, campaigns(name)")
    .eq("id", params.id)
    .single();

  if (error || !data?.video_url) {
    return (
      <main className="h-screen flex items-center justify-center">
        <p className="text-gray-600">Video not found.</p>
      </main>
    );
  }

  // Derive Cloudflare Stream UID from stored HLS URL
  // stored format: https://videodelivery.net/<uid>/manifest/video.m3u8
  const parts = data.video_url.split("/");
  const uid = parts.length >= 4 ? parts[3] : "";

  const iframeSrc = `https://iframe.videodelivery.net/${uid}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-4">
        Quick video for {data.campaigns?.name ?? "you"}
      </h1>

      <iframe
        src={iframeSrc}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="w-full max-w-2xl aspect-video rounded shadow"
      />

      <Link
        href={process.env.NEXT_PUBLIC_CTA_URL ?? "#"}
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded text-lg"
      >
        Book a Call
      </Link>
    </main>
  );
}