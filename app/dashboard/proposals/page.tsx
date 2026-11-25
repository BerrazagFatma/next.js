import { prisma } from "@/lib/prisma";
import ProposalActions from "@/components/ProposalActions";

export default async function ProposalsPage() {
  const proposals = await prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Propositions de blocage</h1>
        <p className="text-gray-500">Approuvez ou rejetez chaque proposition.</p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        {proposals.length === 0 ? (
          <p className="text-gray-500">Aucune proposition pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-mono font-semibold">{p.ip}</p>
                  <p className="text-sm text-gray-500">
                    {p.reason} — score {(p.score * 100).toFixed(0)} % —{" "}
                    {p.createdAt.toLocaleString("fr-FR")}
                  </p>
                </div>
                {p.status === "en_attente" ? (
                  <ProposalActions id={p.id} />
                ) : (
                  <span
                    className={
                      p.status === "approuvee"
                        ? "rounded bg-red-100 px-3 py-1 text-sm text-red-700"
                        : "rounded bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    }
                  >
                    {p.status === "approuvee" ? "Bloquée" : "Rejetée"}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}