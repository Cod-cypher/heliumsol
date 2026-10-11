/**
 * Renders a post's HTML. At build time the body comes from the primed
 * registry; on hydration it is read back from the prerendered DOM; on
 * client-side navigation it is fetched as its own chunk. Mount with
 * key={slug} so a navigation between posts remounts it.
 */

import { useEffect, useState } from 'react';
import { getPostBodySync, loadPostBody } from '../../content/post-bodies';

export default function PostBody({ slug }: { slug: string }) {
  const [html, setHtml] = useState<string | null>(() => getPostBodySync(slug));

  useEffect(() => {
    if (html != null) return;
    let cancelled = false;
    loadPostBody(slug).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, html]);

  if (html == null) {
    return <div className="prose-post min-h-[40vh]" aria-busy="true" />;
  }
  return <div className="prose-post" data-post-body={slug} dangerouslySetInnerHTML={{ __html: html }} />;
}
