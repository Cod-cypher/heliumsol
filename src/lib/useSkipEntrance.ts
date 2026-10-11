/**
 * Whether a page should start fully visible instead of fading in.
 *
 * True during the build-time prerender (there is no document), so the static
 * HTML scripts/prerender.ts writes never ships its headline at opacity 0 —
 * which, to anything that does not run JavaScript, is invisible text, and to
 * Lighthouse is an LCP element that only appears once the fade completes.
 * True again for the first client render over that prerendered HTML, where
 * replaying the entrance would blank text the reader is already looking at.
 * Cleared after the first mount so in-app navigation still animates.
 *
 * Usage: `initial={skip ? false : { opacity: 0, y: 20 }}` on a motion element.
 * With `initial={false}` motion renders the element at its animate/whileInView
 * target values straight away.
 */

import { useEffect, useState } from 'react';

let firstPaint =
  typeof document === 'undefined' ||
  document.getElementById('root')?.dataset.prerendered === 'true';

export function useSkipEntrance(): boolean {
  const [skip] = useState(() => firstPaint);
  useEffect(() => {
    firstPaint = false;
  }, []);
  return skip;
}
