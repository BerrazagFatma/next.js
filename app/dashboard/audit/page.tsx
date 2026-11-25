import { prisma } from "@/lib/prisma";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  // On récupère le nom de chaque administrateur une seule fois
  const adminIds = [...new Set(logs.map((l) => l.adminId))];
  const admins = await prisma.user.findMany({
    where: { id: { in: adminIds } },
    select: { id: true, name: true },
  });
  const nomParId = new Map(admins.map((a) => [a.id, a.name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journal d'audit</h1>
        <p className="text-gray-500">Qui a décidé quoi, et quand.</p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        {logs.length === 0 ? (
          <p className="text-gray-500">Aucune action enregistrée pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Administrateur</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Cible</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {l.createdAt.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-2 pr-4">{nomParId.get(l.adminId) ?? "Inconnu"}</td>
                  <td className="py-2 pr-4">{l.action}</td>
                  <td className="py-2 pr-4 font-mono">{l.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}