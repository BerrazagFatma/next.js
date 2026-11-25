import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Réglages de détection</h1>
        <p className="text-gray-500">
          Le seuil de blocage doit toujours être supérieur ou égal au seuil d&apos;alerte.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <SettingsForm
          seuilAlerte={settings.seuilAlerte}
          seuilBlocage={settings.seuilBlocage}
        />
      </div>
    </div>
  );
}