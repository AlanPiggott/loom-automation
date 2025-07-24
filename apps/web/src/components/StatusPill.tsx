export function StatusPill({ label, count }: { label: string; count: number }) {
  const colors: Record<string, string> = {
    queued: "bg-yellow-200 text-yellow-800",
    rendering: "bg-blue-200 text-blue-800",
    done: "bg-green-200 text-green-800",
    error: "bg-red-200 text-red-800"
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[label]}`}
    >
      {label}: {count}
    </span>
  );
}