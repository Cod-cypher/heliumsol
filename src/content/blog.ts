/**
 * The blog, assembled from content/blog/*.md at build time.
 *
 * Each markdown file becomes a Post here (via scripts/vite-plugin-md.ts),
 * which gives it a route in src/routes.ts, a prerendered page, a line in
 * sitemap.xml, an item in the RSS feed, a card on /blog and on its category
 * page, and a place in other posts' "related" lists. Adding a post is adding
 * a file.
 *
 * Only metadata is loaded eagerly. Post bodies are separate chunks; see
 * post-bodies.ts.
 */

import type { PostModule, PostFrontmatter } from './blog-types';
import { AUTHORS, type Author } from './authors';
import { CATEGORY_DEFS } from './categories';
import type { OgImage } from '../site';

export interface Post extends PostModule, Omit<PostFrontmatter, 'image'> {
  path: string;
  authorRef: Author;
  categoryName: string;
  ogImage?: OgImage;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  posts: Post[];
}

const modules = import.meta.glob<PostModule>('/content/blog/*.md', { eager: true, import: 'default' });

const RESERVED_SLUGS = new Set(['category', 'feed.xml', 'page']);
const categoryBySlug = new Map(CATEGORY_DEFS.map((c) => [c.slug, c]));

function toPost(mod: PostModule): Post {
  const fm = mod.frontmatter;
  const author = AUTHORS[fm.author];
  if (!author) throw new Error(`content/blog/${mod.slug}.md: unknown author "${fm.author}"`);
  const category = categoryBySlug.get(fm.category);
  if (!category) throw new Error(`content/blog/${mod.slug}.md: unknown category "${fm.category}"`);
  if (RESERVED_SLUGS.has(mod.slug)) throw new Error(`content/blog/${mod.slug}.md: reserved slug`);
  const { image: _imagePath, ...rest } = fm;
  return {
    ...mod,
    ...rest,
    path: `/blog/${mod.slug}`,
    authorRef: author,
    categoryName: category.name,
    ogImage: mod.ogImage ? { ...mod.ogImage, alt: mod.image?.alt ?? fm.title } : undefined,
  };
}

const all = Object.values(modules).map(toPost);

// Drafts show in `npm run dev` and vanish from every production build.
export const POSTS: Post[] = all
  .filter((p) => !p.draft || !import.meta.env.PROD)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));

export const POST_BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]));

/** Categories that have at least one post, in the order defined in categories.ts. */
export const CATEGORIES: Category[] = CATEGORY_DEFS.map((c) => ({
  ...c,
  posts: POSTS.filter((p) => p.category === c.slug),
})).filter((c) => c.posts.length > 0);

export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function blogLastmod(posts: Post[]): string | undefined {
  let max: string | undefined;
  for (const p of posts) {
    const d = p.updated ?? p.date;
    if (!max || d > max) max = d;
  }
  return max;
}

/**
 * Same category scores highest, then shared tags, then the same keyword.
 * Newer posts win ties. Never returns the post itself.
 */
export function relatedPosts(post: Post, n = 3): Post[] {
  const tags = new Set(post.tags);
  return POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 3;
      for (const t of p.tags) if (tags.has(t)) score += 1;
      if (p.keyword === post.keyword) score += 2;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map((x) => x.p);
}
