/**
 * Build-time pre-rendering.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server), and turns
 * every route in src/routes.ts into a static HTML file with real content and
 * its own title, description, canonical, social tags and share image.
 * Crawlers, AI assistants and SMS carrier reviewers read these without
 * running JavaScript; the browser then hydrates the same markup.
 *
 * Also writes 404.html, the empty app-shell.html the admin app and agent
 * console are served from, sitemap.xml, robots.txt, the blog RSS feed and a
 * manifest for scripts/verify-seo.ts — all from the same route list, so none
 * of them can drift out of sync with what exists.
 *
 * Google Analytics and Search Console tags are injected only when
 * GA4_MEASUREMENT_ID / GSC_VERIFICATION are set in .env.
 *
 * Usage: tsx scripts/prerender.ts [outDir]. outDir defaults to dist; deploy.sh
 * builds into dist-new and passes that.
 */

import 'dotenv/config';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { RouteMeta } from '../src/routes';
import type { Post, Category } from '../src/content/blog';
import type { OgImage } from '../src/site';

const ROOT = process.cwd();
const OUT = path.join(ROOT, process.argv[2] ?? 'dist');
// Only <out>/client is served to the public; the SSR bundle stays outside it.
const CLIENT = path.join(OUT, 'client');
const SSR_ENTRY = path.join(OUT, 'ssr', 'entry-server.js');

const HEAD_BLOCK = /<!--app-head-->[\s\S]*?<!--\/app-head-->/;
const APP_HTML = '<!--app-html-->';

const GA4_ID = (process.env.GA4_MEASUREMENT_ID ?? '').trim();
const GSC_TOKEN = (process.env.GSC_VERIFICATION ?? '').trim();

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Where a route's HTML goes on disk. */
function outFileFor(route: RouteMeta): string {
  if (route.path === '/') return path.join(CLIENT, 'index.html');
  if (route.path === '/404') return path.join(CLIENT, '404.html');
  return path.join(CLIENT, route.path.slice(1), 'index.html');
}

/**
 * The GA4 loader with Consent Mode v2. Analytics storage starts denied; the
 * ConsentBanner component upgrades it on "Allow", and a stored choice is
 * replayed here so a returning visitor is not asked twice.
 */
function analyticsTags(): string {
  if (!GA4_ID) return '';
  if (!/^G-[A-Z0-9]+$/.test(GA4_ID)) throw new Error(`GA4_MEASUREMENT_ID "${GA4_ID}" does not look like a GA4 id`);
  return [
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>`,
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
      `gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});` +
      `try{if(localStorage.getItem('hs_consent')==='granted'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}` +
      `gtag('js',new Date());gtag('config','${GA4_ID}');window.__GA4__='${GA4_ID}';</script>`,
  ].join('\n');
}

function headFor(route: RouteMeta, origin: string, defaultImage: OgImage): string {
  const indexable = !route.noindex;
  const url = `${origin}${route.path}`;
  const image = route.ogImage ?? defaultImage;
  const isArticle = route.view === 'post';

  const lines = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    indexable ? '' : `<meta name="robots" content="noindex, follow" />`,
    indexable ? `<link rel="canonical" href="${url}" />` : '',
    GSC_TOKEN ? `<meta name="google-site-verification" content="${esc(GSC_TOKEN)}" />` : '',
    `<meta property="og:type" content="${isArticle ? 'article' : 'website'}" />`,
    `<meta property="og:site_name" content="HeliumSol" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    indexable ? `<meta property="og:url" content="${url}" />` : '',
    `<meta property="og:image" content="${origin}${image.url}" />`,
    `<meta property="og:image:width" content="${image.width}" />`,
    `<meta property="og:image:height" content="${image.height}" />`,
    `<meta property="og:image:alt" content="${esc(image.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    `<meta name="twitter:image" content="${origin}${image.url}" />`,
    `<link rel="alternate" type="application/rss+xml" title="HeliumSol Blog" href="${origin}/blog/feed.xml" />`,
  ];

  if (route.view === 'post') {
    lines.push(`<meta property="article:published_time" content="${route.article.published}" />`);
    if (route.article.modified) {
      lines.push(`<meta property="article:modified_time" content="${route.article.modified}" />`);
    }
    lines.push(`<meta property="article:section" content="${esc(route.article.section)}" />`);
    for (const tag of route.article.tags) lines.push(`<meta property="article:tag" content="${esc(tag)}" />`);
  }

  lines.push(analyticsTags());

  return lines
    .filter(Boolean)
    .map((line) => `    ${line}`)
    .join('\n');
}

const rfc822 = (iso: string) => new Date(`${iso}T09:00:00Z`).toUTCString();

/** RSS 2.0 with full content, newest first. */
function feedXml(origin: string, posts: Post[], bodies: Record<string, string>): string {
  const absolute = (html: string) =>
    html.replace(/(href|src)="\/(?!\/)/g, `$1="${origin}/`).replace(/\]\]>/g, ']]]]><![CDATA[>');

  const items = posts
    .map((p) => {
      const url = `${origin}${p.path}`;
      const body = bodies[p.slug];
      if (body == null) throw new Error(`[prerender] no body for post ${p.slug}`);
      return [
        '    <item>',
        `      <title>${esc(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(p.updated ?? p.date)}</pubDate>`,
        `      <category>${esc(p.categoryName)}</category>`,
        `      <dc:creator>${esc(p.authorRef.name)}</dc:creator>`,
        `      <description>${esc(p.description)}</description>`,
        `      <content:encoded><![CDATA[${absolute(body)}]]></content:encoded>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    '    <title>HeliumSol Blog</title>',
    `    <link>${origin}/blog</link>`,
    `    <atom:link href="${origin}/blog/feed.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Practical guides on websites, apps, AI chatbots and workflow automation from the HeliumSol team.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

async function main() {
  const template = await fs.readFile(path.join(CLIENT, 'index.html'), 'utf-8');
  if (!HEAD_BLOCK.test(template) || !template.includes(APP_HTML)) {
    throw new Error(
      `${path.relative(ROOT, CLIENT)}/index.html is missing the <!--app-head--> or <!--app-html--> markers. ` +
        'They must survive from index.html into the build.',
    );
  }

  const ssr = (await import(pathToFileURL(SSR_ENTRY).href)) as {
    render: (path: string) => string;
    ROUTES: RouteMeta[];
    NOT_FOUND_ROUTE: RouteMeta;
    POSTS: Post[];
    CATEGORIES: Category[];
    POST_BODIES: Record<string, string>;
    SITE_ORIGIN: string;
    DEFAULT_OG_IMAGE: OgImage;
  };
  const { render, ROUTES, NOT_FOUND_ROUTE, POSTS, POST_BODIES, SITE_ORIGIN, DEFAULT_OG_IMAGE } = ssr;

  // Vite has already copied public/ into the client dir, so every share
  // image a route names must exist there now.
  const images = new Set([DEFAULT_OG_IMAGE.url, ...ROUTES.map((r) => r.ogImage?.url).filter(Boolean)]);
  for (const img of images) {
    if (!existsSync(path.join(CLIENT, img!))) throw new Error(`[prerender] share image missing: public${img}`);
  }

  const manifest: {
    origin: string;
    builtAt: string;
    postCount: number;
    pages: { path: string; file: string; view: string; noindex: boolean; inSitemap: boolean }[];
  } = { origin: SITE_ORIGIN, builtAt: new Date().toISOString(), postCount: POSTS.length, pages: [] };

  for (const route of [...ROUTES, NOT_FOUND_ROUTE]) {
    const html = render(route.path);

    const page = template
      .replace(HEAD_BLOCK, () => headFor(route, SITE_ORIGIN, DEFAULT_OG_IMAGE).trimStart())
      .replace(APP_HTML, () => html)
      // Tells src/main.tsx to hydrate rather than mount from scratch.
      .replace('data-prerendered="false"', 'data-prerendered="true"');

    const outFile = outFileFor(route);
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, page, 'utf-8');

    manifest.pages.push({
      path: route.path,
      file: path.relative(CLIENT, outFile).replace(/\\/g, '/'),
      view: route.view,
      noindex: Boolean(route.noindex),
      inSitemap: !route.noindex && route.priority != null,
    });

    const words = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    console.log(`  ${route.path.padEnd(44)} ${String(words).padStart(5)} words`);
  }

  // The empty shell for the admin app and agent console. Cannot reuse
  // index.html, which now holds the homepage markup and would flash it.
  const shell = template
    .replace(HEAD_BLOCK, '<title>HeliumSol</title>\n    <meta name="robots" content="noindex, nofollow" />')
    .replace(APP_HTML, '');
  await fs.writeFile(path.join(CLIENT, 'app-shell.html'), shell, 'utf-8');

  // sitemap.xml: lastmod only when the route states one. A build-date
  // fallback would change every URL on every deploy, which teaches crawlers
  // to ignore the field.
  const urls = ROUTES.filter((r) => !r.noindex && r.priority != null)
    .map((r) => {
      if (r.lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(r.lastmod)) {
        throw new Error(`[prerender] ${r.path}: lastmod must be YYYY-MM-DD`);
      }
      return (
        `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>\n` +
        (r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>\n` : '') +
        `    <priority>${r.priority!.toFixed(1)}</priority>\n  </url>`
      );
    })
    .join('\n');
  await fs.writeFile(
    path.join(CLIENT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf-8',
  );

  await fs.writeFile(
    path.join(CLIENT, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /chat/\nDisallow: /api/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
    'utf-8',
  );

  await fs.mkdir(path.join(CLIENT, 'blog'), { recursive: true });
  await fs.writeFile(path.join(CLIENT, 'blog', 'feed.xml'), feedXml(SITE_ORIGIN, POSTS, POST_BODIES), 'utf-8');

  // Outside client/, so it is never served.
  await fs.writeFile(path.join(OUT, 'prerender-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(
    `[prerender] ${ROUTES.length + 1} pages + app-shell.html, sitemap.xml, robots.txt, blog/feed.xml -> ${path.relative(ROOT, CLIENT)}` +
      (GA4_ID ? ` (GA4 ${GA4_ID})` : ' (no GA4 id set)'),
  );
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
