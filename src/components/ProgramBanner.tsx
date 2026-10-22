/**
 * A compact Founding Partner Program notice for informational pages: blog
 * posts, the blog index and categories, landing pages, About and Case
 * studies. It sits near the top so a reader learns early that they can apply,
 * while the full OfferCta still closes the page.
 *
 * An <aside> with no heading, so it does not add a level to the page outline.
 */

import { ArrowRight, Sparkles } from 'lucide-react';
import { SIGNUP_PATH } from '../site';
import { PROGRAM_PATH, PROGRAM_NAME } from '../content/program';

interface Props {
  /** Where the banner sits, for the analytics ids. */
  source: string;
  /** Replaces the default sentence when a page needs its own angle. */
  text?: string;
  className?: string;
}

const DEFAULT_TEXT =
  'A small number of businesses get a professionally built website and AI chatbot with no upfront development fee. Hosting, chatbot API usage and email are free for the first month. In return we ask for honest feedback.';

export default function ProgramBanner({ source, text = DEFAULT_TEXT, className = '' }: Props) {
  return (
    <aside
      aria-label={PROGRAM_NAME}
      className={`@container relative overflow-hidden rounded-2xl border border-navy-200/80 dark:border-navy-700/60 bg-linear-to-br from-navy-50 to-white dark:from-navy-900/50 dark:to-ink-900 p-5 sm:p-6 shadow-soft ${className}`}
    >
      {/* Sized by its own width, not the viewport: side by side only in wide
          columns such as landing pages, stacked in the narrower blog column. */}
      <div className="flex flex-col @3xl:flex-row @3xl:items-center gap-5">
        <div className="flex-1">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-navy-700 dark:text-navy-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {PROGRAM_NAME} · Limited places
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</p>
        </div>
        <div className="flex flex-col @md:flex-row gap-2 shrink-0">
          <a
            id={`program-banner-${source}-apply`}
            href={SIGNUP_PATH}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-colors"
          >
            Apply for a place
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </a>
          <a
            id={`program-banner-${source}-details`}
            href={PROGRAM_PATH}
            className="inline-flex items-center justify-center rounded-lg border border-navy-200 dark:border-white/15 px-4 py-2.5 text-sm font-semibold text-navy-800 dark:text-navy-100 hover:bg-white dark:hover:bg-white/5 transition-colors"
          >
            How the program works
          </a>
        </div>
      </div>
    </aside>
  );
}
