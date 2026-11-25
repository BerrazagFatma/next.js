import { prisma } from "@/lib/prisma";
import { sendAlertEmail } from "@/lib/mail";
import { getSettings } from "@/lib/settings";

export const SEUIL = 10;
const FENETRE_MINUTES = 5;

export function computeScore(echecs: number): number {
  return Math.min(1, echecs / (SEUIL * 3));
}

async function getMlScore(features: {
  echecs: number;
  comptesDistincts: number;
  ecartTypeDelais: number;
}): Promise<number> {
  const url = process.env.ML_SERVICE_URL;
  if (!url) return 0;

  try {
    const res = await fetch(`${url}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        echecs_5min: features.echecs,
        comptes_distincts: features.comptesDistincts,
        ecart_type_delais: features.ecartTypeDelais,
      }),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return typeof data.score === "number" ? data.score : 0;
  } catch {
    return 0;
  }
}

export async function evaluateIp(ip: string) {
  const whitelisted = await prisma.whitelistEntry.findUnique({ where: { ip } });
  if (whitelisted) return null;

  const depuis = new Date(Date.now() - FENETRE_MINUTES * 60_000);

  const tentatives = await prisma.logEntry.findMany({
    where: { ip, success: false, createdAt: { gte: depuis } },
  });
  const echecs = tentatives.length;

  const comptesDistincts = new Set(tentatives.map((t) => t.account)).size;

  let ecartTypeDelais = 30;
  if (tentatives.length >= 3) {
    const temps = tentatives.map((t) => t.createdAt.getTime()).sort((a, b) => a - b);
    const delais = temps.slice(1).map((t, i) => t - temps[i]);
    const moyenne = delais.reduce((a, b) => a + b, 0) / delais.length;
    const variance = delais.reduce((a, b) => a + (b - moyenne) ** 2, 0) / delais.length;
    ecartTypeDelais = Math.sqrt(variance) / 1000;
  }

  const settings = await getSettings();

  const scoreSeuils = computeScore(echecs);
  const scoreMl = await getMlScore({ echecs, comptesDistincts, ecartTypeDelais });
  const score = Math.max(scoreSeuils, scoreMl);

  if (score < settings.seuilAlerte) return { score, scoreSeuils, scoreMl, echecs };

  const typeAttaque = comptesDistincts >= 5 ? "credential_stuffing" : "force_brute";

  const fenetreMs = FENETRE_MINUTES * 60_000;
  const windowKey = `${ip}:${Math.floor(Date.now() / fenetreMs)}`;

  try {
    await prisma.alert.create({
      data: {
        ip,
        type: typeAttaque,
        score,
        level: score >= settings.seuilBlocage ? "alerte_et_proposition" : "alerte",
        windowKey,
      },
    });
    await sendAlertEmail({ ip, type: typeAttaque, score });
  } catch {
    // une alerte existe déjà pour cette IP et cette fenêtre : on ignore
  }

  if (score >= settings.seuilBlocage) {
    const propositionEnAttente = await prisma.proposal.findFirst({
      where: { ip, status: "en_attente" },
    });
    if (!propositionEnAttente) {
      await prisma.proposal.create({
        data: { ip, score, reason: `${echecs} échecs en ${FENETRE_MINUTES} minutes` },
      });
    }
  }

  return { score, scoreSeuils, scoreMl, echecs };
}