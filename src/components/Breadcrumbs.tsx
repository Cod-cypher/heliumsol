/**
 * Visible breadcrumb trail plus BreadcrumbList structured data, from one list.
 * The last item is the current page and is not a link.
 */

import JsonLd from './JsonLd';
import { breadcrumbList, type Crumb } from '../lib/jsonld';

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-medium text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-slate-700 dark:text-slate-200">
                  {item.name}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="-my-3 inline-flex min-h-11 items-center py-3 hover:text-navy-700 dark:hover:text-white transition-colors"
                >
                  {item.name}
                </a>
              )}
              {!last && (
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbList(items)} />
    </nav>
  );
}
