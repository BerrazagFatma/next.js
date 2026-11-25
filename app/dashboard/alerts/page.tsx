import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Pour chaque alerte, on vérifie s'il existe une proposition en attente pour la même IP
  const alertsWithProposal = await Promise.all(
    alerts.map(async (a) => {
      const proposal = await prisma.proposal.findFirst({
        where: { ip: a.ip, status: "en_attente" },
      });
      return { ...a, hasProposal: !!proposal };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alertes</h1>
        <p className="text-gray-500">
          Déclenchées quand le score d'une IP dépasse 50 %.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        {alertsWithProposal.length === 0 ? (
          <p className="text-gray-500">Aucune alerte pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">Heure</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4">Niveau</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {alertsWithProposal.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {a.createdAt.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-2 pr-4 font-mono">{a.ip}</td>
                  <td className="py-2 pr-4">{a.type}</td>
                  <td className="py-2 pr-4 font-semibold">
                    {(a.score * 100).toFixed(0)} %
                  </td>
                  <td className="py-2 pr-4">
                    {a.level === "alerte_et_proposition" ? (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">
                        Alerte + proposition
                      </span>
                    ) : (
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-orange-700">
                        Alerte simple
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {a.hasProposal && (
                      <Link
                        href="/dashboard/proposals"
                        className="text-blue-600 underline"
                      >
                        Voir la proposition
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}