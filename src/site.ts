/**
 * Site-wide constants: origin, name, contact details, legal date.
 *
 * These live apart from src/routes.ts on purpose. The server bundle
 * (server/chat/*) and the chat copy need the origin and contact details, but
 * routes.ts imports the blog, service and landing content — including the
 * build-time markdown glob — which must never be pulled into dist/server.cjs.
 * Anything that both the server and the client need belongs here.
 */

export const SITE_ORIGIN = 'https://heliumsol.com';
export const SITE_NAME = 'HeliumSol';
export const LEGAL_NAME = 'Idea Brothers LLC';

export const CONTACT_EMAIL = 'info@heliumsol.com';
export const CONTACT_PHONE = '+12028107042';
export const CONTACT_PHONE_DISPLAY = '+1 (202) 810-7042';

/**
 * Shown at the bottom of every legal page. Bump this whenever the copy in
 * src/content/legal.tsx changes — a policy whose text has moved on but whose
 * date has not is worse than no date at all. ISO form feeds sitemap lastmod.
 */
export const LEGAL_UPDATED_ISO = '2026-09-16';
export const LEGAL_UPDATED = 'September 16, 2026';

/** The free offer signup page. Every closing CTA and the header button point here. */
export const SIGNUP_PATH = '/free-website-and-chatbot';

export interface OgImage {
  /** Root-relative path under public/, e.g. /og-default.png. PNG or JPEG. */
  url: string;
  width: number;
  height: number;
  alt: string;
}

/** Used on every page without its own share image. 1200x630, committed PNG. */
export const DEFAULT_OG_IMAGE: OgImage = {
  url: '/og-default.png',
  width: 1200,
  height: 630,
  alt: 'HeliumSol — websites, apps, AI chatbots and automation',
};
