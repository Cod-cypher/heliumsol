/**
 * Build step: write real HTML files for the legal routes.
 *
 * Runs after `vite build` (see the build script in package.json). The site is
 * a client-rendered SPA and the server answers every path with the same
 * index.html shell, so before this step anything that reads a page's HTML
 * without running JavaScript got the homepage's title and an empty #root at
 * /privacy-policy and /terms-of-service. That includes the carrier review of
 * the HeliumSol SMS registration, which reported it could not confirm those
 * URLs contained the policies.
 *
 * For each legal route this renders the same LegalPage the browser renders
 * into the built shell, gives it the route's own title, description and
 * canonical, and writes it to dist/<path>/index.html. The client bundle then
 * takes over as normal; data-prerendered on #root tells LegalPage not to
 * replay its entrance animation over text that is already on screen.
 *
 * Serving it needs the web server to prefer a directory's index.html over the
 * SPA fallback — in nginx, `try_files $uri $uri/ /index.html;`.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import LegalPage from "../src/pages/LegalPage";
import { PRIVACY, TERMS, type LegalDoc } from "../src/content/legal";
import { ROUTES, SITE_ORIGIN, type View } from "../src/routes";

const DOCS: Partial<Record<View, LegalDoc>> = { privacy: PRIVACY, terms: TERMS };

const dist = new URL("../dist/", import.meta.url);
const shell = readFileSync(new URL("index.html", dist), "utf8");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Replace the one match of `pattern`, or fail the build. A silent miss would
 * ship a legal page with the homepage's title, which is the bug this exists
 * to fix.
 */
function replaceOnce(html: string, pattern: RegExp, replacement: string, what: string) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: could not find ${what} in dist/index.html`);
  }
  return html.replace(pattern, () => replacement);
}

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  return replaceOnce(
    html,
    new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`),
    `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`,
    `<meta ${attr}="${key}">`,
  );
}

for (const route of ROUTES) {
  const doc = DOCS[route.view];
  if (!doc) continue;

  let html = shell;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`, "<title>");
  html = setMeta(html, "name", "description", route.description);
  html = setMeta(html, "property", "og:title", route.title);
  html = setMeta(html, "property", "og:description", route.description);
  html = setMeta(html, "name", "twitter:title", route.title);
  html = setMeta(html, "name", "twitter:description", route.description);
  html = replaceOnce(
    html,
    /<\/head>/,
    `  <link rel="canonical" href="${SITE_ORIGIN}${route.path}" />\n  </head>`,
    "</head>",
  );
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root" data-prerendered>${renderToStaticMarkup(<LegalPage doc={doc} />)}</div>`,
    '<div id="root">',
  );

  const outDir = new URL(`.${route.path}/`, dist);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(new URL("index.html", outDir), html);
  console.log(`prerendered ${route.path} -> dist${route.path}/index.html`);
}
