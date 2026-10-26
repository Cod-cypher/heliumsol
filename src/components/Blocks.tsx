/**
 * Renders the body blocks of a service or landing page (see content/types.ts).
 * Inline links inside paragraph strings use the form [text](/path).
 */

import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Block } from '../content/types';

/** Turns "[label](/href)" spans into anchors; everything else is plain text. */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const external = /^https?:\/\//.test(m[2]);
    out.push(
      <a
        key={m.index}
        href={m[2]}
        className="font-medium text-navy-700 dark:text-navy-300 underline decoration-navy-300/60 underline-offset-2 hover:decoration-navy-600"
        {...(external ? { rel: 'noopener', target: '_blank' } : {})}
      >
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const h2 = 'font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white';
const p = 'mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400';

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-14">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'prose':
            return (
              <section key={i}>
                <h2 className={h2}>{block.heading}</h2>
                {block.paragraphs.map((text, j) => (
                  <p key={j} className={p}>
                    {inline(text)}
                  </p>
                ))}
              </section>
            );
          case 'bullets':
            return (
              <section key={i}>
                <h2 className={h2}>{block.heading}</h2>
                {block.intro && <p className={p}>{inline(block.intro)}</p>}
                <ul className="mt-5 space-y-3">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600 dark:bg-navy-300"
                      />
                      <span>{inline(item)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          case 'steps':
            return (
              <section key={i}>
                <h2 className={h2}>{block.heading}</h2>
                {block.intro && <p className={p}>{inline(block.intro)}</p>}
                <ol className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {block.steps.map((step, j) => (
                    <li
                      key={j}
                      className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-soft"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 dark:bg-navy-600 text-xs font-bold text-white">
                        {j + 1}
                      </span>
                      <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {inline(step.text)}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            );
          case 'table':
            return (
              <section key={i}>
                <h2 className={h2}>{block.heading}</h2>
                {block.intro && <p className={p}>{inline(block.intro)}</p>}
                <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <tr>
                        {block.columns.map((c) => (
                          <th key={c} scope="col" className="px-4 py-3 font-semibold">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 dark:divide-white/10">
                      {block.rows.map((row, r) => (
                        <tr key={r} className="align-top">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`px-4 py-3 ${c === 0 ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                              {inline(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          case 'callout':
            return (
              <section
                key={i}
                className="rounded-2xl border border-navy-100 dark:border-navy-800 bg-navy-50/70 dark:bg-navy-900/30 p-6 md:p-8"
              >
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {block.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">{inline(block.text)}</p>
                {block.link && (
                  <a
                    href={block.link.href}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-300 hover:underline"
                  >
                    {block.link.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </section>
            );
        }
      })}
    </div>
  );
}
