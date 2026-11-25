"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Entry = { id: number; ip: string; addedBy: string; createdAt: string };

export default function WhitelistManager({ entries }: { entries: Entry[] }) {
  const router = useRouter();
  const [ip, setIp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Erreur");
      return;
    }
    setIp("");
    router.refresh();
  }

  async function retirer(id: number) {
    await fetch(`/api/whitelist/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={ajouter} className="flex gap-2">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Ex. 192.168.1.10"
          required
          className="flex-1 rounded border p-2 font-mono"
        />
        <button
          disabled={loading}
          className="rounded bg-gray-800 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}

      {entries.length === 0 ? (
        <p className="text-gray-500">Aucune IP en liste blanche pour le moment.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2 pr-4">IP</th>
              <th className="py-2 pr-4">Ajoutée par</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono">{e.ip}</td>
                <td className="py-2 pr-4">{e.addedBy}</td>
                <td className="py-2 pr-4">
                  {new Date(e.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-2 pr-4">
                  <button
                    onClick={() => retirer(e.id)}
                    className="text-red-600 underline"
                  >
                    Retirer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}