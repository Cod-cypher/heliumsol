/**
 * Shapes shared by the markdown build plugin (scripts/vite-plugin-md.ts) and
 * the blog content module. Plain types only: this file is imported by both
 * the Vite config and the app.
 */

export interface PostFrontmatter {
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM-DD */
  updated?: string;
  /** Slug of a category in src/content/categories.ts */
  category: string;
  tags: string[];
  /** The one keyword the post targets. */
  keyword: string;
  /** Key in src/content/authors.ts */
  author: string;
  /** Root-relative hero image, e.g. /images/blog/slug.webp */
  image?: string;
  imageAlt?: string;
  /** Overrides "<title> | HeliumSol". */
  seoTitle?: string;
  /** Excluded from production builds. */
  draft?: boolean;
}

export interface PostHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface PostImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** A .avif sibling exists. */
  avif: boolean;
}

/** Default export of `content/blog/<slug>.md`. The body is in `<slug>.md?body`. */
export interface PostModule {
  slug: string;
  frontmatter: PostFrontmatter;
  headings: PostHeading[];
  wordCount: number;
  readingMinutes: number;
  /** First paragraph, plain text, for cards and the RSS description. */
  excerpt: string;
  image?: PostImage;
  /** public/images/og/<slug>.png, if present. */
  ogImage?: { url: string; width: number; height: number };
}
