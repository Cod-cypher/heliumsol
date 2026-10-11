/**
 * The free offer signup form: one page, six numbered sections, one submit.
 *
 * Modelled on a business setup form rather than a step wizard, so every
 * question is visible at once and the whole thing is in the prerendered HTML.
 * Submits through src/lib/leads.ts to /api/leads like the contact form, with
 * type "free_offer_signup" and every answer folded into the comments field
 * (the Lead table's column list is closed).
 */

import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { trackSignupConversion } from '../lib/analytics';
import { trackEvent } from '../lib/tracker';
import { CONTACT } from '../constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INDUSTRIES = [
  'Home services (plumbing, HVAC, electrical, towing, cleaning)',
  'Health, dental or wellness practice',
  'Legal, accounting or consulting',
  'Restaurant, café or hospitality',
  'Retail or e-commerce',
  'Real estate or property',
  'Education or training',
  'Software or technology',
  'Other',
];

const SITE_STATUS = [
  { value: 'none', label: 'No website yet' },
  { value: 'replace', label: 'I have a website that needs replacing' },
  { value: 'keep', label: 'I have a website I want to keep, and mainly want the chatbot' },
];

const PAGES = [
  'Home',
  'About',
  'Services or products',
  'Pricing',
  'Contact',
  'Booking or appointments',
  'Gallery or portfolio',
  'Reviews or testimonials',
  'Blog or news',
  'FAQ',
];

const CONTENT_READY = ['Logo', 'Photos', 'Written copy', 'Brand colours or fonts', 'A domain name', 'Social media profiles'];

const BOT_TASKS = [
  'Answer common questions',
  'Explain services and how pricing works',
  'Capture leads (name, phone, email)',
  'Help people book or request appointments',
  'Customer support after a sale',
  'Hand off to a person when asked',
];

const START = ['As soon as possible', 'In the next 1–3 months', 'Just exploring for now'];
const REACH = ['Email', 'Phone call', 'Text message'];

type Multi = Set<string>;

function toggle(set: Multi, value: string): Multi {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function Section({ n, title, intro, children }: { n: number; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 md:p-8 shadow-soft">
      <legend className="sr-only">{`${n}. ${title}`}</legend>
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 dark:bg-navy-600 text-sm font-bold text-white"
        >
          {n}
        </span>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
          {intro && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{intro}</p>}
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </fieldset>
  );
}

const label = 'block text-sm font-semibold text-slate-800 dark:text-slate-200';
const hint = 'mt-1 text-xs text-slate-500 dark:text-slate-400';
const input =
  'mt-2 block w-full rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-ink-950 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/30';
const choice =
  'flex items-start gap-3 rounded-lg border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-200 has-[:checked]:border-navy-600 has-[:checked]:bg-navy-50/60 dark:has-[:checked]:bg-navy-900/30 cursor-pointer';

function Choices({
  name,
  options,
  type,
  value,
  onChange,
}: {
  name: string;
  options: string[] | { value: string; label: string }[];
  type: 'checkbox' | 'radio';
  value: Multi | string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        const checked = typeof value === 'string' ? value === v : value.has(v);
        return (
          <label key={v} className={choice}>
            <input
              type={type}
              name={name}
              value={v}
              checked={checked}
              onChange={() => onChange(v)}
              className="mt-0.5 h-4 w-4 accent-navy-700"
            />
            <span>{l}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function SignupForm() {
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [whatYouDo, setWhatYouDo] = useState('');
  const [customers, setCustomers] = useState('');
  const [siteStatus, setSiteStatus] = useState('');
  const [pages, setPages] = useState<Multi>(new Set());
  const [contentReady, setContentReady] = useState<Multi>(new Set());
  const [botTasks, setBotTasks] = useState<Multi>(new Set());
  const [knowledge, setKnowledge] = useState('');
  const [start, setStart] = useState('');
  const [reach, setReach] = useState('');
  const [notes, setNotes] = useState('');
  const [accurate, setAccurate] = useState(false);

  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!businessName.trim() || !contactName.trim() || !phone.trim()) {
      setError('Business name, your name and a phone number are required.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!whatYouDo.trim() || !industry || !siteStatus || botTasks.size === 0 || !start) {
      setError('Please answer the required questions in sections 2 to 5.');
      return;
    }
    if (!accurate) {
      setError('Please confirm the details are accurate.');
      return;
    }
    setError('');
    setStatus('submitting');

    const list = (s: Multi) => (s.size ? [...s].join(', ') : 'none selected');
    const comments = [
      `Offer: free website + knowledge-base chatbot (API usage included for 1 month)`,
      `Source: ${typeof window !== 'undefined' ? window.location.pathname : ''}`,
      '',
      `Business: ${businessName.trim()}`,
      `Industry: ${industry}`,
      `What they do: ${whatYouDo.trim()}`,
      `Customers: ${customers.trim() || '-'}`,
      '',
      `Website today: ${SITE_STATUS.find((s) => s.value === siteStatus)?.label ?? siteStatus}`,
      `Pages wanted: ${list(pages)}`,
      `Content ready: ${list(contentReady)}`,
      '',
      `Chatbot should: ${list(botTasks)}`,
      `Knowledge sources: ${knowledge.trim() || '-'}`,
      '',
      `Start: ${start}`,
      `Preferred contact: ${reach || '-'}`,
      `Notes: ${notes.trim() || '-'}`,
    ].join('\n');

    try {
      await submitLead({
        type: 'free_offer_signup',
        name: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: businessName.trim(),
        website: website.trim() || 'Not provided',
        goal: 'free_website_chatbot',
        service: siteStatus === 'keep' ? 'chatbot' : 'website_chatbot',
        budget: `Start: ${start}`,
        comments,
      });
      trackSignupConversion({ industry, start });
      trackEvent('signup_submit', 'free_offer_signup', { industry, siteStatus, start });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-900/10 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">Got it. The team will be in touch.</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          A person at HeliumSol reads every signup and will reply within one business day with next steps, or with
          an honest note if the offer is not the right fit for what you described. Questions in the meantime go to{' '}
          <a href={`mailto:${CONTACT.email}`} className="font-semibold underline underline-offset-2">
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" id="signup-form">
      <Section n={1} title="Business information" intro="Who we are building for and how to reach you.">
        <div>
          <label htmlFor="su-business" className={label}>
            Business name <span aria-hidden="true">*</span>
          </label>
          <input id="su-business" name="businessName" required className={input} value={businessName} onChange={(e) => setBusinessName(e.target.value)} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="su-website" className={label}>
            Current website <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input id="su-website" name="website" type="url" placeholder="https://" className={input} value={website} onChange={(e) => setWebsite(e.target.value)} autoComplete="url" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="su-name" className={label}>
              Your name <span aria-hidden="true">*</span>
            </label>
            <input id="su-name" name="name" required className={input} value={contactName} onChange={(e) => setContactName(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="su-phone" className={label}>
              Phone number <span aria-hidden="true">*</span>
            </label>
            <input id="su-phone" name="phone" type="tel" required className={input} value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </div>
        </div>
        <div>
          <label htmlFor="su-email" className={label}>
            Email address <span aria-hidden="true">*</span>
          </label>
          <input id="su-email" name="email" type="email" required className={input} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
      </Section>

      <Section n={2} title="About the business" intro="The chatbot is trained on this, so plain words beat marketing copy.">
        <div>
          <label htmlFor="su-industry" className={label}>
            Industry <span aria-hidden="true">*</span>
          </label>
          <select id="su-industry" name="industry" required className={input} value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="">Choose one</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="su-whatyoudo" className={label}>
            What do you sell or do? <span aria-hidden="true">*</span>
          </label>
          <p className={hint}>Services, products, areas you serve, and anything you want customers to know first.</p>
          <textarea id="su-whatyoudo" name="whatYouDo" required rows={4} maxLength={1000} className={input} value={whatYouDo} onChange={(e) => setWhatYouDo(e.target.value)} />
        </div>
        <div>
          <label htmlFor="su-customers" className={label}>
            Who are your customers? <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea id="su-customers" name="customers" rows={2} maxLength={500} className={input} value={customers} onChange={(e) => setCustomers(e.target.value)} />
        </div>
      </Section>

      <Section n={3} title="The website" intro="What the free website needs to do.">
        <div>
          <span className={label}>
            Do you have a website today? <span aria-hidden="true">*</span>
          </span>
          <Choices name="siteStatus" type="radio" options={SITE_STATUS} value={siteStatus} onChange={setSiteStatus} />
        </div>
        <div>
          <span className={label}>Pages you need</span>
          <p className={hint}>Pick what applies. We will suggest the rest.</p>
          <Choices name="pages" type="checkbox" options={PAGES} value={pages} onChange={(v) => setPages(toggle(pages, v))} />
        </div>
        <div>
          <span className={label}>What do you already have?</span>
          <Choices name="contentReady" type="checkbox" options={CONTENT_READY} value={contentReady} onChange={(v) => setContentReady(toggle(contentReady, v))} />
        </div>
      </Section>

      <Section n={4} title="The chatbot" intro="A knowledge-base chatbot answers from your content; tell us what it should handle.">
        <div>
          <span className={label}>
            What should the chatbot do? <span aria-hidden="true">*</span>
          </span>
          <Choices name="botTasks" type="checkbox" options={BOT_TASKS} value={botTasks} onChange={(v) => setBotTasks(toggle(botTasks, v))} />
        </div>
        <div>
          <label htmlFor="su-knowledge" className={label}>
            Where should its answers come from? <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <p className={hint}>Links to pages, documents, price lists or FAQs. Do not paste passwords or account access here.</p>
          <textarea id="su-knowledge" name="knowledge" rows={3} maxLength={2000} className={input} value={knowledge} onChange={(e) => setKnowledge(e.target.value)} />
        </div>
      </Section>

      <Section n={5} title="Timing and contact">
        <div>
          <span className={label}>
            When would you like to start? <span aria-hidden="true">*</span>
          </span>
          <Choices name="start" type="radio" options={START} value={start} onChange={setStart} />
        </div>
        <div>
          <span className={label}>Best way to reach you</span>
          <Choices name="reach" type="radio" options={REACH} value={reach} onChange={setReach} />
        </div>
        <div>
          <label htmlFor="su-notes" className={label}>
            Anything else? <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea id="su-notes" name="notes" rows={3} maxLength={2000} className={input} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </Section>

      <Section n={6} title="Confirmation">
        <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" name="accurate" checked={accurate} onChange={(e) => setAccurate(e.target.checked)} className="mt-0.5 h-4 w-4 accent-navy-700" />
          <span>
            The details above are accurate and I am authorised to request this on behalf of the business.{' '}
            <span aria-hidden="true">*</span>
          </span>
        </label>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          This form never asks for a password. If we need access to a domain, hosting or a Google Business Profile,
          we will ask you to share it through that platform's own invitation or another secure method.
        </p>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <strong className="font-semibold text-slate-600 dark:text-slate-300">SMS Disclaimer:</strong> By providing
          your phone number and submitting this form, you consent to receive text messages from HeliumSol about
          message topics such as reminders, scheduling, promotions, etc. Message frequency may vary. Message and data
          rates may apply. Reply STOP to opt out and HELP for assistance, or call{' '}
          <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="underline">
            {CONTACT.phone}
          </a>
          . Our{' '}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms-of-service" className="underline">
            Terms of Service
          </a>{' '}
          are available here.
        </p>

        {error && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-900/20 dark:text-rose-200">
            That did not send. Please try again, or email{' '}
            <a href={`mailto:${CONTACT.email}`} className="underline">
              {CONTACT.email}
            </a>{' '}
            with the details.
          </p>
        )}

        <button
          id="signup-submit"
          type="submit"
          disabled={status === 'submitting'}
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-7 py-3.5 text-sm font-semibold text-white shadow-card hover:bg-navy-900 dark:hover:bg-navy-500 disabled:opacity-60 transition-all"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Request my free website and chatbot
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </>
          )}
        </button>
      </Section>
    </form>
  );
}
