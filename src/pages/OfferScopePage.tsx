/**
 * /free-website-and-chatbot/<website|chatbot>: what the free offer delivers,
 * rendered from src/content/offer-scope.ts.
 */

import PageHeader from '../components/PageHeader';
import Blocks from '../components/Blocks';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import JsonLd from '../components/JsonLd';
import { webPage } from '../lib/jsonld';
import { OFFER_SCOPE_BY_SLUG } from '../content/offer-scope';
import { SIGNUP_PATH } from '../site';
import NotFoundPage from './NotFoundPage';

export default function OfferScopePage({ slug }: { slug: string }) {
  const page = OFFER_SCOPE_BY_SLUG.get(slug);
  if (!page) return <NotFoundPage />;
  const path = `${SIGNUP_PATH}/${page.slug}`;

  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Free website and chatbot', href: SIGNUP_PATH },
            { name: page.name, href: path },
          ]}
          eyebrow="Free offer: the scope"
          title={page.h1}
          answer={page.answer}
        />

        <div className="mt-14">
          <Blocks blocks={page.blocks} />
        </div>

        <RelatedLinks items={page.related} />
        <OfferCta
          source={`scope-${page.slug}`}
          heading="Ready to claim it?"
          text="One short form, read by a person, with a reply within one business day. Nothing is charged for the build, and you can say no at any point before launch."
        />
        <JsonLd data={webPage({ path, name: page.title, description: page.description })} />
      </div>
    </main>
  );
}
