/**
 * One landing page (/<slug>), rendered from src/content/landings.ts.
 * Sits under its parent service in the breadcrumb trail.
 */

import PageHeader from '../components/PageHeader';
import Blocks from '../components/Blocks';
import Faq from '../components/Faq';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import ProgramBanner from '../components/ProgramBanner';
import JsonLd from '../components/JsonLd';
import { service } from '../lib/jsonld';
import { LANDING_BY_SLUG } from '../content/landings';
import { SERVICE_BY_SLUG } from '../content/services';
import NotFoundPage from './NotFoundPage';

export default function LandingPage({ slug }: { slug: string }) {
  const page = LANDING_BY_SLUG.get(slug);
  if (!page) return <NotFoundPage />;
  const parent = SERVICE_BY_SLUG.get(page.parentService);
  const path = `/${page.slug}`;

  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Services', href: '/services' },
            ...(parent ? [{ name: parent.name, href: `/services/${parent.slug}` }] : []),
            { name: page.name, href: path },
          ]}
          eyebrow={page.eyebrow ?? (page.group === 'industry' ? 'By industry' : 'Use case')}
          title={page.h1}
          answer={page.answer}
        />

        <ProgramBanner source={`landing-${page.slug}`} className="mt-10" />

        <div className="mt-14">
          <Blocks blocks={page.blocks} />
        </div>

        <Faq items={page.faq} />
        <RelatedLinks items={page.related} />
        <OfferCta source={`landing-${page.slug}`} />

        <JsonLd
          data={service({
            path,
            name: page.name,
            serviceType: parent?.serviceType ?? 'AI chatbot development',
            description: page.description,
          })}
        />
      </div>
    </main>
  );
}
