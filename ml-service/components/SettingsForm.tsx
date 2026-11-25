"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsForm({
  seuilAlerte,
  seuilBlocage,
}: {
  seuilAlerte: number;
  seuilBlocage: number;
}) {
  const router = useRouter();
  const [alerte, setAlerte] = useState(Math.round(seuilAlerte * 100));
  const [blocage, setBlocage] = useState(Math.round(seuilBlocage * 100));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seuilAlerte: alerte / 100,
        seuilBlocage: blocage / 100,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Erreur");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={enregistrer} className="max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm text-gray-600">
          Seuil d&apos;alerte : {alerte} %
        </label>
        <input
          type="range"
          min={1}
          max={99}
          value={alerte}
          onChange={(e) => setAlerte(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-gray-600">
          Seuil de blocage proposé : {blocage} %
        </label>
        <input
          type="range"
          min={1}
          max={99}
          value={blocage}
          onChange={(e) => setBlocage(Number(e.target.value))}
          className="w-full"
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <button
        disabled={loading}
        className="rounded bg-gray-800 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        Enregistrer
      </button>
    </form>
  );
}