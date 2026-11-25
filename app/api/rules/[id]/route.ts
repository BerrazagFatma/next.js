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
  const rule = await prisma.rule.findUnique({ where: { id: Number(id) } });
  if (!rule) {
    return NextResponse.json({ error: "Règle introuvable" }, { status: 404 });
  }

  await prisma.rule.update({
    where: { id: rule.id },
    data: { active: false },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.userId,
      action: "Annulé la règle",
      target: rule.ip,
    },
  });

  return NextResponse.json({ ok: true });
}