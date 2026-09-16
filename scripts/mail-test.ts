/**
 * Checks the SMTP settings in .env.
 *
 *   npm run mail:test          log in to the SMTP server only, send nothing
 *   npm run mail:test -- send  also send one test email to LEAD_NOTIFY_EMAIL
 *
 * Never prints the password.
 */

import "dotenv/config";
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT || 587);
const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
const user = process.env.SMTP_USER || "";
const from = process.env.MAIL_FROM || user;
const to = process.env.LEAD_NOTIFY_EMAIL || "info@heliumsol.com";

async function main() {
  if (!process.env.SMTP_HOST || !user || !process.env.SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS must all be set in .env");
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: { user, pass: process.env.SMTP_PASS },
  });

  console.log(`Logging in to ${process.env.SMTP_HOST}:${port} as ${user}…`);
  await transport.verify();
  console.log("Login OK.");

  if (process.argv.includes("send")) {
    const info = await transport.sendMail({
      from,
      to,
      subject: "HeliumSol site mail test",
      text: "This is a test from the heliumsol.com server. Lead and chat notifications will arrive like this.",
    });
    console.log(`Sent to ${to}: ${info.response}`);
  }
}

main().catch((err) => {
  console.error("Mail test failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
