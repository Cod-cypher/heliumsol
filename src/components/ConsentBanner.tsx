/**
 * Analytics consent, as the privacy policy promises: the GA4 tag loads with
 * Consent Mode defaults of "denied" (set inline in <head> by the prerender),
 * and only an explicit "Accept" here upgrades analytics_storage to granted.
 *
 * Renders nothing during SSR and nothing when GA4 is not configured, so the
 * prerendered HTML is identical with or without a measurement id.
 */

import { useEffect, useState } from 'react';

const KEY = 'hs_consent';

declare global {
  interface Window {
    __GA4__?: string;
  }
}

function remember(value: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Private mode: the choice lasts for this page only.
  }
}

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window.__GA4__) return;
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      // fall through and ask
    }
    setShow(true);
  }, []);

  if (!show) return null;

  const decide = (value: 'granted' | 'denied') => {
    remember(value);
    window.gtag?.('consent', 'update', { analytics_storage: value });
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics cookies"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-xl sm:inset-x-auto sm:left-6"
    >
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        HeliumSol uses Google Analytics to understand which pages are useful. It is off until you allow it. Details are
        in the{' '}
        <a href="/privacy-policy" className="font-semibold underline underline-offset-2">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => decide('granted')}
          className="rounded-lg bg-navy-800 dark:bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-900 dark:hover:bg-navy-500"
        >
          Allow analytics
        </button>
        <button
          type="button"
          onClick={() => decide('denied')}
          className="rounded-lg border border-slate-200 dark:border-white/15 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
