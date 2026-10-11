/**
 * Fixed-locale date formatting. toLocaleDateString() with the default locale
 * would render differently on the build machine and in the visitor's browser
 * and cause a hydration mismatch.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** '2026-10-12' -> 'October 12, 2026' */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
