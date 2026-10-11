/**
 * /case-studies — a clearly marked placeholder until there is client work to
 * publish with permission. The concept examples are labelled as such.
 */

import PageHeader from '../components/PageHeader';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import JsonLd from '../components/JsonLd';
import { collectionPage } from '../lib/jsonld';
import { CONCEPT_PROJECTS } from '../content/projects';
import { ROUTES } from '../routes';

export default function CaseStudiesPage() {
  const route = ROUTES.find((r) => r.path === '/case-studies')!;
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Case studies', href: '/case-studies' },
          ]}
          eyebrow="Our work"
          title="Case studies"
          answer="HeliumSol publishes client case studies here with each client's permission, with what was built and what it changed. Until the first ones are cleared for publication, this page shows concept examples of the kinds of projects the agency takes on."
        />

        <div
          role="note"
          className="mt-10 rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-900/10 p-6"
        >
          <h2 className="font-display text-lg font-bold text-amber-900 dark:text-amber-200">Case studies coming soon</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/80">
            Client names, links and results appear here only with written permission, and only for results the
            client has confirmed. Nothing on this page is a client claim. If you would like to talk about a similar
            project, the <a href="/contact" className="font-semibold underline underline-offset-2">contact page</a> is
            the fastest route.
          </p>
        </div>

        <section aria-labelledby="concepts-heading" className="mt-14">
          <h2 id="concepts-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Concept examples
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Illustrations of typical builds, with the stack each would normally use. They are not client projects.
          </p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CONCEPT_PROJECTS.map((p) => (
              <li
                key={p.id}
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-soft"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{p.subtitle}</span>
                <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Typical stack">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded border border-slate-200 dark:border-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <RelatedLinks
          items={[
            { label: 'Full-stack website and web app development', href: '/services/full-stack-development' },
            { label: 'AI chatbot development', href: '/services/ai-chatbots' },
            { label: 'About HeliumSol', href: '/about', note: 'Who we are and how a project runs.' },
          ]}
        />
        <OfferCta source="case-studies" />
        <JsonLd data={collectionPage({ path: '/case-studies', name: route.title, description: route.description })} />
      </div>
    </main>
  );
}
