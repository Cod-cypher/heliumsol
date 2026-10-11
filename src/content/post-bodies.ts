/**
 * Post bodies, kept out of the main bundle.
 *
 * Three sources, in order:
 *  1. A registry primed by src/entry-server.tsx at build time, so the
 *     prerender has every body synchronously.
 *  2. The prerendered DOM: on hydration the body is already on the page, so
 *     it is read straight back from [data-post-body] with no download.
 *  3. A lazy per-post chunk, for client-side navigation to another post.
 */

const loaders = import.meta.glob<string>('/content/blog/*.md', { query: '?body', import: 'default' });

const primed = new Map<string, string>();

export function primePostBodies(bodies: Record<string, string>) {
  for (const [slug, html] of Object.entries(bodies)) primed.set(slug, html);
}

export function getPostBodySync(slug: string): string | null {
  const hit = primed.get(slug);
  if (hit != null) return hit;
  if (typeof document !== 'undefined') {
    const el = document.querySelector<HTMLElement>(`[data-post-body="${slug}"]`);
    if (el) return el.innerHTML;
  }
  return null;
}

export async function loadPostBody(slug: string): Promise<string> {
  const load = loaders[`/content/blog/${slug}.md`];
  if (!load) throw new Error(`No post body for "${slug}"`);
  const html = await load();
  primed.set(slug, html);
  return html;
}
