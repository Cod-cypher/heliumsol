/**
 * Google Analytics 4 events.
 *
 * The gtag loader is injected into <head> by scripts/prerender.ts when
 * GA4_MEASUREMENT_ID is set in .env, with Consent Mode defaults of denied
 * (see components/ConsentBanner.tsx). Without the tag every function here is
 * a no-op, so the site works identically with or without analytics.
 *
 * First-party tracking (lib/tracker.ts -> /api/track) runs regardless and is
 * the source of truth for the admin funnel; these events are the GA4 copies.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag(...args);
}

/** Send an SPA page view to GA4 on route changes (the tag sends the first one). */
export function trackPageView(pagePath: string) {
  gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Report a captured lead as a GA4 conversion event. */
export function trackLeadConversion(leadType: string, goal?: string, service?: string) {
  gtag('event', 'generate_lead', {
    lead_type: leadType,
    goal: goal || '',
    service: service || '',
  });
}

/** The free offer form was submitted. Mark `sign_up` as a conversion in GA4. */
export function trackSignupConversion(detail: { industry?: string; start?: string }) {
  gtag('event', 'sign_up', {
    method: 'free_website_and_chatbot',
    industry: detail.industry || '',
    start: detail.start || '',
  });
}

/** A click-to-call or email link. Mark these as conversions in GA4 too. */
export function trackContactClick(kind: 'phone' | 'email', target: string) {
  gtag('event', kind === 'phone' ? 'click_to_call' : 'click_to_email', {
    link_url: target,
    page_path: window.location.pathname,
  });
}

/** Extract the GA4 client id from the _ga cookie (format GA1.1.111111.222222). */
export function getGaClientId(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)_ga=([^;]+)/);
  if (!match) return '';
  const parts = match[1].split('.');
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : '';
}
