/**
 * heliumsol.com server: pre-rendered pages, first-party analytics, leads, the
 * chat assistant with human handoff, and the admin chat inbox.
 *
 * Structure follows the optimizeindex server. Built by esbuild into
 * dist/server.cjs (see the build script) and run under PM2 as "heliumsol"
 * behind nginx on 127.0.0.1:3003. In development `npm run dev` runs this file
 * directly with tsx and serves the client through Vite middleware.
 */

import "dotenv/config";
import express from "express";
import compression from "compression";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import {
  checkLoginRate,
  clearLoginRate,
  clearSessionCookie,
  readCookie,
  requireAdmin,
  SESSION_COOKIE,
  sessionSecret,
  setSessionCookie,
  signSession,
  verifyPassword,
  verifySession,
} from "./server/auth";
import {
  chatAdminRoutes,
  chatAgentRoutes,
  chatRoutes,
  setAgentCookie,
  type ChatDeps,
} from "./server/chat/routes";
import { pruneOldChats } from "./server/chat/store";
import { verifyAgentToken } from "./server/chat/tokens";
import { hasApiKey, modelName } from "./server/chat/openai";

/** Where lead notifications go. */
const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "info@heliumsol.com";

/* =========================================================================
   Outbound mail

   SMTP only. Everything is read from the environment; no host, address or
   credential is hard-coded, and the password is never logged.
   ========================================================================= */

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
/** Implicit TLS (465) versus STARTTLS (587), defaulting from the port. */
const SMTP_SECURE = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === "true"
  : SMTP_PORT === 465;
/** Envelope sender. Must be a mailbox the server is allowed to send as. */
const MAIL_FROM = process.env.MAIL_FROM || SMTP_USER;

const smtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && MAIL_FROM);

let mailer: nodemailer.Transporter | null = null;

function transport(): nodemailer.Transporter {
  if (!mailer) {
    mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return mailer;
}

type LeadInput = Record<string, string>;

function leadHtml(lead: LeadInput): string {
  const esc = (v: unknown) =>
    String(v ?? "").replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
    );
  const rows = Object.entries(lead)
    .filter(([, v]) => String(v ?? "").trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #ddd;font-weight:600;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:6px 12px;border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">${rows}</table>`;
}

function leadText(lead: LeadInput): string {
  return Object.entries(lead)
    .filter(([, v]) => String(v ?? "").trim() !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

async function emailLead(lead: LeadInput): Promise<boolean> {
  if (!smtpConfigured) {
    console.error("[Leads] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS/MAIL_FROM) - lead email dropped");
    return false;
  }
  const subject = `New HeliumSol lead: ${lead.company || lead.name || lead.email || "unknown"} (${lead.type})`;
  try {
    await transport().sendMail({
      from: MAIL_FROM,
      to: LEAD_NOTIFY_EMAIL,
      // So hitting reply in the inbox answers the prospect, not our own server.
      replyTo: lead.email || undefined,
      subject,
      text: leadText(lead),
      html: leadHtml(lead),
    });
    console.log(`[Leads] Emailed ${lead.type} lead to ${LEAD_NOTIFY_EMAIL}`);
    return true;
  } catch (err) {
    console.error("[Leads] SMTP send failed:", err);
    return false;
  }
}

// File-based backup so a lead is never lost even if the database is down.
const LEADS_BACKUP_FILE = path.join(process.cwd(), "leads.json");

function backupLeadToFile(lead: LeadInput) {
  try {
    let leads: LeadInput[] = [];
    try {
      leads = JSON.parse(fs.readFileSync(LEADS_BACKUP_FILE, "utf-8"));
    } catch {
      // no backup file yet
    }
    leads.unshift(lead);
    fs.writeFileSync(LEADS_BACKUP_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("[Leads] File backup failed:", err);
  }
}

const prisma = new PrismaClient();

function clientIp(req: express.Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "";
}

function clientCountry(req: express.Request): string {
  // Populated automatically when behind Cloudflare / Vercel / some proxies.
  const h = req.headers;
  return String(h["cf-ipcountry"] || h["x-vercel-ip-country"] || h["x-country-code"] || "");
}

/** Same shape check as the contact form. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Escapes JSON for inlining inside a <script> tag. */
function serializeForScriptTag(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3003;

  // A server that cannot sign sessions should not come up claiming to be
  // healthy: in production a missing SESSION_SECRET throws here, at boot.
  sessionSecret();

  // Trust nginx so req.protocol reflects the real visitor.
  app.set("trust proxy", 1);
  app.use(compression());
  app.use(express.json({ limit: "256kb" }));

  /**
   * Canonical host and trailing slashes.
   *
   * Two URLs with identical content split the ranking signals they earn, so
   * www and a trailing slash both 301 to the one canonical URL.
   */
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();

    const host = String(req.headers.host || "");
    const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "https");

    if (host.toLowerCase().startsWith("www.")) {
      res.redirect(301, `${proto}://${host.slice(4)}${req.originalUrl}`);
      return;
    }

    if (req.path.length > 1 && req.path.endsWith("/")) {
      res.redirect(301, req.path.replace(/\/+$/, "") + req.originalUrl.slice(req.path.length));
      return;
    }

    next();
  });

  // Health endpoint for uptime monitoring. 503 when the database is unreachable.
  app.get("/api/health", async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1 FROM "Lead" LIMIT 1`;
      res.json({ status: "ok", db: "up", time: new Date().toISOString() });
    } catch {
      res.status(503).json({ status: "degraded", db: "down", time: new Date().toISOString() });
    }
  });

  // Analytics ingestion: visitors, sessions, page views, events.
  // Best-effort by design — never let analytics failures surface to visitors.
  app.post("/api/track", async (req, res) => {
    const body = req.body || {};
    const str = (v: unknown, max = 500) => String(v ?? "").slice(0, max);
    const visitorId = str(body.visitorId, 100);
    const sessionId = str(body.sessionId, 100);
    if (!visitorId || !sessionId) {
      res.status(400).json({ error: "visitorId and sessionId are required" });
      return;
    }

    const s = body.session || {};
    const country = clientCountry(req);
    const userAgent = str(req.headers["user-agent"]);
    const ipAddress = str(clientIp(req), 100);

    try {
      // 1. Visitor: create with first-touch attribution, or refresh lastSeenAt
      await prisma.visitor.upsert({
        where: { id: visitorId },
        create: {
          id: visitorId,
          firstReferrer: str(s.referrer, 1000),
          firstLandingPage: str(s.entryPage, 1000),
          firstUtmSource: str(s.utmSource, 200),
          firstUtmMedium: str(s.utmMedium, 200),
          firstUtmCampaign: str(s.utmCampaign, 200),
          deviceType: str(s.deviceType, 20),
          browser: str(s.browser, 50),
          os: str(s.os, 50),
          language: str(s.language, 20),
          timezone: str(s.timezone, 100),
          country: country || null,
        },
        update: {
          lastSeenAt: new Date(),
          ...(body.sessionIsNew ? { sessionCount: { increment: 1 } } : {}),
        },
      });

      // 2. Session: create on first batch, otherwise refresh activity/exit page
      const lastPath = Array.isArray(body.pageViews) && body.pageViews.length > 0
        ? str(body.pageViews[body.pageViews.length - 1].path, 1000)
        : undefined;
      await prisma.session.upsert({
        where: { id: sessionId },
        create: {
          id: sessionId,
          visitorId,
          entryPage: str(s.entryPage, 1000),
          referrer: str(s.referrer, 1000),
          utmSource: str(s.utmSource, 200),
          utmMedium: str(s.utmMedium, 200),
          utmCampaign: str(s.utmCampaign, 200),
          utmTerm: str(s.utmTerm, 200),
          utmContent: str(s.utmContent, 200),
          deviceType: str(s.deviceType, 20),
          browser: str(s.browser, 50),
          os: str(s.os, 50),
          screenWidth: Number(s.screenWidth) || null,
          screenHeight: Number(s.screenHeight) || null,
          language: str(s.language, 20),
          timezone: str(s.timezone, 100),
          country: country || null,
          ipAddress,
          userAgent,
          exitPage: lastPath,
        },
        update: {
          lastActivityAt: new Date(),
          ...(lastPath ? { exitPage: lastPath } : {}),
        },
      });

      // 3. Page views: client-generated ids; the end-of-view batch updates
      // the same row with duration and scroll depth.
      const pageViews = Array.isArray(body.pageViews) ? body.pageViews.slice(0, 100) : [];
      for (const pv of pageViews) {
        const id = str(pv.id, 100);
        if (!id) continue;
        const data = {
          sessionId,
          visitorId,
          path: str(pv.path, 1000),
          title: str(pv.title, 300),
          durationMs: pv.durationMs != null ? Number(pv.durationMs) || 0 : undefined,
          maxScrollPct: pv.maxScrollPct != null ? Number(pv.maxScrollPct) || 0 : undefined,
        };
        await prisma.pageView.upsert({
          where: { id },
          create: { id, ...data, startedAt: pv.startedAt ? new Date(pv.startedAt) : new Date() },
          update: { durationMs: data.durationMs, maxScrollPct: data.maxScrollPct },
        });
      }

      // 4. Events
      const events = Array.isArray(body.events) ? body.events.slice(0, 200) : [];
      if (events.length > 0) {
        await prisma.event.createMany({
          data: events.map((ev: Record<string, unknown>) => ({
            sessionId,
            visitorId,
            name: str(ev.name, 50) || "unknown",
            label: str(ev.label, 300) || null,
            path: str(ev.path, 1000) || null,
            metadata: ev.metadata && typeof ev.metadata === "object" ? ev.metadata : undefined,
            createdAt: ev.createdAt ? new Date(String(ev.createdAt)) : new Date(),
          })),
        });
      }

      // 5. Keep denormalized counters current for cheap dashboard queries
      const [pvCount, evCount] = await Promise.all([
        prisma.pageView.count({ where: { sessionId } }),
        prisma.event.count({ where: { sessionId } }),
      ]);
      await prisma.session.update({
        where: { id: sessionId },
        data: { pageViewCount: pvCount, eventCount: evCount },
      });

      res.json({ ok: true });
    } catch (err) {
      console.error("[Track] Ingestion failed:", err);
      // Still 200 — the client must never retry-loop or surface analytics errors
      res.json({ ok: false });
    }
  });

  /**
   * Builds the stored shape of a lead from a request body.
   *
   * Every field is clamped here rather than at the database, because the columns
   * are unbounded text. The key list is closed: anything not named here is
   * dropped, which is why a new question on a form has to be folded into an
   * existing field rather than sent as a new key.
   */
  function buildLeadData(body: Record<string, unknown>, req: express.Request) {
    const str = (v: unknown, max = 2000) => String(v ?? "").trim().slice(0, max);

    return {
      type: str(body.type, 50) || "unknown",
      name: str(body.name, 200),
      email: str(body.email, 320),
      phone: str(body.phone, 50),
      company: str(body.company, 200),
      website: str(body.website, 500),
      competitor: str(body.competitor, 500),
      goal: str(body.goal, 50),
      service: str(body.service, 50),
      budget: str(body.budget, 100),
      comments: str(body.comments, 5000),
      // Marketing attribution captured client-side
      utmSource: str(body.utmSource, 200),
      utmMedium: str(body.utmMedium, 200),
      utmCampaign: str(body.utmCampaign, 200),
      utmTerm: str(body.utmTerm, 200),
      utmContent: str(body.utmContent, 200),
      referrer: str(body.referrer, 1000),
      landingPage: str(body.landingPage, 1000),
      submittedFrom: str(body.submittedFrom, 1000),
      gaClientId: str(body.gaClientId, 100),
      // Journey linkage to the analytics tables
      visitorId: str(body.visitorId, 100),
      sessionId: str(body.sessionId, 100),
      auditId: str(body.auditId, 100),
      // Technical context captured server-side
      userAgent: str(req.headers["user-agent"], 500),
      ipAddress: str(clientIp(req), 100),
    };
  }

  type LeadData = ReturnType<typeof buildLeadData>;

  /**
   * Delivers a lead: the notification email, the database, and — only if the
   * database write failed — a file on disk.
   *
   * Shared with the chat widget (server/chat/routes.ts), so a chat lead goes
   * through exactly the same path as a form lead.
   */
  async function persistLead(leadData: LeadData): Promise<{ id: string | null; emailForwarded: boolean }> {
    const emailForwarded = await emailLead({ ...leadData, createdAt: new Date().toISOString() });

    let dbId: string | null = null;
    try {
      const saved = await prisma.lead.create({ data: { ...leadData, emailForwarded } });
      dbId = saved.id;
      console.log(`[Leads] Saved ${leadData.type} lead ${saved.id} (db)`);

      // Mark the visitor and session as converted for funnel analysis
      if (leadData.visitorId) {
        await prisma.visitor
          .update({
            where: { id: leadData.visitorId },
            data: { convertedAt: new Date(), leadEmail: leadData.email },
          })
          .catch(() => {}); // visitor row may not exist if tracking was blocked
      }
      if (leadData.sessionId) {
        await prisma.session
          .update({ where: { id: leadData.sessionId }, data: { isConverted: true } })
          .catch(() => {});
      }
    } catch (err) {
      console.error("[Leads] Database write failed, falling back to file backup:", err);
    }

    if (!dbId) {
      backupLeadToFile({
        id: "lead_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        createdAt: new Date().toISOString(),
        ...leadData,
        emailForwarded: String(emailForwarded),
      });
    }

    return { id: dbId, emailForwarded };
  }

  app.post("/api/leads", async (req, res) => {
    const body = req.body || {};
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: "invalid_email" });
      return;
    }
    // The contact form requires all three; enforce it here too so a scripted
    // POST cannot create a lead nobody can reply to.
    if (body.type === "general_enquiry" && (!name || !phone)) {
      res.status(400).json({ error: "name_and_phone_required" });
      return;
    }

    const { id, emailForwarded } = await persistLead(buildLeadData(body, req));

    // Neither the database nor the email took it: tell the visitor it failed so
    // they can try again or call, rather than thank them for a lost lead.
    if (!id && !emailForwarded) {
      res.status(503).json({ error: "lead_not_saved" });
      return;
    }

    res.status(201).json({ ok: true, id: id || "backup" });
  });

  /* -----------------------------------------------------------------------
     CHAT WIDGET

     The assistant, and the live handoff to a person. Mounted under /api so the
     canonical-host middleware above skips it.
  ----------------------------------------------------------------------- */

  const CHAT_HANDOFF_EMAIL = process.env.CHAT_HANDOFF_EMAIL || LEAD_NOTIFY_EMAIL;

  async function sendHandoffMail(msg: {
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
  }): Promise<boolean> {
    if (!smtpConfigured) {
      console.error("[Chat] SMTP not configured - handoff email dropped");
      return false;
    }
    try {
      await transport().sendMail({
        from: MAIL_FROM,
        to: CHAT_HANDOFF_EMAIL,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
        ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
      });
      console.log(`[Chat] Handoff email sent to ${CHAT_HANDOFF_EMAIL}`);
      return true;
    } catch (err) {
      console.error("[Chat] Handoff email failed:", err);
      return false;
    }
  }

  /** Private pages: admin, agent console, chat API. */
  function setPrivateHeaders(res: express.Response) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
  }

  const chatDeps: ChatDeps = {
    persistLead,
    sendMail: sendHandoffMail,
    smtpConfigured,
    setPrivateHeaders,
    clientIp,
    clientCountry,
  };

  app.use("/api/chat/agent", chatAgentRoutes(prisma, chatDeps));
  app.use("/api/chat", chatRoutes(prisma, chatDeps));

  /* -----------------------------------------------------------------------
     ADMIN AUTH + CHAT INBOX
  ----------------------------------------------------------------------- */

  app.post("/api/admin/login", async (req, res) => {
    const ip = clientIp(req) || "unknown";
    const gate = checkLoginRate(ip);
    if (!gate.allowed) {
      res.setHeader("Retry-After", String(gate.retryAfterSec ?? 60));
      res.status(429).json({ error: "too_many_attempts", retryAfterSec: gate.retryAfterSec });
      return;
    }

    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password) {
      res.status(400).json({ error: "missing_credentials" });
      return;
    }

    try {
      const user = await prisma.adminUser.findUnique({ where: { email } });

      // One generic message for unknown account, wrong password and deactivated,
      // so the login form cannot be used to enumerate accounts.
      if (!user || !user.isActive || !verifyPassword(password, user.passwordHash)) {
        console.warn(`[Auth] Failed login from ${ip}`);
        res.status(401).json({ error: "invalid_credentials" });
        return;
      }

      clearLoginRate(ip);
      setSessionCookie(res, signSession(user.id));
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      console.error("[Auth] Login failed:", err);
      res.status(503).json({ error: "auth_unavailable" });
    }
  });

  app.post("/api/admin/logout", (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get("/api/admin/me", async (req, res) => {
    const userId = verifySession(readCookie(req, SESSION_COOKIE));
    if (!userId) {
      res.status(401).json({ error: "unauthenticated" });
      return;
    }
    try {
      const user = await prisma.adminUser.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, isActive: true },
      });
      if (!user || !user.isActive) {
        clearSessionCookie(res);
        res.status(401).json({ error: "unauthenticated" });
        return;
      }
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) {
      console.error("[Auth] /me failed:", err);
      res.status(503).json({ error: "auth_unavailable" });
    }
  });

  app.use("/api/admin", requireAdmin(prisma), chatAdminRoutes(prisma));

  // Anything else under /api is a JSON 404, never an HTML page.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  /**
   * Injects a JSON payload and a noindex directive into the app shell.
   * serializeForScriptTag escapes it, so a value containing "</script>"
   * cannot close the tag.
   */
  function injectShell(html: string, payload: string | null, varName = "__CHAT_AGENT__"): string {
    const robots = /<meta[^>]+name="robots"/i.test(html)
      ? ""
      : '<meta name="robots" content="noindex, nofollow" />';
    const script = payload ? `<script>window.${varName} = ${payload};</script>` : "";
    return html.replace("</head>", `${robots}${script}</head>`);
  }

  /**
   * Resolves a join link into the agent console.
   *
   * MUST be safe to fetch. Mail clients prefetch and scan links, so this route
   * only authenticates and hands over the shell — it does NOT mark the agent as
   * joined. That is a separate POST behind a button in the console. Nothing
   * here may log the token.
   */
  async function serveJoinLink(
    req: express.Request,
    res: express.Response,
    shell: string | null,
  ): Promise<boolean> {
    if (!shell) return false;

    const token = String(req.params.token || "");
    const claims = verifyAgentToken(token);
    setPrivateHeaders(res);

    const deny = (why: string) => {
      console.log(`[Chat] Join link rejected (${why})`);
      res
        .status(403)
        .type("html")
        .send(
          injectShell(
            shell.replace(
              "</head>",
              "<style>body{font:15px/1.6 Inter,system-ui,sans-serif;padding:15vh 24px;text-align:center;color:#334155;background:#f8fafc}h1{color:#0f172a;font-size:20px;margin:0 0 8px}p{margin:0 auto;max-width:36ch}.card{display:inline-block;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(13,26,46,.05),0 18px 40px -20px rgba(13,26,46,.18)}</style></head>",
            ),
            null,
          ).replace(
            /<div id="root"[^>]*>/,
            '<div id="root"><div class="card"><h1>This link is no longer valid</h1>' +
              "<p>A newer link may have been sent for this chat, or it has expired. Use the latest email, or open the chat from the admin area.</p></div>",
          ),
        );
      return true;
    };

    if (!claims) return deny("bad signature or expired");

    const conversation = await prisma.chatConversation
      .findUnique({ where: { id: claims.cid } })
      .catch(() => null);

    if (!conversation) return deny("no such conversation");
    if (conversation.agentTokenId !== claims.jti) return deny("revoked");
    if (!conversation.agentTokenExpiresAt || conversation.agentTokenExpiresAt.getTime() < Date.now()) {
      return deny("expired in database");
    }
    if (conversation.status === "CLOSED") return deny("conversation closed");

    await prisma.chatConversation
      .update({
        where: { id: conversation.id },
        data: {
          agentFirstSeenAt: conversation.agentFirstSeenAt || new Date(),
          agentIpAddress: clientIp(req).slice(0, 100),
        },
      })
      .catch(() => {});

    setAgentCookie(res, token);

    const context = {
      conversationId: conversation.id,
      agentLabel: conversation.agentLabel || process.env.CHAT_AGENT_LABEL || "HeliumSol",
      joined: Boolean(conversation.agentJoinedAt),
      summary: conversation.qualifiedReason || undefined,
      visitorEmail: conversation.visitorEmail || undefined,
      visitorWebsite: conversation.visitorWebsite || undefined,
      startedOn: conversation.startedOn || undefined,
    };

    res.status(200).type("html").send(injectShell(shell, serializeForScriptTag(context)));
    return true;
  }

  /** The console for a signed-in admin, reached from the inbox. */
  async function serveAgentConsole(
    req: express.Request,
    res: express.Response,
    shell: string | null,
  ): Promise<boolean> {
    if (!shell) return false;

    setPrivateHeaders(res);

    const uid = verifySession(readCookie(req, SESSION_COOKIE));
    if (!uid) {
      res.redirect(302, "/admin");
      return true;
    }

    const user = await prisma.adminUser
      .findUnique({ where: { id: uid }, select: { isActive: true, name: true } })
      .catch(() => null);
    if (!user?.isActive) {
      res.redirect(302, "/admin");
      return true;
    }

    const conversation = await prisma.chatConversation
      .findUnique({ where: { id: String(req.params.id || "") } })
      .catch(() => null);
    if (!conversation) return false;

    const context = {
      conversationId: conversation.id,
      agentLabel: user.name || process.env.CHAT_AGENT_LABEL || "HeliumSol",
      joined: Boolean(conversation.agentJoinedAt),
      summary: conversation.qualifiedReason || undefined,
      visitorEmail: conversation.visitorEmail || undefined,
      visitorWebsite: conversation.visitorWebsite || undefined,
      startedOn: conversation.startedOn || undefined,
    };

    res.status(200).type("html").send(injectShell(shell, serializeForScriptTag(context)));
    return true;
  }

  if (process.env.NODE_ENV !== "production") {
    // Imported here rather than at the top so production never loads Vite.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    const devShell = async (url: string) => {
      const raw = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
      return vite.transformIndexHtml(url, raw);
    };

    // Registered before vite.middlewares, whose SPA fallback would otherwise
    // answer these with an un-injected index.html.
    app.get(/^\/admin(?:\/.*)?$/, async (req, res, next) => {
      try {
        setPrivateHeaders(res);
        res.status(200).type("html").send(injectShell(await devShell(req.originalUrl), null));
      } catch (err) {
        next(err);
      }
    });

    app.get("/chat/join/:token", async (req, res, next) => {
      try {
        const handled = await serveJoinLink(req, res, await devShell(req.originalUrl));
        if (!handled) next();
      } catch (err) {
        next(err);
      }
    });

    app.get("/chat/agent/:id", async (req, res, next) => {
      try {
        const handled = await serveAgentConsole(req, res, await devShell(req.originalUrl));
        if (!handled) next();
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);
  } else {
    // dist/client only. The backend bundle (dist/server.cjs) and the SSR bundle
    // (dist/ssr) live outside it, so they are never served publicly.
    const distPath = path.join(process.cwd(), "dist", "client");

    // Hashed assets are immutable; HTML must revalidate.
    app.use(
      express.static(distPath, {
        index: false, // the resolver below owns HTML
        // Without this, /contact would 301 to /contact/, which the trailing-slash
        // rule above 301s straight back.
        redirect: false,
        setHeaders(res, filePath) {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          } else if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
          }
        },
      }),
    );

    /** The pre-rendered HTML for a path, or null. */
    const pageFor = (urlPath: string): string | null => {
      const clean = urlPath.length > 1 ? urlPath.replace(/\/+$/, "") : "/";
      const candidate =
        clean === "/" ? path.join(distPath, "index.html") : path.join(distPath, clean, "index.html");
      // Refuse anything that escapes dist — the path comes from the URL.
      const resolved = path.resolve(candidate);
      if (!resolved.startsWith(path.resolve(distPath))) return null;
      return fs.existsSync(resolved) ? resolved : null;
    };

    /**
     * The un-prerendered app shell written by scripts/prerender.tsx. The admin
     * app and agent console are built from it; the pre-rendered index.html
     * contains the homepage markup and would flash it before React replaced it.
     */
    const shellPath = path.join(distPath, "app-shell.html");
    let shellHtml: string | null = null;
    const readShell = (): string | null => {
      if (shellHtml !== null) return shellHtml;
      if (!fs.existsSync(shellPath)) {
        console.error(`[Server] ${shellPath} is missing. Run \`npm run build\`.`);
        return null;
      }
      shellHtml = fs.readFileSync(shellPath, "utf-8");
      return shellHtml;
    };

    app.get(/^\/admin(?:\/.*)?$/, (_req, res, next) => {
      const shell = readShell();
      if (!shell) return next();
      setPrivateHeaders(res);
      res.status(200).type("html").send(injectShell(shell, null));
    });

    app.get("/chat/join/:token", async (req, res, next) => {
      try {
        const handled = await serveJoinLink(req, res, readShell());
        if (!handled) next();
      } catch (err) {
        next(err);
      }
    });

    app.get("/chat/agent/:id", async (req, res, next) => {
      try {
        const handled = await serveAgentConsole(req, res, readShell());
        if (!handled) next();
      } catch (err) {
        next(err);
      }
    });

    // A real 404 rather than the homepage at 200, which search engines treat
    // as a thin duplicate.
    app.get("*", (req, res) => {
      const page = pageFor(req.path);
      if (page) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        res.sendFile(page);
        return;
      }
      const notFound = path.join(distPath, "404.html");
      res
        .status(404)
        .sendFile(fs.existsSync(notFound) ? notFound : path.join(distPath, "index.html"));
    });
  }

  // Loopback only in production: nginx is the sole entry point.
  const host = process.env.NODE_ENV === "production" ? "127.0.0.1" : "0.0.0.0";
  app.listen(PORT, host, () => {
    console.log(`[HeliumSol Server] Running on http://${host}:${PORT}`);
    console.log(
      smtpConfigured
        ? `[Mail] SMTP active: ${SMTP_USER}@${SMTP_HOST}:${SMTP_PORT} from ${MAIL_FROM} -> ${LEAD_NOTIFY_EMAIL}`
        : "[Mail] SMTP NOT configured - lead and handoff emails will not send",
    );
    console.log(
      process.env.CHAT_ENABLED === "false"
        ? "[Chat] Disabled by CHAT_ENABLED - widget runs in form mode"
        : hasApiKey()
          ? `[Chat] Assistant active: model=${modelName()}, handoff -> ${CHAT_HANDOFF_EMAIL}`
          : "[Chat] OPENAI_API_KEY not set - widget runs in form mode",
    );

    // Retention: at boot and every six hours; logs rather than throws.
    void pruneOldChats(prisma);
    setInterval(() => void pruneOldChats(prisma), 6 * 60 * 60 * 1000).unref();
  });
}

startServer();
