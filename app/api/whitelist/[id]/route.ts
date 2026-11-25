import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const entry = await prisma.whitelistEntry.findUnique({ where: { id: Number(id) } });
  if (!entry) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  await prisma.whitelistEntry.delete({ where: { id: entry.id } });

  await prisma.auditLog.create({
    data: { adminId: session.userId, action: "Retiré de la liste blanche", target: entry.ip },
  });

  return NextResponse.json({ ok: true });
}