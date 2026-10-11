/**
 * schema.org builders. Pure functions returning plain objects; the JsonLd
 * component serialises them. Only facts the site states elsewhere go in here:
 * no ratings, no invented addresses, no prices.
 */

import { SITE_ORIGIN, SITE_NAME, LEGAL_NAME, CONTACT_EMAIL, CONTACT_PHONE, DEFAULT_OG_IMAGE } from '../site';
import type { FaqItem } from '../content/types';

export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export type JsonLdObject = Record<string, unknown>;

export function organization(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}${DEFAULT_OG_IMAGE.url}`,
    image: `${SITE_ORIGIN}${DEFAULT_OG_IMAGE.url}`,
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    description:
      'Full-service digital agency building websites, web and mobile apps, AI chatbots and assistants, and workflow automation.',
    areaServed: 'Worldwide',
    knowsAbout: [
      'Full-stack web development',
      'Mobile app development',
      'AI chatbots',
      'AI assistants',
      'Workflow automation',
      'n8n',
    ],
  };
}

export function webSite(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function breadcrumbList(items: Crumb[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.href}`,
    })),
  };
}

export function faqPage(items: FaqItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function service(opts: {
  path: string;
  name: string;
  serviceType: string;
  description: string;
  deliverables?: string[];
}): JsonLdObject {
  const data: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_ORIGIN}${opts.path}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: `${SITE_ORIGIN}${opts.path}`,
    provider: { '@id': ORG_ID },
    areaServed: 'Worldwide',
  };
  if (opts.deliverables?.length) {
    data.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${opts.name}: what is included`,
      itemListElement: opts.deliverables.map((d) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: d },
      })),
    };
  }
  return data;
}

export function article(opts: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified?: string;
  section: string;
  tags: string[];
  wordCount?: number;
  image?: string;
  authorName: string;
  authorUrl: string;
}): JsonLdObject {
  const url = `${SITE_ORIGIN}${opts.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: opts.published,
    dateModified: opts.modified ?? opts.published,
    articleSection: opts.section,
    keywords: opts.tags.join(', '),
    wordCount: opts.wordCount,
    image: `${SITE_ORIGIN}${opts.image ?? DEFAULT_OG_IMAGE.url}`,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: opts.authorName, url: `${SITE_ORIGIN}${opts.authorUrl}` },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function webPage(opts: { path: string; name: string; description: string }): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_ORIGIN}${opts.path}`,
    name: opts.name,
    description: opts.description,
    url: `${SITE_ORIGIN}${opts.path}`,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export function collectionPage(opts: { path: string; name: string; description: string }): JsonLdObject {
  return { ...webPage(opts), '@type': 'CollectionPage' };
}
