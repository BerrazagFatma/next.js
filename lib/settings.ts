import { prisma } from "@/lib/prisma";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!settings) {
    settings = await prisma.settings.create({
      data: { id: 1, seuilAlerte: 0.5, seuilBlocage: 0.8 },
    });
  }
  return settings;
}

export async function updateSettings(seuilAlerte: number, seuilBlocage: number) {
  return prisma.settings.upsert({
    where: { id: 1 },
    update: { seuilAlerte, seuilBlocage },
    create: { id: 1, seuilAlerte, seuilBlocage },
  });
}