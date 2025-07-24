"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  created_at: string;
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/campaigns");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        setCampaigns(data);
      }
    }
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setName("");
    load();
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>

      <form onSubmit={onSubmit} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New campaign name"
          className="flex-1 border rounded px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {campaigns.map((c) => (
          <li key={c.id} className="border p-3 rounded">
            <Link href={`/campaign/${c.id}`} className="font-medium underline">
              {c.name}
            </Link>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(c.created_at).toLocaleString()}
            </span>
          </li>
        ))}
        {campaigns.length === 0 && (
          <p className="text-gray-500">No campaigns yet.</p>
        )}
      </ul>
    </main>
  );
}