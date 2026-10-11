import { ArrowRight } from 'lucide-react';
import Picture from '../Picture';
import { formatDate } from '../../lib/dates';
import type { Post } from '../../content/blog';

export default function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 shadow-soft hover:border-navy-200 dark:hover:border-white/20 transition-colors">
      {post.image && (
        <a href={post.path} tabIndex={-1} aria-hidden="true" className="block">
          <Picture
            src={post.image.src}
            width={post.image.width}
            height={post.image.height}
            alt=""
            avif={post.image.avif}
            priority={priority}
            className="aspect-[16/9] w-full object-cover"
          />
        </a>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <a href={`/blog/category/${post.category}`} className="text-navy-700 dark:text-navy-300 hover:underline">
            {post.categoryName}
          </a>
          <span aria-hidden="true">·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          <a href={post.path} className="hover:text-navy-700 dark:hover:text-navy-300 transition-colors">
            {post.title}
          </a>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{post.description}</p>
        <a
          href={post.path}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-300"
        >
          Read the guide
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
