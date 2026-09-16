/**
 * Three-step enquiry form, rendered on /contact.
 *
 * Built from the optimizeindex towing assessment form: same steps, animation,
 * validation and accessibility behaviour, with the questions rewritten for
 * general HeliumSol enquiries (chatbots, AI, automation, websites, apps and
 * other tech work) and the styling brought into HeliumSol's navy design
 * system, including dark mode.
 *
 * Submission goes through submitLead() in src/lib/leads.ts, which adds
 * session-level UTM attribution and the analytics ids, POSTs to /api/leads
 * (Postgres + email) and fires the GA4 conversion.
 *
 * Nothing here promises leads, sales or revenue.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { submitLead } from '../lib/leads';
import { trackEvent } from '../lib/tracker';

/** Step 1 — what they want help with. Multi-select. */
const INTENTS = [
  'AI chatbot or assistant',
  'AI or workflow automation',
  'Website',
  'Web or mobile app',
  'Other tech project',
  'Not sure yet',
] as const;

/** Step 2 — rough timeline. A rough idea only, nothing is locked in. */
const TIMELINES = [
  'As soon as possible',
  'In the next 1–3 months',
  '3+ months out',
  'Just exploring',
] as const;

const TOTAL_STEPS = 3;

/** Shape only. The server and a bounced mail are the real validation. */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/* Shared class strings, in the same vocabulary as the rest of the site. */

const card =
  'rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 shadow-card';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-900';

const primaryButton = `group flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-5 py-3 text-sm font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 active:scale-[0.98] transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-wait disabled:active:scale-100 ${focusRing}`;

const secondaryButton = `inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer ${focusRing}`;

const stepHeading =
  'text-[15px] font-semibold text-slate-900 dark:text-white leading-snug rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-navy-500/40';

const hint = 'text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5';

const inputClass =
  'block w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3.5 py-2.5 text-base sm:text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none hover:border-slate-300 dark:hover:border-white/20 focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 transition-colors';

const labelClass = 'block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

const optionClass = (selected: boolean) =>
  `flex items-center gap-3 rounded-lg border px-3.5 py-3 text-sm cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-500/40 ${
    selected
      ? 'border-navy-600 dark:border-navy-400 bg-navy-50 dark:bg-navy-900/50 text-navy-900 dark:text-white font-semibold'
      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800/60 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5'
  }`;

// Square for the multi-select step, round for the single-choice step — the
// shape is the convention that tells someone how many they may pick.
const markerClass = (selected: boolean, multi = false) =>
  `inline-flex items-center justify-center w-4 h-4 shrink-0 border ${multi ? 'rounded' : 'rounded-full'} ${
    selected
      ? 'bg-navy-800 dark:bg-navy-500 border-navy-800 dark:border-navy-500 text-white'
      : 'border-slate-300 dark:border-white/25 bg-white dark:bg-transparent'
  }`;

/** Takes no props: every piece of copy is fixed inside it. */
export default function ContactLeadForm() {
  const [step, setStep] = useState(1);

  /** Multi-select: a project can span several of these. */
  const [intents, setIntents] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Move focus to the new step's heading, so a keyboard or screen-reader user
  // travels with the form instead of being left on a button that no longer
  // exists. Skipped on first paint, which includes the server pre-render.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const goTo = (next: number) => {
    setError('');
    setStep(next);
  };

  /** Clears the error the moment the visitor acts on it. */
  const onField =
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      setter(e.target.value);
    };

  const resetForm = () => {
    setIntents([]);
    setTimeline('');
    setName('');
    setEmail('');
    setPhone('');
    setError('');
    setIsSuccess(false);
    setStep(1);
  };

  const toggleIntent = (option: string) => {
    setError('');
    setIntents((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option],
    );
  };

  const handleContinue = () => {
    if (step === 1) {
      if (intents.length === 0) {
        setError('Pick at least one thing we can help with.');
        return;
      }
      trackEvent('form_step', 'general_enquiry', { step: '1' });
      goTo(2);
      return;
    }
    if (step === 2) {
      if (!timeline) {
        setError('Let us know roughly when you would like to start.');
        return;
      }
      trackEvent('form_step', 'general_enquiry', { step: '2' });
      goTo(3);
    }
  };

  /**
   * Maps the enquiry onto the payload /api/leads accepts. The endpoint keeps a
   * fixed key list, so the answers go into existing fields: type (source),
   * budget (timeline, self-labelled) and comments (the readable block that
   * lands in the notification email). website is not asked for, so it says so.
   */
  const buildLeadPayload = () => ({
    type: 'general_enquiry',
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    website: 'Not collected — contact enquiry',
    budget: `Timeline: ${timeline}`,
    comments: [
      `Source: ${typeof window !== 'undefined' ? window.location.pathname : '/contact'}`,
      `Interested in: ${intents.join(', ')}`,
      `Timeline: ${timeline}`,
      `Phone: ${phone.trim()}`,
    ].join('\n'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim()) {
      setError('Please add your name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('That email address does not look right.');
      return;
    }
    if (!phone.trim()) {
      setError('Please add a phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await submitLead(buildLeadPayload());
      setIsSuccess(true);
    } catch {
      setError('That did not send. Please try again, or call us on 202 810 7042.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`${card} p-6 md:p-8 text-center`} role="status">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy-50 dark:bg-navy-900/60 text-navy-700 dark:text-navy-200 mb-4">
          <Check className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Got it. We will take a look.
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
          We will review what you have sent and come back within one business day — including
          if the honest answer is that we are not the right fit.
        </p>
        <button type="button" onClick={resetForm} id="contact-form-restart" className={`${secondaryButton} mt-6`}>
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Start again from step 1</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`${card} p-5 md:p-7`}>
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
        Start a project
      </span>
      <h2 className="mt-2 font-display text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
        Tell us what you're building
      </h2>

      {/* Progress. aria-hidden because the live region below announces the same
          thing in a form a screen reader can actually use. */}
      <div className="flex items-center gap-2 mt-4" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            <span
              className={`inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-full text-xs font-semibold transition-colors ${
                n === step
                  ? 'bg-navy-800 dark:bg-navy-500 text-white shadow-soft'
                  : n < step
                    ? 'bg-navy-50 dark:bg-navy-900/60 text-navy-700 dark:text-navy-200'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'
              }`}
            >
              {n < step ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : n}
            </span>
            {n < 3 && (
              <span
                className={`h-0.5 flex-1 rounded-full transition-colors ${
                  n < step ? 'bg-navy-600 dark:bg-navy-400' : 'bg-slate-200 dark:bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Step {step} of {TOTAL_STEPS}
      </p>

      <form onSubmit={handleSubmit} className="mt-6" noValidate>
        {/* Keyed on step so the enter animation replays on every transition. */}
        <div key={step} className="step-anim">
          {step === 1 && (
            <fieldset>
              <legend className="sr-only">What can we help you with?</legend>
              <h3 ref={headingRef} tabIndex={-1} className={stepHeading}>
                What can we help you with?
              </h3>
              <p className={hint}>Select all that apply.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTENTS.map((option) => (
                  <label key={option} className={optionClass(intents.includes(option))}>
                    <input
                      type="checkbox"
                      name="contact-intent"
                      value={option}
                      checked={intents.includes(option)}
                      onChange={() => toggleIntent(option)}
                      className="sr-only"
                    />
                    <span className={markerClass(intents.includes(option), true)}>
                      {intents.includes(option) && (
                        <Check className="w-3 h-3" strokeWidth={3.5} aria-hidden="true" />
                      )}
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend className="sr-only">Roughly when are you looking to start?</legend>
              <h3 ref={headingRef} tabIndex={-1} className={stepHeading}>
                Roughly when are you looking to start?
              </h3>
              <p className={hint}>A rough idea is fine, nothing is locked in.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIMELINES.map((option) => (
                  <label key={option} className={optionClass(timeline === option)}>
                    <input
                      type="radio"
                      name="contact-timeline"
                      value={option}
                      checked={timeline === option}
                      onChange={() => {
                        setError('');
                        setTimeline(option);
                      }}
                      className="sr-only"
                    />
                    <span className={markerClass(timeline === option)}>
                      {timeline === option && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <div>
              <h3 ref={headingRef} tabIndex={-1} className={stepHeading}>
                Where should we get back to you?
              </h3>

              <div className="mt-4">
                <label htmlFor="cf-name" className={labelClass}>
                  Name
                </label>
                <input
                  id="cf-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={onField(setName)}
                  placeholder="Jordan Reyes"
                  className={inputClass}
                />
              </div>

              <div className="mt-3">
                <label htmlFor="cf-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={onField(setEmail)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>

              <div className="mt-3">
                <label htmlFor="cf-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="cf-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={onField(setPhone)}
                  placeholder="202 810 7042"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400 leading-relaxed">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2.5 mt-6">
          {step > 1 && (
            <button type="button" onClick={() => goTo(step - 1)} className={secondaryButton}>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back</span>
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleContinue}
              id={`contact-form-continue-${step}`}
              className={primaryButton}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" id="contact-form-submit" disabled={isSubmitting} className={primaryButton}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>Send My Enquiry</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </div>

        <p className="mt-4 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
          We will read your enquiry and tell you honestly whether we are the right fit for it.
        </p>
      </form>
    </div>
  );
}
