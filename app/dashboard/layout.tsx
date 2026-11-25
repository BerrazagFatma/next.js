import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

const links = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/attempts", label: "Tentatives" },
  { href: "/dashboard/alerts", label: "Alertes" },
  { href: "/dashboard/proposals", label: "Propositions" },
  { href: "/dashboard/rules", label: "Règles actives" },
  { href: "/dashboard/whitelist", label: "Liste blanche" },
  { href: "/dashboard/audit", label: "Journal d'audit" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col gap-1 bg-gray-900 p-4 text-white">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="text-xl">🛡</span>
          <span className="font-bold">SentinelGate</span>
        </div>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded px-3 py-2 text-sm hover:bg-gray-800"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-auto pt-4">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}