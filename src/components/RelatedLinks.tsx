/**
 * "Related pages" block with descriptive anchor text. Every content page
 * renders one so no new page is a dead end.
 */

import { ArrowRight } from 'lucide-react';
import type { LinkItem } from '../content/types';

export default function RelatedLinks({ items, heading = 'Related pages' }: { items: LinkItem[]; heading?: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <h2 id="related-heading" className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        {heading}
      </h2>
      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="group flex h-full flex-col rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-soft hover:border-navy-200 dark:hover:border-white/20 transition-colors"
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                {item.label}
                <ArrowRight
                  className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </span>
              {item.note && <span className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{item.note}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
