"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RuleActions({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function annuler() {
    setLoading(true);
    await fetch(`/api/rules/${id}`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      disabled={loading}
      onClick={annuler}
      className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
    >
      Annuler
    </button>
  );
}