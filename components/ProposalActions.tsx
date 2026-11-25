"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProposalActions({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function decide(decision: "approuver" | "rejeter") {
    setLoading(true);
    await fetch(`/api/proposals/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => decide("approuver")}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        Approuver le blocage
      </button>
      <button
        disabled={loading}
        onClick={() => decide("rejeter")}
        className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 disabled:opacity-50"
      >
        Rejeter
      </button>
    </div>
  );
}