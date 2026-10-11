/**
 * "Why is this free?" section: the Founding Partner Program in brief, with
 * the full story on /founding-partner-program. Rendered at the end of the
 * offer page. Plain markup, no motion, so the text is in the prerendered HTML.
 */

import { ArrowRight, MessageSquareText, Handshake, FileText } from 'lucide-react';
import { SIGNUP_PATH } from '../site';
import { PROGRAM_PATH, PROGRAM_SUMMARY, PROGRAM_SHORT } from '../content/program';

const POINTS = [
  { icon: Handshake, title: 'A small number of founding clients', text: 'A professionally coded website, a knowledge-base chatbot and email on your domain, with no upfront development fees for the agreed scope.' },
  { icon: MessageSquareText, title: 'What we ask: honest feedback', text: 'A short conversation at launch and after a month. Showcasing the project is a separate request, made only if you are happy, and you can decline.' },
  { icon: FileText, title: 'Everything in writing first', text: 'Ongoing costs after the first month, usage limits, ownership and any optional paid services are explained before work begins.' },
];

export default function FoundingProgram({ applyHref = SIGNUP_PATH }: { applyHref?: string }) {
  return (
    <section
      id="founding-program"
      aria-labelledby="program-heading"
      className="relative bg-white dark:bg-ink-950 py-20 sm:py-24 px-4 md:px-8 border-t border-slate-200/70 dark:border-white/10"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
            {PROGRAM_SUMMARY.eyebrow}
          </span>
          <h2 id="program-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {PROGRAM_SUMMARY.heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{PROGRAM_SHORT}</p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              id="program-section-apply"
              href={applyHref}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all duration-300"
            >
              Apply for a founding place
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </a>
            <a href={PROGRAM_PATH} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
              How the program works
            </a>
          </div>
        </div>

        <ul className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-5">
          {POINTS.map((p) => (
            <li key={p.title} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 dark:bg-navy-900/50 text-navy-700 dark:text-navy-200">
                <p.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
