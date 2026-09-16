/**
 * Shared layout for the privacy policy, terms of service, and SMS program page.
 *
 * Both documents are the same shape — badge, title, intro, then a card of
 * numbered sections — so they share one component and differ only in the
 * LegalDoc passed in. Adding a third legal page should mean adding an entry to
 * src/content/legal.tsx and a route, not another copy of this file.
 */

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { navigate, LEGAL_UPDATED } from "../routes";
import { BOOKING_URL } from "../constants";
import type { LegalDoc } from "../content/legal";

/*
  Whether the page should start fully visible rather than fade in.

  True during the build-time prerender (no document), so the static HTML that
  scripts/prerender.tsx writes does not ship the whole policy at opacity 0 —
  which, to anything that does not run JS, is a page of invisible text. True
  again for the first client render over that prerendered HTML, where replaying
  the entrance would blank text the reader is already looking at. Cleared after
  the first mount so in-app navigation still animates.
*/
let startsVisible =
  typeof document === "undefined" ||
  document.getElementById("root")?.dataset.prerendered === "true";

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const Icon = doc.icon;
  const [skipIntro] = useState(() => startsVisible);

  useEffect(() => {
    startsVisible = false;
  }, []);

  const goHome = (e: MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    /*
      pt-28 clears the fixed Navbar, which sits outside this component and
      would otherwise overlap the back link on load.
    */
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      {/* Decorative grid, fading out before the content card so it never
          competes with body copy. Same treatment as the marketing sections. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 grid-lines bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <motion.div
        initial={skipIntro ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-3xl"
      >
        <a
          href="/"
          onClick={goHome}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to homepage
        </a>

        {/* Title block */}
        <header className="mt-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3 py-1 shadow-soft">
            <Icon className="h-3.5 w-3.5 text-navy-700 dark:text-navy-300" />
            <span className="font-mono text-[10px] font-semibold tracking-wide text-slate-600 dark:text-slate-300">
              {doc.badge}
            </span>
          </span>

          <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {doc.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400">
            {doc.intro}
          </p>
        </header>

        {/* Body card */}
        <div className="mt-12 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-ink-900/60 p-7 md:p-11 shadow-card">
          <div className="flex flex-col gap-9">
            {doc.sections.map((section, i) => (
              <section
                key={section.heading}
                id={section.id}
                /* Rule between sections rather than under each one, so the last
                   section does not end with a stray line above the footer.
                   scroll-mt keeps an #anchor jump clear of the fixed Navbar. */
                className={`scroll-mt-28 ${
                  i === 0 ? "" : "border-t border-slate-200/70 dark:border-white/10 pt-9"
                }`}
              >
                <h2 className="font-display text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  {section.heading}
                </h2>
                {/* A div, not a p: some bodies contain paragraphs and lists. */}
                <div className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          {/* Footer row */}
          <div className="mt-11 pt-7 border-t border-slate-200/70 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Last updated: {LEGAL_UPDATED}
            </span>
            <a
              href={BOOKING_URL}
              className="group inline-flex items-center gap-1.5 rounded-lg bg-navy-800 dark:bg-navy-600 px-4 py-2.5 text-xs font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all"
            >
              Contact us
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/*
          Cross-link between the two documents. People who come looking for one
          usually want to glance at the other, and this saves a trip through the
          footer.
        */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              navigate("/privacy-policy");
            }}
            className="hover:text-navy-700 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            onClick={(e) => {
              e.preventDefault();
              navigate("/terms-of-service");
            }}
            className="hover:text-navy-700 dark:hover:text-white transition-colors"
          >
            Terms of Service
          </a>
        </nav>
      </motion.div>
    </main>
  );
}
