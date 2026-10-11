/**
 * /founding-partner-program: why the website and chatbot are free, who it is
 * for, what is asked in return, selection, costs and ownership.
 */

import PageHeader from '../components/PageHeader';
import Blocks from '../components/Blocks';
import Faq from '../components/Faq';
import RelatedLinks from '../components/RelatedLinks';
import OfferCta from '../components/OfferCta';
import JsonLd from '../components/JsonLd';
import { webPage } from '../lib/jsonld';
import { PROGRAM_PATH, PROGRAM_NAME, PROGRAM_ANSWER, PROGRAM_BLOCKS, PROGRAM_FAQ, PROGRAM_RELATED } from '../content/program';
import { ROUTES } from '../routes';

export default function ProgramPage() {
  const route = ROUTES.find((r) => r.path === PROGRAM_PATH)!;
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          crumbs={[
            { name: 'Home', href: '/' },
            { name: PROGRAM_NAME, href: PROGRAM_PATH },
          ]}
          eyebrow="Why is it free?"
          title="The Founding Partner Program"
          answer={PROGRAM_ANSWER}
        />

        <div className="mt-14">
          <Blocks blocks={PROGRAM_BLOCKS} />
        </div>

        <Faq items={PROGRAM_FAQ} heading="Questions about the program" />
        <RelatedLinks items={PROGRAM_RELATED} />
        <OfferCta
          source="program"
          heading="Apply for a founding partner place"
          text="One short form, read by a person, with a reply within one business day. No upfront development fees for the agreed scope, and every ongoing cost explained before work begins."
        />
        <JsonLd data={webPage({ path: PROGRAM_PATH, name: route.title, description: route.description })} />
      </div>
    </main>
  );
}
