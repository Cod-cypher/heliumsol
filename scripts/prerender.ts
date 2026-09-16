/**
 * Build-time pre-rendering.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server), and turns
 * every route in src/routes.ts into a static HTML file with real content and
 * its own title, description, canonical and social tags. Crawlers, AI
 * assistants and SMS carrier reviewers read these without running JavaScript;
 * the browser then hydrates the same markup.
 *
 * Also writes 404.html, the empty app-shell.html the admin app and agent
 * console are served from, sitemap.xml and robots.txt — all from the same
 * route list, so none of them can drift out of sync with what exists.
 *
 * Usage: tsx scripts/prerender.ts [outDir]. outDir defaults to dist; deploy.sh
 * builds into dist-new and passes that.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const OUT = path.join(ROOT, process.argv[2] ?? 'dist');
// Only <out>/client is served to the public; the SSR bundle stays outside it.
const CLIENT = path.join(OUT, 'client');
const SSR_ENTRY = path.join(OUT, 'ssr', 'entry-server.js');

const HEAD_BLOCK = /<!--app-head-->[\s\S]*?<!--\/app-head-->/;
const APP_HTML = '<!--app-html-->';

interface Route {
  path: string;
  title: string;
  description: string;
  priority?: number;
  noindex?: boolean;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headFor(route: Route, origin: string, extra = ''): string {
  const url = route.path === '/404' ? '' : `${origin}${route.path}`;
  return [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    route.noindex ? `<meta name="robots" content="noindex, follow" />` : '',
    url ? `<link rel="canonical" href="${url}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="HeliumSol" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    url ? `<meta property="og:url" content="${url}" />` : '',
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(route.title)}" />`,
    `<meta name="twitter:description" content="${esc(route.description)}" />`,
    extra,
  ]
    .filter(Boolean)
    .map((line) => `    ${line}`)
    .join('\n');
}

/** Organization data for the homepage. Only facts the site states itself. */
function organizationJsonLd(origin: string, email: string, phone: string): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'HeliumSol',
    url: `${origin}/`,
    email,
    telephone: phone,
    description:
      'Full-service digital agency building websites, web and mobile apps, AI chatbots and workflow automation.',
    areaServed: 'Worldwide',
    knowsAbout: ['Website development', 'Web and mobile apps', 'AI chatbots', 'Workflow automation', 'n8n'],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\u003c')}</script>`;
}

async function main() {
  const template = await fs.readFile(path.join(CLIENT, 'index.html'), 'utf-8');
  if (!HEAD_BLOCK.test(template) || !template.includes(APP_HTML)) {
    throw new Error(
      `${path.relative(ROOT, CLIENT)}/index.html is missing the <!--app-head--> or <!--app-html--> markers. ` +
        'They must survive from index.html into the build.',
    );
  }

  const { render, ROUTES, NOT_FOUND_ROUTE, SITE_ORIGIN, CONTACT_EMAIL, CONTACT_PHONE } = await import(
    pathToFileURL(SSR_ENTRY).href
  );

  for (const route of [...ROUTES, NOT_FOUND_ROUTE] as Route[]) {
    const html: string = render(route.path);
    const extra = route.path === '/' ? organizationJsonLd(SITE_ORIGIN, CONTACT_EMAIL, CONTACT_PHONE) : '';

    const page = template
      .replace(HEAD_BLOCK, () => headFor(route, SITE_ORIGIN, extra).trimStart())
      .replace(APP_HTML, () => html)
      // Tells src/main.tsx to hydrate rather than mount from scratch.
      .replace('data-prerendered="false"', 'data-prerendered="true"');

    const outFile =
      route.path === '/'
        ? path.join(CLIENT, 'index.html')
        : route.path === '/404'
          ? path.join(CLIENT, '404.html')
          : path.join(CLIENT, route.path.slice(1), 'index.html');

    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, page, 'utf-8');

    const words = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    console.log(`  ${route.path.padEnd(20)} ${String(words).padStart(5)} words`);
  }

  // The empty shell for the admin app and agent console. Cannot reuse
  // index.html, which now holds the homepage markup and would flash it.
  const shell = template
    .replace(HEAD_BLOCK, '<title>HeliumSol</title>\n    <meta name="robots" content="noindex, nofollow" />')
    .replace(APP_HTML, '');
  await fs.writeFile(path.join(CLIENT, 'app-shell.html'), shell, 'utf-8');

  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = (ROUTES as Route[])
    .filter((r) => !r.noindex && r.priority != null)
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        `    <priority>${r.priority!.toFixed(1)}</priority>\n  </url>`,
    )
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

  console.log(`[prerender] ${ROUTES.length + 1} pages + app-shell.html, sitemap.xml, robots.txt -> ${path.relative(ROOT, CLIENT)}`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
