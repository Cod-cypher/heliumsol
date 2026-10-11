/**
 * The free offer signup form.
 *
 * Three short required sections (who you are, a bit about the business,
 * timing and confirmation) with a progress indicator, plus an optional
 * "add more detail now" block. Detailed requirements are gathered in the
 * follow-up conversation after a person has reviewed the signup, so the
 * form asks only what is needed to qualify and reply.
 *
 * Answers autosave to localStorage so a visitor can leave and finish later.
 * The draft is restored after mount (never during render, so the prerendered
 * HTML and the first client render match) and cleared on submit.
 *
 * Submits through src/lib/leads.ts to /api/leads like the contact form, with
 * type "free_offer_signup" and every answer folded into the comments field
 * (the Lead table's column list is closed).
 */

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Save } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { trackSignupConversion } from '../lib/analytics';
import { trackEvent } from '../lib/tracker';
import { CONTACT } from '../constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DRAFT_KEY = 'hs_signup_draft';

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

/** Everything the form remembers. Arrays rather than Sets so it serialises. */
interface Draft {
  businessName: string;
  website: string;
  contactName: string;
  phone: string;
  email: string;
  industry: string;
  whatYouDo: string;
  siteStatus: string;
  botTasks: string[];
  start: string;
  reach: string;
  customers: string;
  pages: string[];
  contentReady: string[];
  knowledge: string;
  notes: string;
  accurate: boolean;
}

const EMPTY: Draft = {
  businessName: '',
  website: '',
  contactName: '',
  phone: '',
  email: '',
  industry: '',
  whatYouDo: '',
  siteStatus: '',
  botTasks: [],
  start: '',
  reach: '',
  customers: '',
  pages: [],
  contentReady: [],
  knowledge: '',
  notes: '',
  accurate: false,
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return { ...EMPTY, ...parsed, accurate: false };
  } catch {
    return null;
  }
}

function Section({ n, title, intro, children }: { n: number; title: string; intro?: string; children: ReactNode }) {
  return (
    <fieldset id={`signup-section-${n}`} className="scroll-mt-28 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 md:p-8 shadow-soft">
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
  value: string[] | string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        const checked = typeof value === 'string' ? value === v : value.includes(v);
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
  const [d, setD] = useState<Draft>(EMPTY);
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const dirty = useRef(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    dirty.current = true;
    setD((prev) => ({ ...prev, [key]: value }));
  };

  // Restore a saved draft after mount only, so hydration matches the prerender.
  useEffect(() => {
    const draft = readDraft();
    if (draft && JSON.stringify({ ...draft, accurate: false }) !== JSON.stringify(EMPTY)) {
      setD(draft);
      setRestored(true);
    }
  }, []);

  // Autosave, debounced, after the visitor has typed something.
  useEffect(() => {
    if (!dirty.current || status === 'done') return;
    const t = setTimeout(() => {
      try {
        const { accurate: _a, ...rest } = d;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
        setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {
        // Private mode: nothing to save to.
      }
    }, 600);
    return () => clearTimeout(t);
  }, [d, status]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    dirty.current = false;
    setD(EMPTY);
    setRestored(false);
    setSavedAt(null);
  };

  // Progress: the three required sections.
  const s1 = Boolean(d.businessName.trim() && d.contactName.trim() && d.phone.trim() && EMAIL_RE.test(d.email.trim()));
  const s2 = Boolean(d.industry && d.whatYouDo.trim() && d.siteStatus && d.botTasks.length > 0);
  const s3 = Boolean(d.start && d.accurate);
  const done = [s1, s2, s3].filter(Boolean).length;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!s1) {
      setError('Section 1: business name, your name, a phone number and a valid email are required.');
      return;
    }
    if (!s2) {
      setError('Section 2: industry, what you do, your website situation and at least one chatbot task are required.');
      return;
    }
    if (!d.start) {
      setError('Section 3: please tell us when you would like to start.');
      return;
    }
    if (!d.accurate) {
      setError('Section 3: please confirm the details are accurate.');
      return;
    }
    setError('');
    setStatus('submitting');

    const list = (s: string[]) => (s.length ? s.join(', ') : 'none selected');
    const comments = [
      `Offer: free website + knowledge-base chatbot + email on their domain (chatbot API usage and email included for 1 month; HeliumSol hosts; client buys and owns the domain)`,
      `Source: ${typeof window !== 'undefined' ? window.location.pathname : ''}`,
      '',
      `Business: ${d.businessName.trim()}`,
      `Industry: ${d.industry}`,
      `What they do: ${d.whatYouDo.trim()}`,
      `Website today: ${SITE_STATUS.find((s) => s.value === d.siteStatus)?.label ?? d.siteStatus}`,
      `Chatbot should: ${list(d.botTasks)}`,
      `Start: ${d.start}`,
      `Preferred contact: ${d.reach || '-'}`,
      '',
      'Optional detail (full requirements gathered in follow-up):',
      `Customers: ${d.customers.trim() || '-'}`,
      `Pages wanted: ${list(d.pages)}`,
      `Content ready: ${list(d.contentReady)}`,
      `Knowledge sources: ${d.knowledge.trim() || '-'}`,
      `Notes: ${d.notes.trim() || '-'}`,
    ].join('\n');

    try {
      await submitLead({
        type: 'free_offer_signup',
        name: d.contactName.trim(),
        email: d.email.trim(),
        phone: d.phone.trim(),
        company: d.businessName.trim(),
        website: d.website.trim() || 'Not provided',
        goal: 'free_website_chatbot',
        service: d.siteStatus === 'keep' ? 'chatbot' : 'website_chatbot',
        budget: `Start: ${d.start}`,
        comments,
      });
      trackSignupConversion({ industry: d.industry, start: d.start });
      trackEvent('signup_submit', 'free_offer_signup', { industry: d.industry, siteStatus: d.siteStatus, start: d.start });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
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
          an honest note if the offer is not the right fit for what you described. We go through the detailed
          requirements together in that follow-up. Questions in the meantime go to{' '}
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
      {/* Progress + draft status */}
      <div className="sticky top-[4.5rem] md:top-20 z-20 rounded-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-ink-900/95 backdrop-blur px-4 py-3 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100" aria-live="polite">
            {done === 3 ? 'All three sections complete' : `${done} of 3 required sections complete`}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            {savedAt ? `Saved on this device at ${savedAt}` : 'Saves on this device as you type, so you can finish later'}
          </p>
        </div>
        <ol className="mt-2.5 grid grid-cols-3 gap-2" aria-label="Form progress">
          {[
            ['Business', s1],
            ['About', s2],
            ['Timing', s3],
          ].map(([name, ok], i) => (
            <li key={String(name)}>
              <a href={`#signup-section-${i + 1}`} className="block">
                <span className={`block h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                <span className="mt-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {i + 1}. {String(name)}
                  {ok ? ' ✓' : ''}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      {restored && (
        <p role="status" className="rounded-lg border border-navy-100 dark:border-navy-800 bg-navy-50/70 dark:bg-navy-900/30 px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
          Welcome back. We restored the answers you saved on this device.{' '}
          <button type="button" onClick={clearDraft} className="font-semibold underline underline-offset-2">
            Start over
          </button>
        </p>
      )}

      <Section n={1} title="Business information" intro="Who we are building for and how to reach you.">
        <div>
          <label htmlFor="su-business" className={label}>
            Business name <span aria-hidden="true">*</span>
          </label>
          <input id="su-business" name="businessName" required className={input} value={d.businessName} onChange={(e) => set('businessName', e.target.value)} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="su-website" className={label}>
            Current website <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input id="su-website" name="website" type="url" placeholder="https://" className={input} value={d.website} onChange={(e) => set('website', e.target.value)} autoComplete="url" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="su-name" className={label}>
              Your name <span aria-hidden="true">*</span>
            </label>
            <input id="su-name" name="name" required className={input} value={d.contactName} onChange={(e) => set('contactName', e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="su-phone" className={label}>
              Phone number <span aria-hidden="true">*</span>
            </label>
            <input id="su-phone" name="phone" type="tel" required className={input} value={d.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" />
          </div>
        </div>
        <div>
          <label htmlFor="su-email" className={label}>
            Email address <span aria-hidden="true">*</span>
          </label>
          <input id="su-email" name="email" type="email" required className={input} value={d.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
        </div>
      </Section>

      <Section n={2} title="A bit about the business" intro="Enough for us to see the fit. The detail comes in the follow-up conversation.">
        <div>
          <label htmlFor="su-industry" className={label}>
            Industry <span aria-hidden="true">*</span>
          </label>
          <select id="su-industry" name="industry" required className={input} value={d.industry} onChange={(e) => set('industry', e.target.value)}>
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
          <p className={hint}>A sentence or two in plain words is plenty.</p>
          <textarea id="su-whatyoudo" name="whatYouDo" required rows={3} maxLength={1000} className={input} value={d.whatYouDo} onChange={(e) => set('whatYouDo', e.target.value)} />
        </div>
        <div>
          <span className={label}>
            Do you have a website today? <span aria-hidden="true">*</span>
          </span>
          <Choices name="siteStatus" type="radio" options={SITE_STATUS} value={d.siteStatus} onChange={(v) => set('siteStatus', v)} />
        </div>
        <div>
          <span className={label}>
            What should the chatbot do? <span aria-hidden="true">*</span>
          </span>
          <Choices name="botTasks" type="checkbox" options={BOT_TASKS} value={d.botTasks} onChange={(v) => set('botTasks', toggle(d.botTasks, v))} />
        </div>
      </Section>

      <Section n={3} title="Timing and confirmation">
        <div>
          <span className={label}>
            When would you like to start? <span aria-hidden="true">*</span>
          </span>
          <Choices name="start" type="radio" options={START} value={d.start} onChange={(v) => set('start', v)} />
        </div>
        <div>
          <span className={label}>Best way to reach you</span>
          <Choices name="reach" type="radio" options={REACH} value={d.reach} onChange={(v) => set('reach', v)} />
        </div>

        <details className="group rounded-xl border border-dashed border-slate-300 dark:border-white/15 p-4 open:bg-slate-50/60 dark:open:bg-white/5">
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-200 [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="mr-2 inline-block transition-transform group-open:rotate-90">▸</span>
            Add more detail now <span className="font-normal text-slate-500 dark:text-slate-400">(optional, we will ask in the follow-up anyway)</span>
          </summary>
          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="su-customers" className={label}>Who are your customers?</label>
              <textarea id="su-customers" name="customers" rows={2} maxLength={500} className={input} value={d.customers} onChange={(e) => set('customers', e.target.value)} />
            </div>
            <div>
              <span className={label}>Pages you think you need</span>
              <Choices name="pages" type="checkbox" options={PAGES} value={d.pages} onChange={(v) => set('pages', toggle(d.pages, v))} />
            </div>
            <div>
              <span className={label}>What do you already have?</span>
              <Choices name="contentReady" type="checkbox" options={CONTENT_READY} value={d.contentReady} onChange={(v) => set('contentReady', toggle(d.contentReady, v))} />
            </div>
            <div>
              <label htmlFor="su-knowledge" className={label}>Where should the chatbot's answers come from?</label>
              <p className={hint}>Links to pages, documents, price lists or FAQs. Never paste passwords or account access here.</p>
              <textarea id="su-knowledge" name="knowledge" rows={3} maxLength={2000} className={input} value={d.knowledge} onChange={(e) => set('knowledge', e.target.value)} />
            </div>
            <div>
              <label htmlFor="su-notes" className={label}>Anything else?</label>
              <textarea id="su-notes" name="notes" rows={3} maxLength={2000} className={input} value={d.notes} onChange={(e) => set('notes', e.target.value)} />
            </div>
          </div>
        </details>

        <label className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" name="accurate" checked={d.accurate} onChange={(e) => set('accurate', e.target.checked)} className="mt-0.5 h-4 w-4 accent-navy-700" />
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
            That did not send. Your answers are still saved on this device. Please try again, or email{' '}
            <a href={`mailto:${CONTACT.email}`} className="underline">
              {CONTACT.email}
            </a>{' '}
            with the details.
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Not finished? Your answers stay saved on this device. Come back any time.
          </span>
        </div>
      </Section>
    </form>
  );
}
