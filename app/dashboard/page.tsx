import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { expireOldRules } from "@/lib/rules";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export default async function DashboardPage() {
  await expireOldRules();
  const session = await getSession();
  const admin = await prisma.user.findUnique({
    where: { id: session!.userId },
    select: { name: true },
  });

  const [attemptsCount, pendingAlerts, activeRules, whitelistCount, blockedIps, latestAttempts] =
    await Promise.all([
      prisma.logEntry.count(),
      prisma.proposal.count({ where: { status: "en_attente" } }),
      prisma.rule.count({ where: { active: true } }),
      prisma.whitelistEntry.count(),
      prisma.rule.findMany({ where: { active: true }, select: { ip: true }, distinct: ["ip"] }),
      prisma.logEntry.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

  const attemptsDetailed = await Promise.all(
    latestAttempts.map(async (a) => {
      const [alert, pendingProposal, countLastMinute] = await Promise.all([
        prisma.alert.findFirst({ where: { ip: a.ip }, orderBy: { createdAt: "desc" } }),
        prisma.proposal.findFirst({ where: { ip: a.ip, status: "en_attente" } }),
        prisma.logEntry.count({
          where: { ip: a.ip, createdAt: { gte: new Date(a.createdAt.getTime() - 60_000), lte: a.createdAt } },
        }),
      ]);
      return {
        ...a,
        alertType: alert?.type ?? null,
        status: pendingProposal ? "À valider" : "Analysé",
        countLastMinute,
      };
    })
  );

  const stats = [
    {
      label: "Tentatives enregistrées",
      value: attemptsCount,
      tone: "text-sky-700 bg-sky-100",
      icon: (
        <Icon>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </Icon>
      ),
    },
    {
      label: "Alertes en attente",
      value: pendingAlerts,
      tone: "text-amber-700 bg-amber-100",
      icon: (
        <Icon>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </Icon>
      ),
    },
    {
      label: "Règles actives",
      value: activeRules,
      tone: "text-indigo-700 bg-indigo-100",
      icon: (
        <Icon>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </Icon>
      ),
    },
    {
      label: "IP en liste blanche",
      value: whitelistCount,
      tone: "text-emerald-700 bg-emerald-100",
      icon: (
        <Icon>
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </Icon>
      ),
    },
    {
      label: "IP bloquées",
      value: blockedIps.length,
      tone: "text-rose-700 bg-rose-100",
      icon: (
        <Icon>
          <circle cx="12" cy="12" r="10" />
          <path d="m4.9 4.9 14.2 14.2" />
        </Icon>
      ),
    },
  ];

  return (
    <div className="min-h-screen space-y-8 bg-[#EEF2F9] p-6 text-slate-900 md:p-8">
      {/* En-tête */}
      <div>
        <p className="text-sm text-slate-500">Bonjour {admin?.name}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Vue d'ensemble</h1>
      </div>

      {/* Indicateurs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}>
              {s.icon}
            </div>
            <p className="mt-5 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Dernières tentatives</h2>
          <p className="mt-0.5 text-sm text-slate-500">Les 10 événements les plus récents</p>
        </div>

        {attemptsDetailed.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            Aucune tentative reçue pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <th className="px-6 py-3 font-medium">Heure</th>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Système</th>
                  <th className="px-6 py-3 font-medium">Compte</th>
                  <th className="px-6 py-3 font-medium">Résultat</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 text-right font-medium">1 min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attemptsDetailed.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-3.5 font-mono text-xs text-slate-500">
                      {a.createdAt.toLocaleString("fr-FR")}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-900">{a.ip}</td>
                    <td className="px-6 py-3.5 text-slate-600">{a.system}</td>
                    <td className="px-6 py-3.5 text-slate-600">{a.account}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          a.success
                            ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
                            : "bg-rose-100 text-rose-700 ring-rose-600/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${a.success ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        {a.success ? "Réussie" : "Échec"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{a.alertType ?? "—"}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          a.status === "À valider"
                            ? "bg-amber-100 text-amber-700 ring-amber-600/20"
                            : "bg-slate-100 text-slate-600 ring-slate-500/20"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono tabular-nums text-slate-900">
                      {a.countLastMinute}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}