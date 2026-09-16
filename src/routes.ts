/**
 * Route metadata — the single source of truth for paths, titles and
 * descriptions.
 *
 * Every route here is pre-rendered to static HTML at build time by
 * scripts/prerender.tsx, with these tags in its <head>, and sitemap.xml is
 * generated from the same list. applyRouteMeta() below keeps document.head in
 * step when the SPA navigates client-side.
 */

export const SITE_ORIGIN = 'https://heliumsol.com';
export const SITE_NAME = 'HeliumSol';

export const CONTACT_EMAIL = 'info@heliumsol.com';
export const CONTACT_PHONE = '+12028107042';
export const CONTACT_PHONE_DISPLAY = '202 810 7042';

/**
 * Shown at the bottom of every legal page. Bump this whenever the copy in
 * src/content/legal.tsx changes — a policy whose text has moved on but whose
 * date has not is worse than no date at all.
 */
export const LEGAL_UPDATED = 'September 16, 2026';

export type View = 'home' | 'contact' | 'privacy' | 'terms' | 'sms' | 'notfound';

export interface RouteMeta {
  path: string;
  view: View;
  title: string;
  description: string;
  /** Sitemap priority. Routes without one are left out of sitemap.xml. */
  priority?: number;
  /** Adds a robots noindex tag. */
  noindex?: boolean;
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    view: 'home',
    title: 'HeliumSol — Websites, Apps, Chatbots & Automation for Growing Businesses',
    description:
      'HeliumSol is a full-service digital agency building high-performance websites, web & mobile apps, AI chatbots, and n8n workflow automation. Book a free discovery call.',
    priority: 1.0,
  },
  {
    path: '/contact',
    view: 'contact',
    title: 'Contact HeliumSol | AI Chatbots, Automation, Websites & Apps',
    description:
      'Tell HeliumSol about your AI chatbot, automation, website, app or other tech project. A short three-step enquiry, and a reply within one business day.',
    priority: 0.9,
  },
  {
    path: '/privacy-policy',
    view: 'privacy',
    title: 'Privacy Policy | HeliumSol',
    description:
      'How HeliumSol collects and uses information from its website, enquiries, and SMS text messaging program — including mobile opt-in consent, STOP and HELP, and how to contact us about your data.',
    priority: 0.3,
  },
  {
    path: '/terms-of-service',
    view: 'terms',
    title: 'Terms of Service | HeliumSol',
    description:
      'The terms for using the HeliumSol website and AI assistant, and the SMS terms for the HeliumSol text messaging program — message types, frequency, rates, and STOP and HELP.',
    priority: 0.3,
  },
  {
    path: '/sms-program',
    view: 'sms',
    title: 'SMS Program | HeliumSol',
    description:
      'How the HeliumSol SMS program works — the messages we send, how customers give verbal consent, sample messages, and how to opt out with STOP or get help with HELP.',
    priority: 0.3,
  },
];

/** Pre-rendered to 404.html and served with a real 404 status. */
export const NOT_FOUND_ROUTE: RouteMeta = {
  path: '/404',
  view: 'notfound',
  title: 'Page not found | HeliumSol',
  description: 'That page does not exist on heliumsol.com.',
  noindex: true,
};

/**
 * Trailing slashes are stripped so /privacy-policy/ is not a different page,
 * and a trailing /index.html is dropped because the prerendered legal pages
 * really exist at /privacy-policy/index.html — without this, a link to that
 * URL would serve the policy and then swap it for the homepage.
 */
function normalize(pathname: string): string {
  const path = pathname.replace(/\/index\.html$/, '/');
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

const ROUTE_BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

/**
 * Unknown paths get the not-found view. The production server answers them
 * with 404.html and a real 404 status; this is what the client renders.
 */
export function getRoute(pathname: string): RouteMeta {
  return ROUTE_BY_PATH.get(normalize(pathname)) ?? NOT_FOUND_ROUTE;
}

/**
 * Client-side navigation.
 *
 * Dispatching a synthetic popstate is what lets App re-read the path without
 * every caller needing a handle on its setState — the same listener then
 * serves both the browser's own back/forward events and these pushes.
 */
export function navigate(path: string) {
  if (normalize(window.location.pathname) === normalize(path)) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/** Point document.title and the description/canonical tags at the current route. */
export function applyRouteMeta(route: RouteMeta) {
  document.title = route.title;

  const setMeta = (selector: string, attr: string, name: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', route.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', route.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', route.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `${SITE_ORIGIN}${route.path}`;
}
