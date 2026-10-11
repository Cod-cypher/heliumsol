/**
 * /services — the index of service pages.
 */

import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import OfferCta from '../components/OfferCta';
import JsonLd from '../components/JsonLd';
import { collectionPage } from '../lib/jsonld';
import { SERVICES } from '../content/services';
import { LANDINGS } from '../content/landings';
import { ROUTES } from '../routes';

export default function ServicesIndexPage() {
  const route = ROUTES.find((r) => r.path === '/services')!;
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Services', href: '/services' },
          ]}
          eyebrow="What we do"
          title="Services: websites, apps, AI chatbots and automation"
          answer="HeliumSol designs and builds full-stack websites and web apps, mobile apps, AI chatbots, AI assistant solutions and n8n workflow automation. Each service page below explains what is included, how a project runs and the questions buyers usually ask before starting."
        />

        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <a
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-soft hover:border-navy-200 dark:hover:border-white/20 transition-colors"
              >
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-300">
                  Read about {s.name.toLowerCase()}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {LANDINGS.length > 0 && (
          <section aria-labelledby="usecases-heading" className="mt-16">
            <h2 id="usecases-heading" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI chatbots and assistants by use case
            </h2>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LANDINGS.map((l) => (
                <li key={l.slug}>
                  <a
                    href={`/${l.slug}`}
                    className="block rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-soft hover:border-navy-200 dark:hover:border-white/20 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{l.name}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{l.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <OfferCta source="services-index" />
        <JsonLd data={collectionPage({ path: '/services', name: route.title, description: route.description })} />
      </div>
    </main>
  );
}
