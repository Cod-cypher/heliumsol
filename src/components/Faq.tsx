/**
 * A visible FAQ and its FAQPage structured data from one array.
 *
 * Native <details> so the answers are in the HTML, open or not, for anything
 * that reads the page without JavaScript. The data-faq attributes are what
 * scripts/verify-seo.ts counts against the JSON-LD.
 */

import JsonLd from './JsonLd';
import { faqPage } from '../lib/jsonld';
import type { FaqItem } from '../content/types';

interface Props {
  items: FaqItem[];
  heading?: string;
  intro?: string;
  id?: string;
}

export default function Faq({ items, heading = 'Frequently asked questions', intro, id = 'faq' }: Props) {
  if (items.length === 0) return null;
  return (
    <section id={id} data-faq className="scroll-mt-28 mt-16">
      <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {heading}
      </h2>
      {intro && <p className="mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">{intro}</p>}
      <div className="mt-6 divide-y divide-slate-200/80 dark:divide-white/10 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-ink-900/60">
        {items.map((item, i) => (
          <details
            key={item.q}
            data-faq-q
            open={i === 0}
            className="group px-5 py-4 md:px-6"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-semibold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
              <h3 className="text-base font-semibold">{item.q}</h3>
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-slate-400 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqPage(items)} />
    </section>
  );
}
