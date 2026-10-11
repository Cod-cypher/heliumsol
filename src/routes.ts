/**
 * Route metadata — the single source of truth for paths, titles and
 * descriptions.
 *
 * Every route here is pre-rendered to static HTML at build time by
 * scripts/prerender.ts, with these tags in its <head>, and sitemap.xml is
 * generated from the same list. applyRouteMeta() below keeps document.head in
 * step when the SPA navigates client-side.
 *
 * The list is composed: the hand-written pages below, plus one route per
 * service page, landing page, blog category and blog post from src/content.
 * Adding a post or a content entry adds its route, its prerendered HTML and
 * its sitemap line with no further step.
 *
 * NEVER import this file from server/ or shared/. It pulls in the blog
 * content, which is built by a Vite plugin from markdown; esbuild cannot
 * bundle that into dist/server.cjs. Shared constants live in src/site.ts.
 */

import { SITE_ORIGIN, LEGAL_UPDATED_ISO, SIGNUP_PATH, DEFAULT_OG_IMAGE, type OgImage } from './site';
import { SERVICES } from './content/services';
import { LANDINGS } from './content/landings';
import { POSTS, CATEGORIES, blogLastmod } from './content/blog';

export type View =
  | 'home'
  | 'contact'
  | 'about'
  | 'caseStudies'
  | 'signup'
  | 'services'
  | 'service'
  | 'landing'
  | 'blog'
  | 'blogCategory'
  | 'post'
  | 'privacy'
  | 'terms'
  | 'sms'
  | 'notfound';

interface RouteBase {
  path: string;
  title: string;
  description: string;
  /** Sitemap priority. Routes without one are left out of sitemap.xml. */
  priority?: number;
  /** Adds a robots noindex tag and drops the canonical. */
  noindex?: boolean;
  /** YYYY-MM-DD for sitemap lastmod. Omitted when unknown, never faked. */
  lastmod?: string;
  /** Share image; prerender falls back to DEFAULT_OG_IMAGE. */
  ogImage?: OgImage;
}

export type RouteMeta =
  | (RouteBase & {
      view:
        | 'home'
        | 'contact'
        | 'about'
        | 'caseStudies'
        | 'signup'
        | 'services'
        | 'blog'
        | 'privacy'
        | 'terms'
        | 'sms'
        | 'notfound';
    })
  | (RouteBase & { view: 'service'; slug: string })
  | (RouteBase & { view: 'landing'; slug: string })
  | (RouteBase & { view: 'blogCategory'; category: string })
  | (RouteBase & {
      view: 'post';
      slug: string;
      article: { published: string; modified?: string; section: string; tags: string[] };
    });

/** Date the hand-written pages were last substantively edited. */
const PAGES_UPDATED = '2026-10-12';

const STATIC_ROUTES: RouteMeta[] = [
  {
    path: '/',
    view: 'home',
    title: 'HeliumSol — Websites, Apps, AI Chatbots & Automation',
    description:
      'Full-service digital agency building fast websites, web and mobile apps, AI chatbots and assistants, and n8n automation. Start with a free website and chatbot.',
    priority: 1.0,
    lastmod: PAGES_UPDATED,
  },
  {
    path: SIGNUP_PATH,
    view: 'signup',
    title: 'Free Website + AI Chatbot, 1 Month API Included | HeliumSol',
    description:
      'A free website plus a knowledge-base chatbot trained on your business, with API usage included for the first month. One short form; a person reads it.',
    priority: 0.9,
    lastmod: PAGES_UPDATED,
  },
  {
    path: '/services',
    view: 'services',
    title: 'Services: Web, Mobile, AI Chatbots & Automation | HeliumSol',
    description:
      'Full-stack websites and web apps, mobile apps, AI chatbots, AI assistant solutions and n8n automation. See what each includes and how a project runs.',
    priority: 0.8,
    lastmod: PAGES_UPDATED,
  },
  {
    path: '/blog',
    view: 'blog',
    title: 'Blog: Websites, Apps, AI Chatbots & Automation | HeliumSol',
    description:
      'Plain-language guides on AI chatbots and assistants, website performance, mobile app decisions and n8n automation, with sources you can check.',
    priority: 0.7,
    lastmod: blogLastmod(POSTS) ?? PAGES_UPDATED,
  },
  {
    path: '/about',
    view: 'about',
    title: 'About HeliumSol: A Remote Digital Agency Building Websites, Apps & AI',
    description:
      'HeliumSol, a brand of Idea Brothers LLC, is a remote digital agency building websites, web and mobile apps, AI chatbots and assistants, and automation.',
    priority: 0.6,
    lastmod: PAGES_UPDATED,
  },
  {
    path: '/case-studies',
    view: 'caseStudies',
    title: 'Case Studies | HeliumSol',
    description:
      'Examples of the kinds of websites, apps, chatbots and automations HeliumSol builds. Client case studies are published here with permission as they become available.',
    priority: 0.5,
    lastmod: PAGES_UPDATED,
  },
  {
    path: '/contact',
    view: 'contact',
    title: 'Contact HeliumSol | AI Chatbots, Automation, Websites & Apps',
    description:
      'Tell HeliumSol about your AI chatbot, automation, website, app or other tech project. A short three-step enquiry, and a reply within one business day.',
    priority: 0.8,
    lastmod: PAGES_UPDATED,
  },
  {
    path: '/privacy-policy',
    view: 'privacy',
    title: 'Privacy Policy | HeliumSol',
    description:
      'How HeliumSol collects and uses information from its website, enquiries, and SMS text messaging program — including mobile opt-in consent, STOP and HELP, and how to contact us about your data.',
    priority: 0.3,
    lastmod: LEGAL_UPDATED_ISO,
  },
  {
    path: '/terms-of-service',
    view: 'terms',
    title: 'Terms of Service | HeliumSol',
    description:
      'The terms for using the HeliumSol website and AI assistant, and the SMS terms for the HeliumSol text messaging program — message types, frequency, rates, and STOP and HELP.',
    priority: 0.3,
    lastmod: LEGAL_UPDATED_ISO,
  },
  {
    path: '/sms-program',
    view: 'sms',
    title: 'SMS Program | HeliumSol',
    description:
      'How the HeliumSol SMS program works — the messages we send, how customers give verbal consent, sample messages, and how to opt out with STOP or get help with HELP.',
    priority: 0.3,
    lastmod: LEGAL_UPDATED_ISO,
  },
];

const SERVICE_ROUTES: RouteMeta[] = SERVICES.map((s) => ({
  path: `/services/${s.slug}`,
  view: 'service',
  slug: s.slug,
  title: `${s.title} | HeliumSol`,
  description: s.description,
  priority: 0.9,
  lastmod: s.updated,
  ogImage: s.ogImage,
}));

const LANDING_ROUTES: RouteMeta[] = LANDINGS.map((l) => ({
  path: `/${l.slug}`,
  view: 'landing',
  slug: l.slug,
  title: `${l.title} | HeliumSol`,
  description: l.description,
  priority: 0.8,
  lastmod: l.updated,
  ogImage: l.ogImage,
}));

const BLOG_ROUTES: RouteMeta[] = [
  ...CATEGORIES.map(
    (c): RouteMeta => ({
      path: `/blog/category/${c.slug}`,
      view: 'blogCategory',
      category: c.slug,
      title: `${c.name} | HeliumSol Blog`,
      description: c.description,
      priority: 0.5,
      lastmod: blogLastmod(c.posts),
    }),
  ),
  ...POSTS.map(
    (p): RouteMeta => ({
      path: p.path,
      view: 'post',
      slug: p.slug,
      title: p.seoTitle ?? `${p.title} | HeliumSol`,
      description: p.description,
      priority: 0.6,
      lastmod: p.updated ?? p.date,
      ogImage: p.ogImage,
      article: { published: p.date, modified: p.updated, section: p.category, tags: p.tags },
    }),
  ),
];

export const ROUTES: RouteMeta[] = [...STATIC_ROUTES, ...SERVICE_ROUTES, ...LANDING_ROUTES, ...BLOG_ROUTES];

// A post slugged "category", or a landing page that collides with a static
// page, would silently shadow the other. Fail both Vite builds instead.
{
  const seen = new Set<string>();
  for (const r of ROUTES) {
    if (seen.has(r.path)) throw new Error(`Duplicate route path: ${r.path}`);
    seen.add(r.path);
  }
}

/** Pre-rendered to 404.html and served with a real 404 status. */
export const NOT_FOUND_ROUTE: RouteMeta = {
  path: '/404',
  view: 'notfound',
  title: 'Page not found | HeliumSol',
  description: 'That page does not exist on heliumsol.com. Try the homepage, the services, the blog or the contact page.',
  noindex: true,
};

/**
 * Trailing slashes are stripped so /privacy-policy/ is not a different page,
 * and a trailing /index.html is dropped because the prerendered pages really
 * exist at /<path>/index.html — without this, a link to that URL would serve
 * the page and then swap it for the homepage.
 */
export function normalizePath(pathname: string): string {
  const path = pathname.replace(/\/index\.html$/, '/');
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

const ROUTE_BY_PATH = new Map(ROUTES.map((r) => [r.path, r]));

/**
 * Unknown paths get the not-found view. The production server answers them
 * with 404.html and a real 404 status; this is what the client renders.
 */
export function getRoute(pathname: string): RouteMeta {
  return ROUTE_BY_PATH.get(normalizePath(pathname)) ?? NOT_FOUND_ROUTE;
}

/**
 * Client-side navigation.
 *
 * Dispatching a synthetic popstate is what lets App re-read the path without
 * every caller needing a handle on its setState — the same listener then
 * serves both the browser's own back/forward events and these pushes.
 */
export function navigate(path: string) {
  if (normalizePath(window.location.pathname) === normalizePath(path)) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/** Point document.title and the description/canonical/social tags at the current route. */
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

  const url = `${SITE_ORIGIN}${route.path}`;
  const image = route.ogImage ?? DEFAULT_OG_IMAGE;

  setMeta('meta[name="description"]', 'name', 'description', route.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', route.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', route.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  setMeta('meta[property="og:image"]', 'property', 'og:image', `${SITE_ORIGIN}${image.url}`);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', route.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', route.description);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (route.noindex) {
    // The 404 view must not claim a canonical URL of its own.
    canonical?.remove();
    return;
  }
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}
