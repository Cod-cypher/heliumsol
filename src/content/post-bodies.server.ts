/**
 * Every post body, eagerly, for the build-time prerender and the RSS feed.
 * Imported ONLY by src/entry-server.tsx; importing it from client code would
 * put every article into the main bundle.
 */

const bodies = import.meta.glob<string>('/content/blog/*.md', { query: '?body', import: 'default', eager: true });

export const POST_BODIES: Record<string, string> = Object.fromEntries(
  Object.entries(bodies).map(([file, html]) => [file.replace(/^.*\//, '').replace(/\.md$/, ''), html]),
);
