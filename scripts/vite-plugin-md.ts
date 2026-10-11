/**
 * Build-time markdown for the blog.
 *
 * `import 'content/blog/x.md'` gives a PostModule (frontmatter, headings,
 * word count, excerpt, hero image dimensions); `import 'content/blog/x.md?body'`
 * gives the rendered HTML as a string. Both are produced here, at build time,
 * so `marked` never ships to the browser and scripts/prerender.ts never has to
 * parse markdown itself: it imports the SSR bundle, which already contains
 * the transformed modules.
 *
 * Validation is strict and fails the build with the file name: a post with a
 * missing field, an unknown category, an H1 in the body, or an image that
 * does not exist under public/ is a build error, not a broken page.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { Marked, type Tokens } from 'marked';
import { imageSize } from 'image-size';
import { parseFrontmatter } from './frontmatter';
import type { PostModule, PostHeading, PostFrontmatter } from '../src/content/blog-types';

const REQUIRED = ['title', 'description', 'date', 'category', 'tags', 'keyword', 'author'] as const;
const OPTIONAL = ['updated', 'image', 'imageAlt', 'seoTitle', 'draft'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface Compiled {
  meta: PostModule;
  html: string;
}

function publicFile(root: string, src: string): string {
  if (!src.startsWith('/')) throw new Error(`image paths must be root-relative (got "${src}")`);
  return path.join(root, 'public', src);
}

function dimensions(file: string): { width: number; height: number } {
  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) throw new Error(`could not read dimensions of ${file}`);
  return { width, height };
}

export function compileMarkdown(root: string, file: string, source: string): Compiled {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const slug = path.basename(file, '.md');
  if (!SLUG_RE.test(slug)) {
    throw new Error(`${rel}: file name must be a lowercase hyphenated slug`);
  }

  const { data, body } = parseFrontmatter(source, rel);

  for (const key of REQUIRED) {
    if (!(key in data)) throw new Error(`${rel}: frontmatter is missing "${key}"`);
  }
  for (const key of Object.keys(data)) {
    if (!(REQUIRED as readonly string[]).includes(key) && !(OPTIONAL as readonly string[]).includes(key)) {
      throw new Error(`${rel}: unknown frontmatter key "${key}"`);
    }
  }
  const fm = data as unknown as PostFrontmatter;
  if (!DATE_RE.test(fm.date)) throw new Error(`${rel}: date must be YYYY-MM-DD`);
  if (fm.updated && !DATE_RE.test(fm.updated)) throw new Error(`${rel}: updated must be YYYY-MM-DD`);
  if (!Array.isArray(fm.tags) || fm.tags.length === 0) throw new Error(`${rel}: tags must be a non-empty list`);
  if (fm.image && !fm.imageAlt) throw new Error(`${rel}: image needs imageAlt`);

  const headings: PostHeading[] = [];
  const ids = new Set<string>();
  const md = new Marked({ gfm: true });

  md.use({
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) {
          throw new Error(`${rel}: do not use a level-1 heading; the page renders the title as the only <h1>`);
        }
        if (depth > 3) throw new Error(`${rel}: headings deeper than ### are not supported`);
        let id = slugify(inner);
        let n = 2;
        while (ids.has(id)) id = `${slugify(inner)}-${n++}`;
        ids.add(id);
        headings.push({ depth: depth as 2 | 3, text: inner.replace(/<[^>]+>/g, ''), id });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const t = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
        const rel2 = external ? ' rel="noopener" target="_blank"' : '';
        return `<a href="${href}"${t}${rel2}>${text}</a>`;
      },
      image({ href, title, text }: Tokens.Image) {
        const { width, height } = dimensions(publicFile(root, href));
        const t = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
        return `<img src="${href}" width="${width}" height="${height}" alt="${text.replace(/"/g, '&quot;')}"${t} loading="lazy" decoding="async" />`;
      },
    },
  });

  const html = md.parse(body) as string;
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plain ? plain.split(' ').length : 0;
  const firstP = html.match(/<p>([\s\S]*?)<\/p>/);
  const excerpt = firstP ? firstP[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';

  let image: PostModule['image'];
  if (fm.image) {
    const file = publicFile(root, fm.image);
    if (!fs.existsSync(file)) throw new Error(`${rel}: image not found at public${fm.image}`);
    const { width, height } = dimensions(file);
    image = {
      src: fm.image,
      width,
      height,
      alt: fm.imageAlt!,
      avif: fs.existsSync(file.replace(/\.webp$/, '.avif')) && file.endsWith('.webp'),
    };
  }

  // Social scrapers want a PNG or JPEG at 1200x630; the WebP hero is not a
  // safe share image. A post gets its own only if public/images/og/<slug>.png
  // exists, otherwise the prerender uses the site default.
  let ogImage: PostModule['ogImage'];
  const ogFile = path.join(root, 'public', 'images', 'og', `${slug}.png`);
  if (fs.existsSync(ogFile)) {
    const { width, height } = dimensions(ogFile);
    ogImage = { url: `/images/og/${slug}.png`, width, height };
  }

  return {
    meta: {
      slug,
      frontmatter: fm,
      headings,
      wordCount,
      readingMinutes: Math.max(1, Math.round(wordCount / 220)),
      excerpt,
      image,
      ogImage,
    },
    html,
  };
}

export default function markdown(): Plugin {
  let root = process.cwd();
  const cache = new Map<string, { mtimeMs: number; out: Compiled }>();

  const compile = (file: string): Compiled => {
    const stat = fs.statSync(file);
    const hit = cache.get(file);
    if (hit && hit.mtimeMs === stat.mtimeMs) return hit.out;
    const out = compileMarkdown(root, file, fs.readFileSync(file, 'utf8'));
    cache.set(file, { mtimeMs: stat.mtimeMs, out });
    return out;
  };

  return {
    name: 'heliumsol:markdown',
    enforce: 'pre',
    configResolved(config) {
      root = config.root;
    },
    load(id) {
      const [file, query = ''] = id.replace(/\\/g, '/').split('?', 2);
      if (!file.endsWith('.md') || !file.includes('/content/blog/')) return null;
      const out = compile(file);
      const payload = /(^|&)body($|&)/.test(query) ? out.html : out.meta;
      return { code: `export default ${JSON.stringify(payload)};`, map: null, moduleSideEffects: false };
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.md') && file.replace(/\\/g, '/').includes('/content/blog/')) {
        cache.delete(file);
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}
