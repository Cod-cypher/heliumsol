/**
 * Shapes shared by the service, landing and signup page content modules.
 *
 * Pages are data, rendered by one component per page type. A page's visible
 * FAQ and its FAQPage JSON-LD come from the same `faq` array, and its
 * breadcrumbs from the same route, so none of them can drift apart.
 */

import type { OgImage } from '../site';

export interface FaqItem {
  q: string;
  a: string;
}

export interface LinkItem {
  label: string;
  href: string;
  /** One line under the label in "related pages" lists. */
  note?: string;
}

/**
 * Page body blocks. Each page picks its own mix, so two pages of the same
 * type can have genuinely different structures rather than swapped words.
 * Headings are written as questions where a reader would ask one.
 */
export type Block =
  | { type: 'prose'; heading: string; paragraphs: string[] }
  | { type: 'bullets'; heading: string; intro?: string; items: string[] }
  | { type: 'steps'; heading: string; intro?: string; steps: { title: string; text: string }[] }
  | { type: 'table'; heading: string; intro?: string; columns: string[]; rows: string[][] }
  | { type: 'callout'; heading: string; text: string; link?: LinkItem };

interface ContentPage {
  slug: string;
  /** <title> without the site suffix. */
  title: string;
  /** Meta description, 70–160 characters. */
  description: string;
  h1: string;
  /** The direct 2–3 sentence answer that opens the page. */
  answer: string;
  blocks: Block[];
  faq: FaqItem[];
  /** At least two related pages, with descriptive anchor text. */
  related: LinkItem[];
  /** YYYY-MM-DD, for sitemap lastmod. */
  updated: string;
  ogImage?: OgImage;
}

export interface ServicePage extends ContentPage {
  /** Short label for nav, footer and breadcrumbs. */
  name: string;
  /** schema.org Service.serviceType */
  serviceType: string;
  /** One-line summary for cards and the services index. */
  summary: string;
  /** What a client gets. Rendered as a list and used as Service.hasOfferCatalog names. */
  deliverables: string[];
}

export interface LandingPage extends ContentPage {
  /** Primary keyword the page targets. */
  keyword: string;
  /** Slug of the service page this landing page belongs under. */
  parentService: string;
  /** Short name for breadcrumbs and link lists. */
  name: string;
  /**
   * Which list the page appears in: the footer column and the section of the
   * services index. Defaults to 'use-case'.
   */
  group?: 'use-case' | 'industry';
  /** Small label above the H1. Defaults to "Use case" or "By industry". */
  eyebrow?: string;
}
