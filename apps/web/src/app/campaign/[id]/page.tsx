"use client";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Page, PageType, JobStatusCount } from "@video-outreach/shared";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<{ name: string; master_video_url: string | null }>({ name: "", master_video_url: null });
  const [pages, setPages] = useState<Page[]>([]);
  const [type, setType] = useState<PageType>("COMPANY");
  const [url, setUrl]   = useState("");
  const [counts, setCounts] = useState<JobStatusCount | null>(null);

  async function load() {
    const res = await fetch(`/api/pages?campaignId=${id}`);
    setPages(await res.json());
    const c = await fetch(`/api/campaigns`).then((r) => r.json()) as any[];
    const row = c.find((row) => row.id === id);
    setCampaign({ name: row?.name ?? "", master_video_url: row?.master_video_url ?? null });
    const statusRes = await fetch(`/api/jobs/status?campaignId=${id}`);
    setCounts(await statusRes.json());
  }

  useEffect(() => { load(); }, [id]);

  async function add(e: FormEvent) {
    e.preventDefault();
    if (type === "STATIC" && !url.trim()) return;
    await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: id, type, url })
    });
    setUrl("");
    load();
  }

  async function del(pageId: string) {
    await fetch(`/api/pages/${pageId}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link href="/" className="text-blue-600">&larr; Back</Link>
      <h1 className="text-2xl font-bold mt-2 mb-4">Pages for "{campaign.name}"</h1>

      {counts && (
        <p className="mb-4 text-sm text-gray-700">
          Queued: {counts.queued} &nbsp;•&nbsp;
          Rendering: {counts.rendering} &nbsp;•&nbsp;
          Done: {counts.done} &nbsp;•&nbsp;
          Error: {counts.error}
        </p>
      )}

      {/* Master video upload */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Master Video</h2>
        {campaign.master_video_url ? (
          <video src={campaign.master_video_url} controls className="w-full max-h-56 rounded" />
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fileInput = (e.currentTarget.elements.namedItem("file") as HTMLInputElement);
              if (!fileInput.files?.[0]) return;
              const fd = new FormData();
              fd.set("file", fileInput.files[0]);
              await fetch(`/api/campaigns/${id}/master-video`, { method: "PUT", body: fd });
              load();          // refresh state
            }}
          >
            <input type="file" name="file" accept="video/mp4" className="mb-2" />
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Upload</button>
          </form>
        )}
      </section>

      <Link
        href={`/campaign/${id}/leads`}
        className="inline-block mb-4 bg-green-600 text-white px-3 py-2 rounded"
      >
        Import Leads
      </Link>

      <form onSubmit={add} className="flex gap-2 items-end mb-6">
        <label className="flex flex-col">
          Type
          <select value={type} onChange={(e) => setType(e.target.value as PageType)} className="border px-2 py-1 rounded">
            <option value="COMPANY">Company Website</option>
            <option value="STATIC">Static URL / Screenshot</option>
          </select>
        </label>

        {type === "STATIC" && (
          <label className="flex flex-col flex-1">
            URL
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/screenshot.png" className="border px-2 py-1 rounded" />
          </label>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Page</button>
      </form>

      <ul className="space-y-2">
        {pages.map((p) => (
          <li key={p.id} className="border rounded p-3 flex justify-between">
            <div>
              <span className="font-medium">{p.position}. {p.type}</span>
              {p.type === "STATIC" && <span className="text-sm text-gray-600 ml-2">{p.payload_json.url}</span>}
            </div>
            <button onClick={() => del(p.id)} className="text-red-600">Delete</button>
          </li>
        ))}
        {pages.length === 0 && <p className="text-gray-500">No pages yet.</p>}
      </ul>
    </main>
  );
}