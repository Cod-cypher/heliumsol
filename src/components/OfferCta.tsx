/**
 * The closing call to action every service page, landing page and blog post
 * ends with. Points at the free offer signup page, with the contact page as
 * the quieter alternative.
 */

import { ArrowRight } from 'lucide-react';
import { SIGNUP_PATH } from '../site';
import { BOOKING_URL } from '../constants';

interface Props {
  heading?: string;
  text?: string;
  /** Where the click came from, for the analytics id. */
  source: string;
}

export default function OfferCta({
  heading = 'Start with a free website and chatbot',
  text = 'HeliumSol will build and host your website, add a knowledge-base chatbot trained on your business, and set up email on your domain. Chatbot API usage and email are included for the first month. One short form, and a person reads it.',
  source,
}: Props) {
  return (
    <section
      aria-labelledby={`offer-cta-${source}`}
      className="mt-16 relative overflow-hidden rounded-2xl bg-navy-900 px-6 py-12 sm:px-12 sm:py-14 shadow-card"
    >
      <div
        aria-hidden="true"
        className="absolute top-[-40%] right-[-10%] h-[360px] w-[360px] rounded-full bg-navy-700/40 blur-[110px] pointer-events-none"
      />
      <div className="relative max-w-2xl">
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-300 font-display">Free offer</span>
        <h2
          id={`offer-cta-${source}`}
          className="mt-3 font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-[1.1]"
        >
          {heading}
        </h2>
        <p className="mt-4 text-base text-navy-100/75 leading-relaxed">{text}</p>
        <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            id={`offer-cta-${source}-signup`}
            href={SIGNUP_PATH}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 shadow-soft hover:bg-slate-100 transition-all duration-300"
          >
            Claim the free website and chatbot
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </a>
          <a
            href={BOOKING_URL}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy-700 px-6 py-3.5 text-sm font-semibold text-navy-100 hover:bg-navy-800 transition-all duration-300"
          >
            Or ask us a question first
          </a>
        </div>
      </div>
    </section>
  );
}
