import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const decision = body?.decision; // "approuver" ou "rejeter"
  if (decision !== "approuver" && decision !== "rejeter") {
    return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
  }

  const proposal = await prisma.proposal.findUnique({ where: { id: Number(id) } });
  if (!proposal || proposal.status !== "en_attente") {
    return NextResponse.json({ error: "Proposition introuvable ou déjà traitée" }, { status: 404 });
  }

  const nouveauStatut = decision === "approuver" ? "approuvee" : "rejetee";
  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: nouveauStatut },
  });

  if (decision === "approuver") {
    await prisma.rule.create({
      data: {
        ip: proposal.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminId: session.userId,
      action: decision === "approuver" ? "Approuvé le blocage" : "Rejeté la proposition",
      target: proposal.ip,
    },
  });

  return NextResponse.json({ ok: true });
}