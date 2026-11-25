import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail({
  ip,
  type,
  score,
}: {
  ip: string;
  type: string;
  score: number;
}) {
  const to = process.env.ALERT_EMAIL_TO;
  if (!to) return;

  const lien = `${process.env.APP_URL}/dashboard/proposals`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `Alerte SentinelGate : ${type} depuis ${ip}`,
      html: `
        <p><strong>Alerte SentinelGate</strong></p>
        <p>Type d'attaque : ${type}</p>
        <p>Adresse IP : ${ip}</p>
        <p>Score de danger : ${(score * 100).toFixed(0)} %</p>
        <p><a href="${lien}">Voir la proposition sur le tableau de bord</a></p>
      `,
    });
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'e-mail :", err);
  }
}