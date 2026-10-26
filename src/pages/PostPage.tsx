/**
 * /blog/<slug> — one article.
 *
 * The markdown body opens with the direct answer to the question the post
 * targets, so the first paragraph a reader or an AI search tool sees is the
 * answer, not a preamble.
 */

import Breadcrumbs from '../components/Breadcrumbs';
import Picture from '../components/Picture';
import PostBody from '../components/blog/PostBody';
import AuthorBox from '../components/blog/AuthorBox';
import RelatedPosts from '../components/blog/RelatedPosts';
import OfferCta from '../components/OfferCta';
import ProgramBanner from '../components/ProgramBanner';
import { PROGRAM_PATH } from '../content/program';
import JsonLd from '../components/JsonLd';
import { article } from '../lib/jsonld';
import { formatDate } from '../lib/dates';
import { POST_BY_SLUG, relatedPosts } from '../content/blog';
import { SERVICE_BY_SLUG } from '../content/services';
import NotFoundPage from './NotFoundPage';

/** Which service page a category's posts belong to, for the "related service" link. */
const SERVICE_FOR_CATEGORY: Record<string, string> = {
  'ai-chatbots-and-assistants': 'ai-chatbots',
  'web-and-mobile-development': 'full-stack-development',
  automation: 'workflow-automation',
};

export default function PostPage({ slug }: { slug: string }) {
  const post = POST_BY_SLUG.get(slug);
  if (!post) return <NotFoundPage />;
  const related = relatedPosts(post);
  const svc = SERVICE_BY_SLUG.get(SERVICE_FOR_CATEGORY[post.category] ?? '');

  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <article className="mx-auto max-w-3xl">
        <header className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-28 h-80 grid-lines bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <div className="relative">
            <Breadcrumbs
              items={[
                { name: 'Home', href: '/' },
                { name: 'Blog', href: '/blog' },
                { name: post.categoryName, href: `/blog/category/${post.category}` },
                { name: post.title, href: post.path },
              ]}
            />
            <h1 className="mt-8 font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              {post.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{post.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>
                By{' '}
                <a href={post.authorRef.url} className="font-semibold text-slate-700 dark:text-slate-200 hover:underline">
                  {post.authorRef.name}
                </a>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Published <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              {post.updated && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </div>
        </header>

        {post.image && (
          <figure className="mt-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
            <Picture
              src={post.image.src}
              width={post.image.width}
              height={post.image.height}
              alt={post.image.alt}
              avif={post.image.avif}
              priority
              className="w-full"
            />
          </figure>
        )}

        {post.headings.length > 2 && (
          <nav aria-labelledby="toc-heading" className="mt-10 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-ink-900/60 p-6">
            <h2 id="toc-heading" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              In this guide
            </h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {post.headings
                .filter((h) => h.depth === 2)
                .map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="flex min-h-11 items-center text-slate-700 dark:text-slate-200 hover:text-navy-700 dark:hover:text-navy-300"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
            </ol>
          </nav>
        )}

        {/* Early, so a reader learns they can apply before reaching the end. */}
        <ProgramBanner source={`post-${post.slug}`} className="mt-10" />

        <div className="mt-10">
          <PostBody slug={post.slug} />
        </div>

        {svc && (
          <p className="mt-10 rounded-xl border border-navy-100 dark:border-navy-800 bg-navy-50/70 dark:bg-navy-900/30 p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            Need this built rather than explained? See{' '}
            <a href={`/services/${svc.slug}`} className="font-semibold text-navy-700 dark:text-navy-300 underline underline-offset-2">
              {svc.name.toLowerCase()} by HeliumSol
            </a>
            , apply to the{' '}
            <a href={PROGRAM_PATH} className="font-semibold text-navy-700 dark:text-navy-300 underline underline-offset-2">
              Founding Partner Program
            </a>{' '}
            for a free build, or{' '}
            <a href="/contact" className="font-semibold text-navy-700 dark:text-navy-300 underline underline-offset-2">
              ask the team a question
            </a>
            .
          </p>
        )}

        <AuthorBox author={post.authorRef} />
      </article>

      <div className="mx-auto max-w-5xl">
        <RelatedPosts posts={related} />
      </div>

      <div className="mx-auto max-w-3xl">
        <OfferCta source={`post-${post.slug}`} />
      </div>

      <JsonLd
        data={article({
          path: post.path,
          headline: post.title,
          description: post.description,
          published: post.date,
          modified: post.updated,
          section: post.categoryName,
          tags: post.tags,
          wordCount: post.wordCount,
          image: post.image?.src,
          authorName: post.authorRef.name,
          authorUrl: post.authorRef.url,
        })}
      />
    </main>
  );
}
