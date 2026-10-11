/**
 * One service page (/services/<slug>), rendered from src/content/services.ts.
 * Plain markup: everything here must be in the prerendered HTML.
 */

import { CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Blocks from '../components/Blocks';
import Faq from '../components/Faq';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import JsonLd from '../components/JsonLd';
import { service } from '../lib/jsonld';
import { SERVICE_BY_SLUG } from '../content/services';
import NotFoundPage from './NotFoundPage';

export default function ServicePage({ slug }: { slug: string }) {
  const page = SERVICE_BY_SLUG.get(slug);
  if (!page) return <NotFoundPage />;
  const path = `/services/${page.slug}`;

  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Services', href: '/services' },
            { name: page.name, href: path },
          ]}
          eyebrow="Service"
          title={page.h1}
          answer={page.answer}
        />

        <section aria-labelledby="included-heading" className="mt-12">
          <h2 id="included-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            What is included
          </h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {page.deliverables.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 shadow-soft"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-navy-600 dark:text-navy-300" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16">
          <Blocks blocks={page.blocks} />
        </div>

        <Faq items={page.faq} heading={`${page.name}: questions buyers ask`} />
        <RelatedLinks items={page.related} />
        <OfferCta source={`service-${page.slug}`} />

        <JsonLd
          data={service({
            path,
            name: page.name,
            serviceType: page.serviceType,
            description: page.description,
            deliverables: page.deliverables,
          })}
        />
      </div>
    </main>
  );
}
