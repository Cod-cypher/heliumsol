/**
 * The top of every content page: breadcrumbs, eyebrow, the one H1, and the
 * direct answer paragraph that AI search tools and skimming readers get first.
 * Plain markup, no motion: the text must be in the static HTML.
 */

import type { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';
import type { Crumb } from '../lib/jsonld';

interface Props {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  /** The 2–3 sentence direct answer. */
  answer: string;
  children?: ReactNode;
}

export default function PageHeader({ crumbs, eyebrow, title, answer, children }: Props) {
  return (
    <header className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-28 h-80 grid-lines bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative">
        <Breadcrumbs items={crumbs} />
        <span className="mt-8 block text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
          {eyebrow}
        </span>
        <h1 className="mt-3 max-w-4xl font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-slate-600 dark:text-slate-300">{answer}</p>
        {children}
      </div>
    </header>
  );
}
