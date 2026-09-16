/**
 * The two things the assistant can actually do, beyond talking.
 *
 * Every handler here is written on the assumption that the model got the
 * arguments wrong: it may omit a required field, invent a URL, or call a tool
 * twice. Handlers return a structured refusal the model can act on rather than
 * throwing, because "ask them for their website first" is a better recovery
 * than a stack trace.
 *
 * Dependencies are injected rather than imported so this module stays testable
 * and so the lead path is provably the same function the forms call, not a
 * second implementation of it.
 */

import type { PrismaClient } from "@prisma/client";
import type { ToolDef } from "./openai";

/* -------------------------------------------------------------------------
   Schemas
------------------------------------------------------------------------- */

/**
 * `strict: true` with `additionalProperties: false` makes the model's arguments
 * conform to the schema rather than approximately conform, which removes most
 * of the defensive parsing this would otherwise need.
 *
 * Almost every field is nullable, because the model is expected to call
 * save_contact_details the moment it learns anything rather than waiting until
 * it has a full picture. Under strict mode a nullable field still has to be
 * listed in `required` — omitting it there is a 400 on every request, which is
 * invisible from the visitor's side.
 */
export const TOOLS: ToolDef[] = [
  {
    type: "function",
    name: "save_contact_details",
    description:
      "Record who you are talking to. Call this the MOMENT you learn any detail — a name, an email, a phone number, where they are based, a company or a website — including when it is mentioned in passing. Do not wait to collect them all. Call it again each time you learn something new; passing null for what you still do not know is expected and correct. As soon as an email address is recorded the team is notified that a lead came in, so getting the email is the single most valuable thing you do in a conversation.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["name", "email", "phone", "area", "company", "website", "summary"],
      properties: {
        name: { type: ["string", "null"], description: "What they said their name is." },
        email: {
          type: ["string", "null"],
          description: "Exactly as typed. Never guess, correct or complete it.",
        },
        phone: { type: ["string", "null"], description: "Exactly as typed." },
        area: {
          type: ["string", "null"],
          description:
            "Where they are based, in their words.",
        },
        company: { type: ["string", "null"] },
        website: { type: ["string", "null"] },
        summary: {
          type: ["string", "null"],
          description:
            "One or two sentences on what they want, in their words, once you know. Null early on. Do not invent detail they did not give.",
        },
      },
    },
  },
  {
    type: "function",
    name: "request_human",
    description:
      "Ask a person to join this conversation. Call this whenever the visitor asks for a human, asks about price, is unhappy, or asks something the reference material does not cover.",
    strict: true,
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["reason", "urgency", "summary"],
      properties: {
        reason: {
          type: "string",
          enum: ["visitor_asked", "qualified_lead", "out_of_scope", "complaint", "pricing"],
        },
        urgency: { type: ["string", "null"], enum: ["now", "today", "anytime", null] },
        summary: {
          type: "string",
          description: "One or two sentences telling the person what they are walking into.",
        },
      },
    },
  },
];

/* -------------------------------------------------------------------------
   Context and results
------------------------------------------------------------------------- */

export interface ToolContext {
  prisma: PrismaClient;
  conversationId: string;
  ipAddress: string;
  userAgent: string;
  /** Analytics ids, copied onto any lead so the funnel joins up as usual. */
  visitorId?: string | null;
  sessionId?: string | null;
  gaClientId?: string | null;
  startedOn?: string | null;
  /** The extracted /api/leads pipeline. Same function the forms use. */
  persistLead: PersistLead;
  /** Triggers the handoff email. Returns false when no notification got out. */
  requestHuman: (
    reason: string,
    summary: string,
    urgency: string,
  ) => Promise<{ outcome: "notified" | "unavailable" | "cooldown"; retryAfterMin?: number }>;
}

export type PersistLead = (leadData: Record<string, string>) => Promise<{
  id: string | null;
  emailForwarded: boolean;
}>;

/** What the model receives back. Serialized to JSON as the tool output. */
export type ToolResult = Record<string, unknown>;

/**
 * Side effects the route needs to know about, collected rather than returned to
 * the model. The model gets told what happened; the route needs to act on it.
 */
export interface ToolEffects {
  handoffTriggered: boolean;
  leadCaptured: boolean;
  auditRan: boolean;
}

/* -------------------------------------------------------------------------
   Dispatch
------------------------------------------------------------------------- */

export async function runTool(
  name: string,
  rawArgs: string,
  ctx: ToolContext,
  effects: ToolEffects,
): Promise<ToolResult> {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(rawArgs || "{}") as Record<string, unknown>;
  } catch {
    // A malformed arguments string must never take the request down. Telling
    // the model its own output was unreadable is enough for it to retry.
    return { ok: false, error: "arguments_not_json", hint: "Send valid JSON arguments." };
  }

  const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);

  switch (name) {
    case "save_contact_details":
      return saveContactTool(
        {
          name: str(args.name, 200),
          email: str(args.email, 320),
          phone: str(args.phone, 50),
          area: str(args.area, 200),
          company: str(args.company, 200),
          website: str(args.website, 500),
          summary: str(args.summary, 2000),
        },
        ctx,
        effects,
      );

    case "request_human":
      return requestHumanTool(
        str(args.reason, 50),
        str(args.summary, 1000),
        str(args.urgency, 20),
        ctx,
        effects,
      );

    default:
      return { ok: false, error: "unknown_tool" };
  }
}

/* -------------------------------------------------------------------------
   save_contact_details
------------------------------------------------------------------------- */

interface ContactArgs {
  name: string;
  email: string;
  phone: string;
  area: string;
  company: string;
  website: string;
  summary: string;
}

/**
 * Records who we are talking to, and raises the lead the moment it is possible.
 *
 * This replaced a two-tool arrangement — one to note a detail, one to declare a
 * lead — which was the wrong shape twice over. It gave the model a judgement
 * call about when someone "counts" as a lead, and it required an email AND a
 * website before anything was sent, so a visitor who gave a name, a number and
 * their town and then closed the tab produced no notification at all.
 *
 * The rule now is blunt and matches how the forms behave: an email address is
 * what makes a stranger contactable, so the first time we have one the team is
 * notified exactly as if a form had been submitted. Details arriving afterwards
 * update the same lead rather than sending a second email — a notification per
 * message would train everyone to ignore them.
 *
 * Only ever fills blanks in, so a later call that omits a field cannot erase an
 * earlier one.
 */
async function saveContactTool(
  args: ContactArgs,
  ctx: ToolContext,
  effects: ToolEffects,
): Promise<ToolResult> {
  const data: Record<string, string> = {};
  if (args.name) data.visitorName = args.name;
  if (args.email) data.visitorEmail = args.email;
  if (args.phone) data.visitorPhone = args.phone;
  if (args.area) data.visitorArea = args.area;
  if (args.company) data.visitorCompany = args.company;
  if (args.website) data.visitorWebsite = args.website;
  if (args.summary) data.qualifiedReason = args.summary;

  if (Object.keys(data).length === 0) {
    return {
      ok: false,
      error: "nothing_given",
      hint: "Only call this once you actually have a detail.",
    };
  }

  const updated = await ctx.prisma.chatConversation
    .update({
      where: { id: ctx.conversationId },
      data,
      select: { visitorEmail: true, leadId: true },
    })
    .catch(() => null);

  // An email address is the threshold. The route raises the lead once this turn
  // ends, and no-ops if one already exists for this conversation.
  const notify = Boolean(updated?.visitorEmail);
  if (notify) effects.leadCaptured = true;

  return {
    ok: true,
    saved: Object.keys(data).map((k) => k.replace("visitor", "").toLowerCase()),
    haveEmail: notify,
    hint: notify
      ? "Recorded, and the team has it. Never mention that you saved anything or that anyone was notified — just carry on."
      : "Recorded. Do not mention it. An email address is still the most useful thing to get.",
  };
}

/* -------------------------------------------------------------------------
   request_human
------------------------------------------------------------------------- */

async function requestHumanTool(
  reason: string,
  summary: string,
  urgency: string,
  ctx: ToolContext,
  effects: ToolEffects,
): Promise<ToolResult> {
  const result = await ctx.requestHuman(reason || "visitor_asked", summary, urgency);
  effects.handoffTriggered = true;

  return {
    ok: true,
    outcome: result.outcome,
    hint:
      result.outcome === "notified"
        ? "Tell them someone has been asked to join. Do not promise how quickly."
        : result.outcome === "cooldown"
          ? `A person was already asked recently and has this conversation. Say so, say they can ask again in about ${result.retryAfterMin ?? 1} minutes, and keep helping meanwhile. Do not say you notified anyone again.`
          : "The message did not get through. Give them the email address and phone number instead.",
  };
}
