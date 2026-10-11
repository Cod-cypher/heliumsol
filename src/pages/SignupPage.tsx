/**
 * The free offer signup page.
 *
 * Lines marked [CONFIRM] in OFFER_TERMS are the business terms the owner has
 * not yet stated; they ship as written so the page is complete, and must be
 * edited here before the offer is promoted.
 */

import { CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import SignupForm from '../components/SignupForm';
import Faq from '../components/Faq';
import JsonLd from '../components/JsonLd';
import { webPage } from '../lib/jsonld';
import { CONTACT } from '../constants';
import { SIGNUP_PATH } from '../site';
import { ROUTES } from '../routes';
import type { FaqItem } from '../content/types';

const INCLUDED = [
  'One website, designed and built by HeliumSol, with the pages your business needs and the content you provide.',
  'One knowledge-base chatbot on that website, trained on your own pages and documents, that answers questions and captures enquiries.',
  'API usage for the chatbot included for the first month after launch.',
  'A person at HeliumSol reviews every signup and replies within one business day.',
];

const OFFER_TERMS = [
  'Eligibility: one free website and chatbot per business. [CONFIRM: any limits, such as business type, region or number of pages.]',
  'After the first month: chatbot API usage is billed at cost, with the rate confirmed in writing before the month ends. [CONFIRM: exact pricing and whether hosting is included.]',
  'What you own: the website and its content are yours. [CONFIRM: hosting and domain arrangements.]',
  'No obligation: you can say no at any point before launch, and nothing is charged for the build.',
];

const OFFER_FAQ: FaqItem[] = [
  {
    q: 'Is the website really free?',
    a: 'Yes. HeliumSol designs and builds the website at no charge as part of this offer. The only cost that can arise is the chatbot’s API usage after the first month, which is billed at cost and confirmed with you in writing before that month ends.',
  },
  {
    q: 'What is a knowledge-base chatbot?',
    a: 'An AI assistant that answers only from material you give it: your website pages, service descriptions, price lists, FAQs and documents. It does not make things up from the open internet, and it hands the conversation to a person when it cannot help or when the visitor asks.',
  },
  {
    q: 'What happens after I submit the form?',
    a: 'A person reads your answers, checks the offer fits what you described, and replies within one business day with next steps or with an honest note if it is not a fit. The build starts once you confirm the scope.',
  },
  {
    q: 'What do I need to provide?',
    a: 'Plain-language information about your business, any logo, photos and written content you already have, and the sources the chatbot should answer from. The form above collects all of that. Nothing in it asks for passwords.',
  },
  {
    q: 'Can I keep my current website and only add the chatbot?',
    a: 'Yes. Choose "I have a website I want to keep" in section 3 and describe where the chatbot should run. The team will confirm it can be embedded on your platform.',
  },
  {
    q: 'What does the API usage cost after the first month?',
    a: 'It depends on how many conversations the chatbot handles and which model it runs on. HeliumSol does not publish a flat price; the rate for your chatbot is confirmed in writing before the included month ends, so there is no surprise bill.',
  },
];

export default function SignupPage() {
  const route = ROUTES.find((r) => r.path === SIGNUP_PATH)!;
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-28 h-80 grid-lines bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <div className="relative">
            <Breadcrumbs
              items={[
                { name: 'Home', href: '/' },
                { name: 'Free website and chatbot', href: SIGNUP_PATH },
              ]}
            />
            <span className="mt-8 block text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
              Free offer
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              A free website plus a knowledge-base chatbot, with API usage included for 1 month
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              HeliumSol builds your business a website and an AI chatbot that answers from your own content, at no
              charge, and covers the chatbot's API usage for the first month. Fill in the form, and a person reads it
              and replies within one business day.
            </p>

            <h2 className="mt-10 font-display text-lg font-bold text-slate-900 dark:text-white">What is included</h2>
            <ul className="mt-4 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-navy-600 dark:text-navy-300" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-lg font-bold text-slate-900 dark:text-white">The terms, in plain words</h2>
            <ul className="mt-4 space-y-3">
              {OFFER_TERMS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600 dark:bg-navy-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
              Not sure how to answer something? Ask us:{' '}
              <a href={`mailto:${CONTACT.email}`} className="font-medium text-navy-700 dark:text-navy-300 underline underline-offset-2">
                {CONTACT.email}
              </a>{' '}
              or{' '}
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="font-medium text-navy-700 dark:text-navy-300 underline underline-offset-2">
                {CONTACT.phone}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SignupForm />
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <Faq items={OFFER_FAQ} heading="Questions about the offer" />
      </div>

      <JsonLd data={webPage({ path: SIGNUP_PATH, name: route.title, description: route.description })} />
    </main>
  );
}
