/**
 * Route metadata — the single source of truth for paths, titles and
 * descriptions.
 *
 * The site is a client-rendered SPA, so these are applied to document.head at
 * runtime by applyRouteMeta() below. That is enough for the browser tab, for
 * anything that executes JS, and for sharing a link in a chat client that runs
 * the page. It is NOT enough for crawlers that read raw HTML — see the note on
 * applyRouteMeta, and scripts/prerender.tsx for how the legal routes get
 * around that.
 */

export const SITE_ORIGIN = 'https://heliumsol.com';
export const SITE_NAME = 'HeliumSol';

/**
 * Shown at the bottom of every legal page. Bump this whenever the copy in
 * src/content/legal.tsx changes — a policy whose text has moved on but whose
 * date has not is worse than no date at all.
 */
export const LEGAL_UPDATED = 'September 11, 2026';

export type View = 'home' | 'privacy' | 'terms';

export interface RouteMeta {
  path: string;
  view: View;
  title: string;
  description: string;
}

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    view: 'home',
    title: 'HeliumSol — Websites, Apps, Chatbots & Automation for Growing Businesses',
    description:
      'HeliumSol is a full-service digital agency building high-performance websites, web & mobile apps, AI chatbots, and n8n workflow automation. Book a free discovery call.',
  },
  {
    path: '/privacy-policy',
    view: 'privacy',
    title: 'Privacy Policy | HeliumSol',
    description:
      'How HeliumSol collects and uses information from its website, enquiries, and SMS text messaging program — including mobile opt-in consent, STOP and HELP, and how to contact us about your data.',
  },
  {
    path: '/terms-of-service',
    view: 'terms',
    title: 'Terms of Service | HeliumSol',
    description:
      'The terms for using the HeliumSol website and AI assistant, and the SMS terms for the HeliumSol text messaging program — message types, frequency, rates, and STOP and HELP.',
  },
];

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
 * Unknown paths fall back to the homepage rather than a 404 view.
 *
 * The server serves index.html for any unmatched path (SPA fallback), so this
 * function is what decides what a visitor actually sees. There is no 404 view
 * on this site yet; sending a stray URL to the homepage is the least
 * surprising behaviour until there is one.
 */
export function getRoute(pathname: string): RouteMeta {
  return ROUTE_BY_PATH.get(normalize(pathname)) ?? ROUTES[0];
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

/**
 * Point document.title and the description/canonical tags at the current route.
 *
 * Note this runs in the browser only. Crawlers that read the served HTML
 * without executing JS see index.html's homepage tags on every URL — except
 * the legal routes, which scripts/prerender.tsx writes out as static HTML at
 * build time with their own tags and full text, because SMS carrier reviewers
 * read those pages without running JS. A new route that has to be readable
 * that way needs adding to that script too.
 */
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
