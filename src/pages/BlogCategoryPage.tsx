/**
 * /blog/category/<slug> — the posts in one category.
 */

import PageHeader from '../components/PageHeader';
import PostCard from '../components/blog/PostCard';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import ProgramBanner from '../components/ProgramBanner';
import JsonLd from '../components/JsonLd';
import { collectionPage } from '../lib/jsonld';
import { CATEGORY_BY_SLUG, CATEGORIES } from '../content/blog';
import NotFoundPage from './NotFoundPage';

export default function BlogCategoryPage({ category }: { category: string }) {
  const cat = CATEGORY_BY_SLUG.get(category);
  if (!cat) return <NotFoundPage />;
  const path = `/blog/category/${cat.slug}`;

  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: cat.name, href: path },
          ]}
          eyebrow="Blog category"
          title={cat.name}
          answer={cat.description}
        />

        <ProgramBanner source={`blog-category-${cat.slug}`} className="mt-10" />

        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Guides in this category
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {cat.posts.map((p, i) => (
            <PostCard key={p.slug} post={p} priority={i < 2} />
          ))}
        </div>

        <RelatedLinks
          heading="Other categories"
          items={[
            ...CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => ({
              label: c.name,
              href: `/blog/category/${c.slug}`,
              note: `${c.posts.length} ${c.posts.length === 1 ? 'guide' : 'guides'}`,
            })),
            { label: 'All blog posts', href: '/blog' },
          ]}
        />
        <OfferCta source={`blog-category-${cat.slug}`} />
        <JsonLd data={collectionPage({ path, name: `${cat.name} | HeliumSol Blog`, description: cat.description })} />
      </div>
    </main>
  );
}
