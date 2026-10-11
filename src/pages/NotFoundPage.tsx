/**
 * The not-found view. Pre-rendered to 404.html, which the server sends with a
 * real 404 status for any path that is not a route. Links to the main
 * services so a dead link still leads somewhere useful.
 */

import type { MouseEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { navigate } from "../routes";
import { SERVICES } from "../content/services";
import { SIGNUP_PATH } from "../site";

export default function NotFoundPage() {
  const go = (path: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <main className="relative pt-40 pb-32 px-4 md:px-8">
      <div className="mx-auto max-w-xl text-center">
        <span className="font-mono text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500">404</span>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-500 dark:text-slate-400">
          That page does not exist. It may have moved, or the link may be mistyped.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            onClick={go("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to homepage
          </a>
          <a
            href="/contact"
            onClick={go("/contact")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
          >
            Contact us
          </a>
        </div>

        {SERVICES.length > 0 && (
          <nav aria-labelledby="nf-services" className="mt-14 text-left">
            <h2 id="nf-services" className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Looking for one of these?
            </h2>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/services/${s.slug}`}
                    className="block rounded-lg border border-slate-200 dark:border-white/10 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-navy-200 dark:hover:border-white/20 transition-colors"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={SIGNUP_PATH}
                  className="block rounded-lg border border-navy-200 dark:border-navy-700 bg-navy-50/60 dark:bg-navy-900/30 px-4 py-3 text-sm font-semibold text-navy-800 dark:text-navy-200 hover:border-navy-300 transition-colors"
                >
                  Free website + chatbot offer
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="block rounded-lg border border-slate-200 dark:border-white/10 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-navy-200 dark:hover:border-white/20 transition-colors"
                >
                  The HeliumSol blog
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </main>
  );
}
