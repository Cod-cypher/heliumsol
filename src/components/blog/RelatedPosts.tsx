import PostCard from './PostCard';
import type { Post } from '../../content/blog';

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="related-posts-heading" className="mt-16">
      <h2 id="related-posts-heading" className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Related guides
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
