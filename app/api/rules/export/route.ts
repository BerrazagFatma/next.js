import { prisma } from "@/lib/prisma";
import { expireOldRules } from "@/lib/rules";

export async function GET() {
  await expireOldRules();
  const rules = await prisma.rule.findMany({ where: { active: true } });

  const lignes = rules.map((r) => `iptables -A INPUT -s ${r.ip} -j DROP`);
  const contenu = lignes.length
    ? lignes.join("\n")
    : "# Aucune règle active pour le moment";

  return new Response(contenu, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": "attachment; filename=sentinelgate-rules.sh",
    },
  });
}