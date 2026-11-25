import { prisma } from "@/lib/prisma";
import RuleActions from "@/components/RuleActions";
import { expireOldRules } from "@/lib/rules";

export default async function RulesPage() {
  await expireOldRules();
  const rules = await prisma.rule.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Règles actives</h1>
          <p className="text-gray-500">
            Chaque règle expire automatiquement après 24 heures.
          </p>
        </div>
        <a
          href="/api/rules/export"
          className="rounded bg-gray-800 px-4 py-2 text-sm text-white"
        >
          Exporter pour le pare-feu
        </a>
      </div>

      <div className="rounded-lg border bg-white p-6">
        {rules.length === 0 ? (
          <p className="text-gray-500">Aucune règle pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Créée le</th>
                <th className="py-2 pr-4">Expire le</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono">{r.ip}</td>
                  <td className="py-2 pr-4">
                    {r.active ? (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                        Annulée
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4">{r.createdAt.toLocaleString("fr-FR")}</td>
                  <td className="py-2 pr-4">{r.expiresAt.toLocaleString("fr-FR")}</td>
                  <td className="py-2 pr-4">
                    {r.active && <RuleActions id={r.id} />}
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