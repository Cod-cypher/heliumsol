/**
 * Renders schema.org JSON-LD inside the page body.
 *
 * Google reads JSON-LD anywhere in the document, and keeping it in the
 * component that owns the data (the FAQ, the article) means the markup and
 * the structured data can never disagree. Nothing here renders <title>,
 * <meta> or <link>: React 19 would hoist those into <head> and duplicate what
 * scripts/prerender.ts writes there.
 */

import type { JsonLdObject } from '../lib/jsonld';

export default function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  // A "</script>" inside a string would end the tag early; escaping "<" as
  // < keeps the JSON valid and inert.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
