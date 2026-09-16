/**
 * SSR entry, used only at build time by scripts/prerender.tsx.
 *
 * Renders the same App the browser hydrates, with the route's path passed in
 * because there is no window here.
 */

import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import './index.css';

// Re-exported so the prerenderer gets the route list from the same bundle it
// gets `render` from.
export { ROUTES, NOT_FOUND_ROUTE, SITE_ORIGIN, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from './routes';

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App initialPath={path} />
    </StrictMode>,
  );
}
