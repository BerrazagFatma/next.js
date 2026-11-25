import { prisma } from "@/lib/prisma";
import WhitelistManager from "@/components/WhitelistManager";

const SEUIL_ALERTE = 0.5;
const SEUIL_BLOCAGE = 0.8;

export default async function WhitelistPage() {
  const entries = await prisma.whitelistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liste blanche</h1>
        <p className="text-gray-500">
          Ces adresses IP ne sont jamais proposées au blocage, quel que soit leur score.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-3 text-lg font-bold">Seuils de détection actuels</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-500">Seuil d'alerte</p>
            <p className="text-2xl font-bold text-orange-600">
              {(SEUIL_ALERTE * 100).toFixed(0)} %
            </p>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-gray-500">Seuil de blocage proposé</p>
            <p className="text-2xl font-bold text-red-600">
              {(SEUIL_BLOCAGE * 100).toFixed(0)} %
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Adresses de confiance</h2>
        <WhitelistManager
          entries={entries.map((e) => ({
            ...e,
            createdAt: e.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}