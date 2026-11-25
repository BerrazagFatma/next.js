import { prisma } from "@/lib/prisma";

export async function expireOldRules() {
  await prisma.rule.updateMany({
    where: {
      active: true,
      expiresAt: { lte: new Date() },
    },
    data: { active: false },
  });
}