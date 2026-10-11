/**
 * /about — who HeliumSol is. Only facts the site already states: the legal
 * entity, remote and worldwide, the services, the process, the commitments.
 * No founding story, team names or numbers are invented here.
 */

import PageHeader from '../components/PageHeader';
import Process from '../components/Process';
import Commitments from '../components/Commitments';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import JsonLd from '../components/JsonLd';
import { webPage } from '../lib/jsonld';
import { CONTACT } from '../constants';
import { LEGAL_NAME } from '../site';
import { ROUTES } from '../routes';

export default function AboutPage() {
  const route = ROUTES.find((r) => r.path === '/about')!;
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
          ]}
          eyebrow="About"
          title="A remote digital agency that builds websites, apps and AI assistants"
          answer={`HeliumSol is a brand of ${LEGAL_NAME}. It is a full-service digital agency that designs and builds full-stack websites, web and mobile apps, AI chatbots and assistants, and n8n workflow automation for businesses worldwide. The team works remotely and every enquiry is read by a person.`}
        />

        <section aria-labelledby="who-heading" className="mt-14">
          <h2 id="who-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Who is HeliumSol?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            HeliumSol is the digital agency brand of {LEGAL_NAME}. It covers the full stack of building online:
            the design and front end a customer sees, the server, database and integrations behind it, the
            mobile app in a customer's pocket, the AI assistant that answers at 2 a.m., and the automations that
            connect the tools a business already uses.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Contact is by email at{' '}
            <a href={`mailto:${CONTACT.email}`} className="font-medium text-navy-700 dark:text-navy-300 underline underline-offset-2">
              {CONTACT.email}
            </a>
            , by phone at{' '}
            <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="font-medium text-navy-700 dark:text-navy-300 underline underline-offset-2">
              {CONTACT.phone}
            </a>
            , through the <a href="/contact" className="font-medium text-navy-700 dark:text-navy-300 underline underline-offset-2">contact form</a>, or
            through the AI assistant on this site, which hands the conversation to a person when asked.
          </p>
        </section>

        <section aria-labelledby="how-heading" className="mt-14">
          <h2 id="how-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How does HeliumSol approach a project?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Every project, whatever its size, follows the same four stages: discovery, design and build in short
            cycles, launch, then ongoing improvement. Pricing and timelines are given by a person after discovery,
            never guessed up front, and HeliumSol does not promise specific results such as leads, sales or revenue.
            If a website, app, chatbot or automation is not the right answer to a problem, the team says so.
          </p>
        </section>
      </div>

      {/* Shared homepage sections, reused so the process and commitments are stated once. */}
      <div className="mt-16 -mx-4 md:-mx-8">
        <Process />
        <Commitments />
      </div>

      <div className="mx-auto max-w-4xl">
        <RelatedLinks
          items={[
            { label: 'The Founding Partner Program', href: '/founding-partner-program', note: 'Why the first websites and chatbots are free.' },
            { label: 'See every service HeliumSol offers', href: '/services', note: 'Websites, apps, AI chatbots, assistants and automation.' },
            { label: 'Read the blog', href: '/blog', note: 'Practical guides with sources you can check.' },
            { label: 'Case studies', href: '/case-studies', note: 'Concept examples now; client work as it is published.' },
            { label: 'Contact the team', href: '/contact', note: 'A reply within one business day.' },
          ]}
        />
        <OfferCta source="about" />
        <JsonLd data={{ ...webPage({ path: '/about', name: route.title, description: route.description }), '@type': 'AboutPage' }} />
      </div>
    </main>
  );
}
