import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ip = body?.ip?.trim();
  if (!ip) {
    return NextResponse.json({ error: "Adresse IP requise" }, { status: 400 });
  }

  const admin = await prisma.user.findUnique({ where: { id: session.userId } });

  try {
    await prisma.whitelistEntry.create({
      data: { ip, addedBy: admin?.name ?? "admin" },
    });
  } catch {
    return NextResponse.json({ error: "Cette IP est déjà en liste blanche" }, { status: 409 });
  }

  await prisma.auditLog.create({
    data: { adminId: session.userId, action: "Ajouté à la liste blanche", target: ip },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}