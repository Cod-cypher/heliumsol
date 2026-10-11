/**
 * SSR entry, used only at build time by scripts/prerender.ts.
 *
 * Renders the same App the browser hydrates, with the route's path passed in
 * because there is no window here.
 */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import './index.css';
import { primePostBodies } from './content/post-bodies';
import { POST_BODIES } from './content/post-bodies.server';

// Every article body is available synchronously to the render below.
primePostBodies(POST_BODIES);

// Re-exported so the prerenderer gets the route list, the posts (for the RSS
// feed) and the site constants from the same bundle it gets `render` from.
export { ROUTES, NOT_FOUND_ROUTE } from './routes';
export { POSTS, CATEGORIES } from './content/blog';
export { POST_BODIES };
export { SITE_ORIGIN, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, DEFAULT_OG_IMAGE } from './site';

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
