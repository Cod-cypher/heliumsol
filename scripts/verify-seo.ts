/**
 * Post-build SEO gate. Reads the prerendered site and fails the build on
 * anything a crawler, a share preview or a reader without JavaScript would
 * trip over:
 *
 *   - exactly one <h1>, <title>, meta description and canonical per page
 *   - no prerendered <h1> hidden at opacity 0
 *   - og:image present, absolute, and an existing 1200x630 PNG
 *   - every internal link resolves to a built page or file, and every
 *     #anchor to an element id
 *   - every <img> has width, height and alt
 *   - JSON-LD parses, and each page type carries the types it should
 *   - a visible FAQ and its FAQPage data agree on the question count
 *   - sitemap.xml lists exactly the indexable pages; the RSS feed has every
 *     post; every URL in llms.txt resolves
 *   - the server bundle never pulled in src/routes.ts or the blog
 *
 * Usage: tsx scripts/verify-seo.ts [outDir=dist]
 */

import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ROOT = process.cwd();
const OUT = path.join(ROOT, process.argv[2] ?? 'dist');
const CLIENT = path.join(OUT, 'client');

interface ManifestPage {
  path: string;
  file: string;
  view: string;
  noindex: boolean;
  inSitemap: boolean;
}
interface Manifest {
  origin: string;
  postCount: number;
  pages: ManifestPage[];
}

const errors: string[] = [];
const warnings: string[] = [];
const err = (where: string, msg: string): void => {
  errors.push(`${where}: ${msg}`);
};
const warn = (where: string, msg: string): void => {
  warnings.push(`${where}: ${msg}`);
};

const EXPECTED_TYPES: Record<string, string[][]> = {
  home: [['ProfessionalService', 'Organization'], ['WebSite']],
  service: [['Service'], ['FAQPage'], ['BreadcrumbList']],
  landing: [['Service'], ['FAQPage'], ['BreadcrumbList']],
  post: [['BlogPosting', 'Article'], ['BreadcrumbList']],
  blog: [['CollectionPage'], ['BreadcrumbList']],
  blogCategory: [['CollectionPage'], ['BreadcrumbList']],
  services: [['CollectionPage'], ['BreadcrumbList']],
  about: [['AboutPage'], ['BreadcrumbList']],
  caseStudies: [['CollectionPage'], ['BreadcrumbList']],
  signup: [['WebPage'], ['FAQPage'], ['BreadcrumbList']],
};

function normalize(p: string): string {
  const clean = p.replace(/\/index\.html$/, '/');
  return clean.length > 1 ? clean.replace(/\/+$/, '') : clean;
}

function fileForPath(p: string): string | null {
  const clean = normalize(p);
  const asPage = clean === '/' ? path.join(CLIENT, 'index.html') : path.join(CLIENT, clean.slice(1), 'index.html');
  if (fs.existsSync(asPage)) return asPage;
  const asFile = path.join(CLIENT, clean.slice(1));
  if (clean !== '/' && fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return asFile;
  return null;
}

function pngSize(file: string): { width: number; height: number } | null {
  const buf = fs.readFileSync(file);
  if (buf.length < 24 || buf.toString('hex', 0, 8) !== '89504e470d0a1a0a') return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function collectTypes(node: unknown, out: Set<string>) {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, out));
  if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    const t = obj['@type'];
    if (typeof t === 'string') out.add(t);
    if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && out.add(x));
    if (Array.isArray(obj['@graph'])) collectTypes(obj['@graph'], out);
  }
}

function checkPage(page: ManifestPage, origin: string) {
  const where = page.path;
  const file = path.join(CLIENT, page.file);
  if (!fs.existsSync(file)) return err(where, `missing ${page.file}`);
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);

  if (!/data-prerendered="true"/.test(html)) err(where, 'not marked data-prerendered="true"');
  if (!$('#root').children().length) err(where, '#root is empty');

  // Headings
  const h1s = $('h1');
  if (h1s.length !== 1) err(where, `expected exactly one <h1>, found ${h1s.length}`);
  else {
    if (!h1s.first().text().trim()) err(where, '<h1> is empty');
    const hidden = h1s
      .first()
      .parents()
      .addBack()
      .filter((_, el) => /opacity:\s*0(?![.\d])/.test(String($(el).attr('style') ?? '')));
    if (hidden.length) err(where, '<h1> ships inside an element with inline opacity:0');
  }

  // Head tags
  const titles = $('head title');
  if (titles.length !== 1) err(where, `expected one <title>, found ${titles.length}`);
  else {
    const t = titles.text().trim();
    if (!t) err(where, '<title> is empty');
    if (t.length > 70) warn(where, `<title> is ${t.length} chars (over 70)`);
  }
  const descs = $('head meta[name="description"]');
  if (descs.length !== 1) err(where, `expected one meta description, found ${descs.length}`);
  else {
    const d = String(descs.attr('content') ?? '').trim();
    if (!d) err(where, 'meta description is empty');
    else if (d.length < 70 || d.length > 170) warn(where, `meta description is ${d.length} chars (aim 70-160)`);
  }

  const canonicals = $('head link[rel="canonical"]');
  const robots = String($('head meta[name="robots"]').attr('content') ?? '');
  if (page.noindex) {
    if (canonicals.length) err(where, 'noindex page has a canonical');
    if (!/noindex/.test(robots)) err(where, 'noindex page lacks a robots noindex tag');
  } else {
    if (canonicals.length !== 1) err(where, `expected one canonical, found ${canonicals.length}`);
    else if (canonicals.attr('href') !== `${origin}${page.path}`) {
      err(where, `canonical is ${canonicals.attr('href')}, expected ${origin}${page.path}`);
    }
    if (/noindex/.test(robots)) err(where, 'indexable page carries noindex');
    if (!$('head meta[property="og:url"]').length) err(where, 'missing og:url');
  }

  for (const sel of ['meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:card"]']) {
    if ($(`head ${sel}`).length !== 1) err(where, `expected one ${sel}, found ${$(`head ${sel}`).length}`);
  }
  const og = String($('head meta[property="og:image"]').attr('content') ?? '');
  if (!og) err(where, 'missing og:image');
  else if (!og.startsWith(`${origin}/`)) err(where, `og:image is not absolute on ${origin}: ${og}`);
  else {
    const imgFile = path.join(CLIENT, og.slice(origin.length));
    if (!fs.existsSync(imgFile)) err(where, `og:image file missing: ${og}`);
    else if (imgFile.endsWith('.png')) {
      const size = pngSize(imgFile);
      if (!size) err(where, `og:image is not a valid PNG: ${og}`);
      else if (size.width !== 1200 || size.height !== 630) {
        err(where, `og:image is ${size.width}x${size.height}, expected 1200x630`);
      }
    }
  }

  // Links
  $('a[href]').each((_, el) => {
    const href = String($(el).attr('href') ?? '').trim();
    if (!href || href === '#') return err(where, `empty or "#" link: "${$(el).text().trim().slice(0, 40)}"`);
    if (/^(mailto:|tel:|sms:)/.test(href)) return;
    let url: URL;
    try {
      url = new URL(href, `${origin}${page.path}`);
    } catch {
      return err(where, `unparseable href ${href}`);
    }
    if (url.origin !== origin) return;
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/chat/') || url.pathname.startsWith('/api/')) {
      return warn(where, `links to a server-only path ${url.pathname}`);
    }
    const target = fileForPath(url.pathname);
    if (!target) return err(where, `broken internal link ${href}`);
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      const doc = target === file ? $ : cheerio.load(fs.readFileSync(target, 'utf8'));
      if (!doc(`[id="${id.replace(/"/g, '\\"')}"]`).length) err(where, `anchor target #${id} not found in ${url.pathname}`);
    }
  });

  // Images
  $('img').each((_, el) => {
    const src = String($(el).attr('src') ?? '');
    const alt = $(el).attr('alt');
    if (!$(el).attr('width') || !$(el).attr('height')) err(where, `<img src="${src}"> lacks width/height`);
    if (alt == null) err(where, `<img src="${src}"> lacks alt`);
    if (src.startsWith('/') && !fs.existsSync(path.join(CLIENT, src))) err(where, `image file missing: ${src}`);
  });

  $('head link[rel="preload"][href]').each((_, el) => {
    const href = String($(el).attr('href'));
    if (href.startsWith('/') && !fs.existsSync(path.join(CLIENT, href))) err(where, `preloaded file missing: ${href}`);
  });

  // Structured data
  const types = new Set<string>();
  let faqCount = -1;
  $('script[type="application/ld+json"]').each((_, el) => {
    let data: unknown;
    try {
      data = JSON.parse($(el).html() ?? '');
    } catch (e) {
      return err(where, `JSON-LD does not parse: ${(e as Error).message}`);
    }
    collectTypes(data, types);
    const obj = data as Record<string, unknown>;
    if (obj && obj['@type'] === 'FAQPage') {
      faqCount = Array.isArray(obj.mainEntity) ? obj.mainEntity.length : 0;
    }
    if (obj && (obj['@type'] === 'BlogPosting' || obj['@type'] === 'Article')) {
      const published = $('head meta[property="article:published_time"]').attr('content');
      if (obj.datePublished !== published) {
        err(where, `Article.datePublished (${obj.datePublished}) != article:published_time (${published})`);
      }
    }
  });
  for (const alternatives of EXPECTED_TYPES[page.view] ?? []) {
    if (!alternatives.some((t) => types.has(t))) err(where, `missing JSON-LD type ${alternatives.join(' or ')}`);
  }
  const visibleFaq = $('[data-faq-q]').length;
  if ($('[data-faq]').length && faqCount !== visibleFaq) {
    err(where, `visible FAQ has ${visibleFaq} questions but FAQPage has ${faqCount}`);
  }
  if (!$('[data-faq]').length && faqCount >= 0) err(where, 'FAQPage data without a visible FAQ');
}

function main() {
  const manifestFile = path.join(OUT, 'prerender-manifest.json');
  if (!fs.existsSync(manifestFile)) {
    console.error(`[verify-seo] ${manifestFile} not found; run the prerender first`);
    process.exit(1);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8')) as Manifest;
  const { origin } = manifest;

  for (const page of manifest.pages) checkPage(page, origin);

  // Pages on disk that no route produced (stale output from an older build).
  const known = new Set(manifest.pages.map((p) => p.file));
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html') {
        const rel = path.relative(CLIENT, full).replace(/\\/g, '/');
        if (!known.has(rel)) err(rel, 'HTML page not produced by this build');
      }
    }
  };
  walk(CLIENT);

  // sitemap.xml
  const sitemapFile = path.join(CLIENT, 'sitemap.xml');
  if (!fs.existsSync(sitemapFile)) err('sitemap.xml', 'missing');
  else {
    const $s = cheerio.load(fs.readFileSync(sitemapFile, 'utf8'), { xml: true });
    const locs = new Set<string>();
    $s('url').each((_, el) => {
      const loc = $s(el).find('loc').text().trim();
      locs.add(loc);
      const lastmod = $s(el).find('lastmod').text().trim();
      if (lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) err('sitemap.xml', `${loc}: bad lastmod ${lastmod}`);
      if (!fileForPath(loc.replace(origin, '') || '/')) err('sitemap.xml', `${loc} has no built page`);
    });
    const expected = new Set(manifest.pages.filter((p) => p.inSitemap).map((p) => `${origin}${p.path}`));
    for (const e of expected) if (!locs.has(e)) err('sitemap.xml', `missing ${e}`);
    for (const l of locs) if (!expected.has(l)) err('sitemap.xml', `unexpected ${l}`);
  }

  // RSS
  const feedFile = path.join(CLIENT, 'blog', 'feed.xml');
  if (!fs.existsSync(feedFile)) err('blog/feed.xml', 'missing');
  else {
    const $f = cheerio.load(fs.readFileSync(feedFile, 'utf8'), { xml: true });
    const items = $f('item');
    if (items.length !== manifest.postCount) err('blog/feed.xml', `${items.length} items, expected ${manifest.postCount}`);
    items.each((_, el) => {
      const link = $f(el).find('link').text().trim();
      if (!fileForPath(link.replace(origin, ''))) err('blog/feed.xml', `${link} has no built page`);
    });
  }

  // llms.txt
  const llms = path.join(CLIENT, 'llms.txt');
  if (!fs.existsSync(llms)) err('llms.txt', 'missing');
  else {
    const text = fs.readFileSync(llms, 'utf8');
    for (const m of text.matchAll(/https:\/\/heliumsol\.com(\/[^\s)>"]*)?/g)) {
      const p = m[1] || '/';
      if (!fileForPath(p)) err('llms.txt', `${m[0]} has no built page`);
    }
  }

  // Shells
  for (const shell of ['app-shell.html', '404.html']) {
    const f = path.join(CLIENT, shell);
    if (!fs.existsSync(f)) {
      err(shell, 'missing');
      continue;
    }
    const $x = cheerio.load(fs.readFileSync(f, 'utf8'));
    if (!/noindex/.test(String($x('meta[name="robots"]').attr('content') ?? ''))) err(shell, 'lacks noindex');
  }

  // Server bundle hygiene
  const meta = path.join(OUT, 'server-meta.json');
  if (fs.existsSync(meta)) {
    const inputs = Object.keys((JSON.parse(fs.readFileSync(meta, 'utf8')) as { inputs: object }).inputs).map((p) =>
      p.replace(/\\/g, '/'),
    );
    for (const bad of ['src/routes.ts', 'src/content/blog', 'src/content/post-bodies', 'content/blog/']) {
      const hit = inputs.find((i) => i.includes(bad));
      if (hit) err('server bundle', `pulls in ${hit}; shared constants belong in src/site.ts`);
    }
  } else {
    warn('server bundle', 'server-meta.json not found (build:server runs after this step in npm run build)');
  }

  for (const w of warnings) console.warn(`  warn  ${w}`);
  for (const e of errors) console.error(`  ERROR ${e}`);
  console.log(
    `[verify-seo] ${manifest.pages.length} pages checked: ${errors.length} error(s), ${warnings.length} warning(s)`,
  );
  if (errors.length) process.exit(1);
}

main();
