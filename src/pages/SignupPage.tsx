/**
 * The free offer signup page.
 *
 * Full-width hero band with the offer, three "included" cards, a
 * what-happens-next strip, then the summary column beside the form. Plain
 * markup, no motion: all of it must be in the prerendered HTML.
 */

import { Globe, Bot, Mail, ShieldCheck, CheckCircle2, Clock, KeyRound, Server, ArrowRight } from 'lucide-react';
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
  {
    icon: Globe,
    title: 'A website, built for you',
    text: 'Coded by HeliumSol with the pages your business needs, fast on phones, and prerendered so search engines read every word. Hosted by us, free for the first month.',
  },
  {
    icon: Bot,
    title: 'A knowledge-base chatbot',
    text: 'Trained on your own pages and documents. It answers questions around the clock, captures enquiries, and hands off to you when asked. API usage is included for the first month.',
  },
  {
    icon: Mail,
    title: 'Email on your domain',
    text: 'Professional addresses like hello@yourbusiness.com, set up on your domain and free for the first month.',
  },
];

const TERMS = [
  { icon: Server, text: 'HeliumSol handles the hosting of the website and the chatbot. There is nothing for you to set up or maintain, and hosting is free for the first month.' },
  { icon: KeyRound, text: 'You buy and own your domain name. It stays registered in your name, and the website and its content are yours.' },
  { icon: Clock, text: 'After the first month, hosting, chatbot API usage and email are billed at cost. The rate for your setup is confirmed with you in writing before the month ends, so there is no surprise bill.' },
  { icon: ShieldCheck, text: 'No obligation. You can say no at any point before launch, and nothing is charged for the build.' },
];

const NEXT = [
  { step: 'Fill in the form', text: 'Five minutes. Tell us about the business, the website you need and what the chatbot should answer.' },
  { step: 'A person reads it', text: 'Within one business day you hear back with next steps, or with an honest note if the offer is not the right fit.' },
  { step: 'We build', text: 'You see working pages early, the chatbot is tested on your real questions, and you approve before anything goes live.' },
  { step: 'Launch', text: 'Website, chatbot and email live on your domain. We keep hosting it; you keep every enquiry it brings in.' },
];

const OFFER_FAQ: FaqItem[] = [
  {
    q: 'Is the website really free?',
    a: 'Yes. HeliumSol builds the website at no charge as part of this offer, and hosting is free for the first month. The only costs that can arise are hosting, the chatbot’s API usage and your email after the first month, all billed at cost and confirmed with you in writing before that month ends, and the domain name, which you buy and own.',
  },
  {
    q: 'What is a knowledge-base chatbot?',
    a: 'An AI assistant that answers only from material you give it: your website pages, service descriptions, price lists, FAQs and documents. It does not make things up from the open internet, and it hands the conversation to a person when it cannot help or when the visitor asks.',
  },
  {
    q: 'Who hosts the website, and who owns the domain?',
    a: 'HeliumSol hosts the website and the chatbot, so there is nothing for you to manage; hosting is free for the first month and then billed at cost. You buy the domain name and it is registered in your name, so it is yours regardless of who hosts the site. If you already have a domain, we use that.',
  },
  {
    q: 'How does the free email work?',
    a: 'We set up professional email addresses on your domain, such as hello@yourbusiness.com, and the first month is free. After that it is billed at cost, with the rate confirmed in writing before the month ends.',
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
    <main className="relative pt-24 pb-24">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid-lines bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_40%,transparent_100%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-20 h-[520px] w-[520px] rounded-full bg-navy-600/50 blur-[140px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-24 h-[520px] w-[520px] rounded-full bg-navy-700/60 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="[&_a]:text-navy-200 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_span[aria-hidden]]:text-navy-400">
            <Breadcrumbs
              items={[
                { name: 'Home', href: '/' },
                { name: 'Free website and chatbot', href: SIGNUP_PATH },
              ]}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-100 backdrop-blur-sm">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Free offer · Limited to one per business
              </span>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                A free website, a knowledge-base chatbot, and email on your domain
                <span className="block mt-2 text-navy-200 font-semibold">with everything hosted by us.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-navy-100/80">
                HeliumSol builds your business a website and an AI chatbot that answers from your own content, sets up
                professional email on your domain, and hosts all of it. Hosting, the chatbot's API usage and the
                email are included for the first month, then billed at cost. You buy and own the domain; we do the rest.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href="#signup-form"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-card hover:bg-slate-100 transition-all"
                >
                  Start the signup form
                </a>
                <span className="text-sm text-navy-200/80">Takes about five minutes. Never asks for a password.</span>
              </div>
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                <span className="text-navy-200/70">Not sure what "free" covers?</span>
                <a href={`${SIGNUP_PATH}/website`} className="inline-flex items-center gap-1.5 text-white underline decoration-navy-300/60 underline-offset-4 hover:decoration-white">
                  What the free website includes
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a href={`${SIGNUP_PATH}/chatbot`} className="inline-flex items-center gap-1.5 text-white underline decoration-navy-300/60 underline-offset-4 hover:decoration-white">
                  What the free chatbot includes
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </p>
            </div>

            <ul className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-3" aria-label="What is included">
              {[
                { k: '$0', v: 'for the build' },
                { k: '1 month', v: 'of hosting, chatbot API usage and email included' },
                { k: '<1 day', v: 'to hear back from a real person' },
              ].map((s) => (
                <li key={s.k} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                  <span className="block font-display text-2xl md:text-3xl font-bold text-white">{s.k}</span>
                  <span className="mt-1 block text-xs md:text-sm text-navy-100/75">{s.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section aria-labelledby="next-heading" className="mx-auto max-w-7xl px-4 md:px-8 mt-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <h2 id="next-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            What happens after you sign up
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Four steps, each one with a person on our side.</p>
        </div>
        <ol className="mt-6 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div aria-hidden="true" className="hidden lg:block absolute top-6 left-8 right-8 h-px bg-slate-200 dark:bg-white/10" />
          {NEXT.map((n, i) => (
            <li
              key={n.step}
              className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-soft"
            >
              <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 dark:bg-navy-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{n.step}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{n.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Summary + form */}
      <section aria-labelledby="form-heading" className="mx-auto max-w-7xl px-4 md:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="rounded-2xl border border-navy-100 dark:border-navy-800 bg-navy-50/70 dark:bg-navy-900/30 p-6">
            <h2 id="form-heading" className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              The terms, in plain words
            </h2>
            <ul className="mt-4 space-y-4">
              {TERMS.map((t) => (
                <li key={t.text} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <t.icon className="mt-0.5 h-4 w-4 shrink-0 text-navy-600 dark:text-navy-300" aria-hidden="true" />
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-soft">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Checklist before you start</h3>
            <ul className="mt-3 space-y-2">
              {[
                'Your business name and what you do, in plain words',
                'A logo, photos or written copy if you have them (not required)',
                'Links or documents the chatbot should answer from',
                'A phone number and email a person can reach you on',
              ].map((c) => (
                <li key={c} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
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
        </aside>

        <div className="lg:col-span-8">
          <SignupForm />
        </div>
      </section>

      {/* Included cards, after the form */}
      <section aria-labelledby="included-heading" className="relative mx-auto max-w-7xl px-4 md:px-8 mt-16">
        <h2 id="included-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          What you get
        </h2>
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {INCLUDED.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-card"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 dark:bg-navy-900/50 text-navy-700 dark:text-navy-200">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Faq items={OFFER_FAQ} heading="Questions about the offer" />
      </div>

      <JsonLd data={webPage({ path: SIGNUP_PATH, name: route.title, description: route.description })} />
    </main>
  );
}
