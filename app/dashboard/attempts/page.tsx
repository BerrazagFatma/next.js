import { prisma } from "@/lib/prisma";

export default async function AttemptsPage({
  searchParams,
}: {
  searchParams: Promise<{ ip?: string }>;
}) {
  const { ip } = await searchParams;

  const attempts = await prisma.logEntry.findMany({
    where: ip ? { ip } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="min-h-screen space-y-8 bg-[#EEF2F9] p-6 text-slate-900 md:p-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tentatives</h1>
        <p className="mt-1 text-sm text-slate-500">
          Historique complet des tentatives de connexion reçues des journaux.
        </p>
      </div>

      {/* Filtre */}
      <form className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            name="ip"
            defaultValue={ip ?? ""}
            placeholder="Filtrer par IP, ex. 203.45.67.100"
            className="w-80 rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 font-mono text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200">
          Filtrer
        </button>
        {ip && (
          <a
            href="/dashboard/attempts"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            Réinitialiser
          </a>
        )}
      </form>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Historique</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {ip ? `Résultats pour ${ip}` : "Toutes les sources"}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
            {attempts.length} {attempts.length > 1 ? "tentatives" : "tentative"}
          </span>
        </div>

        {attempts.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            Aucune tentative trouvée.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <th className="px-6 py-3 font-medium">Heure</th>
                  <th className="px-6 py-3 font-medium">Source (IP)</th>
                  <th className="px-6 py-3 font-medium">Système</th>
                  <th className="px-6 py-3 font-medium">Compte visé</th>
                  <th className="px-6 py-3 font-medium">Résultat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attempts.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs text-slate-500">
                      {a.createdAt.toLocaleString("fr-FR")}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-900">{a.ip}</td>
                    <td className="px-6 py-3.5 text-slate-600">{a.system}</td>
                    <td className="px-6 py-3.5 text-slate-600">{a.account}</td>
                    <td className="px-6 py-3.5">
                      {a.success ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Réussie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Échec
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attempts.length === 200 && (
              <p className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
                Affichage limité aux 200 tentatives les plus récentes.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}