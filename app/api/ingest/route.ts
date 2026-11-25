import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateIp } from "@/lib/detection";

export async function POST(req: Request) {
  const key = req.headers.get("x-api-key");
  if (key !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ error: "Clé invalide" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.system || !body.ip || !body.account || typeof body.success !== "boolean") {
    return NextResponse.json({ error: "Données incomplètes" }, { status: 400 });
  }

  const { system, ip, account, success } = body;
  const rawLine = `${new Date().toISOString()}|${system}|${ip}|${account}|${success}|${Math.random().toString(36).slice(2)}`;

  let created = false;
  try {
    await prisma.logEntry.create({ data: { system, ip, account, success, rawLine } });
    created = true;
  } catch {
    // doublon : on ignore
  }

  let detection = null;
  if (created && !success) {
    detection = await evaluateIp(ip);
  }

  return NextResponse.json({ ok: true, detection }, { status: 201 });
}