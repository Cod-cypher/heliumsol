import type { Author } from '../../content/authors';

export default function AuthorBox({ author }: { author: Author }) {
  return (
    <aside
      aria-label="About the author"
      className="mt-14 flex gap-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-ink-900/60 p-6"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-800 dark:bg-navy-600 font-display text-lg font-bold text-white"
      >
        H
      </div>
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Written by</span>
        <p className="mt-1 font-display text-base font-bold text-slate-900 dark:text-white">
          <a href={author.url} className="hover:underline">
            {author.name}
          </a>
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{author.role}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{author.bio}</p>
      </div>
    </aside>
  );
}
