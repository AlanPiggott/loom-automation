"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Papa from "papaparse";

export default function LeadsImport() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        setRows(r.data as any[]);
        setError("");
      },
      error: (err) => setError(err.message)
    });
  }

  async function importRows() {
    const res = await fetch("/api/jobs/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: id, leads: rows })
    });
    if (!res.ok) {
      const { error } = await res.json();
      setError(error);
    } else {
      router.push(`/campaign/${id}`); // back to pages screen
    }
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold mb-4">Import Leads</h1>

      <input type="file" accept=".csv" onChange={handleFile} className="mb-4" />

      {rows.length > 0 && (
        <>
          <p className="mb-2">Parsed rows: <strong>{rows.length}</strong></p>
          <button
            onClick={importRows}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Queue {rows.length} leads
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </main>
  );
}