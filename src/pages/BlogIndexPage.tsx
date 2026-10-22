/**
 * /blog — every published post, newest first, with category links.
 */

import { Rss } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PostCard from '../components/blog/PostCard';
import OfferCta from '../components/OfferCta';
import ProgramBanner from '../components/ProgramBanner';
import JsonLd from '../components/JsonLd';
import { collectionPage } from '../lib/jsonld';
import { POSTS, CATEGORIES } from '../content/blog';
import { ROUTES } from '../routes';

export default function BlogIndexPage() {
  const route = ROUTES.find((r) => r.path === '/blog')!;
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
          ]}
          eyebrow="Blog"
          title="Practical guides on websites, apps, AI chatbots and automation"
          answer="Plain-language articles from the HeliumSol team on what AI chatbots and assistants cost and do, how to make a website fast, how to choose a mobile app approach, and what to automate with n8n. Every statistic links to its source; nothing is a client claim."
        >
          <nav aria-label="Blog categories" className="mt-8 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <a
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-navy-200 dark:hover:border-white/20 transition-colors"
              >
                {c.name} ({c.posts.length})
              </a>
            ))}
            <a
              href="/blog/feed.xml"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white"
            >
              <Rss className="h-3.5 w-3.5" aria-hidden="true" />
              RSS feed
            </a>
          </nav>
        </PageHeader>

        <ProgramBanner source="blog-index" className="mt-10" />

        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">All guides</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSTS.map((p, i) => (
            <PostCard key={p.slug} post={p} priority={i < 2} />
          ))}
        </div>

        <OfferCta source="blog-index" />
        <JsonLd data={collectionPage({ path: '/blog', name: route.title, description: route.description })} />
      </div>
    </main>
  );
}
