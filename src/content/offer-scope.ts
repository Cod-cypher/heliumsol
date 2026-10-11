/**
 * What the free offer delivers, in detail: one page for the website, one for
 * the chatbot. Linked from the offer page so a business knows exactly what
 * "free website" and "free chatbot" mean before signing up.
 *
 * Written as HeliumSol's commitment ("we build"), adapted to each business
 * rather than a fixed template. No page counts or feature caps: the scope is
 * what a professional business site and a grounded chatbot need.
 */

import type { Block, LinkItem } from './types';
import { SIGNUP_PATH } from '../site';

export interface OfferScopePage {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  answer: string;
  blocks: Block[];
  related: LinkItem[];
  updated: string;
}

const UPDATED = '2026-10-12';

export const OFFER_SCOPE: OfferScopePage[] = [
  {
    slug: 'website',
    name: 'What the free website includes',
    title: 'What the Free Website Includes',
    description:
      'What HeliumSol builds in the free website: the pages, forms and calls to action, the speed, SEO and privacy standards, how it works with the chatbot, and what you own.',
    h1: 'What the free website includes',
    answer:
      'The free website is a professional, mobile-first business site coded by HeliumSol and hosted by us, with hosting free for the first month and then billed at cost: a home page, service or product pages, an about page, a contact page with a working enquiry form, a privacy policy, and any extra pages the business needs, such as FAQs, pricing, a portfolio or service areas. It is built to load fast, pass basic SEO and accessibility checks, and feed every enquiry to you. The content and structure are adapted to your business, not a template with the names swapped.',
    blocks: [
      {
        type: 'table',
        heading: 'Which pages do we build?',
        intro: 'These are the pages every business site gets. Others are added when the business calls for them.',
        columns: ['Page', 'What it does'],
        rows: [
          ['Home', 'A clear headline, who you are, your key services or products, why a customer should choose you, trust signals you can back up, and prominent calls to action.'],
          ['Services or products', 'One section or page per offering: what it is, who it is for, what is included, and how to take the next step.'],
          ['About', 'Your background, experience, team and credentials. Only facts you have verified; no invented history or numbers.'],
          ['Contact', 'Phone, email, hours where they apply, your service area, and an enquiry form that validates input and confirms submission.'],
          ['Privacy policy', 'How information from the forms and the chatbot is collected, used and handled, written to be read.'],
          ['Extra pages when appropriate', 'FAQs, pricing, portfolio or projects, testimonials you have permission to use, service areas, booking.'],
        ],
      },
      {
        type: 'bullets',
        heading: 'What does the website do?',
        items: [
          'Works on phones first, then tablets and desktops, with clear navigation and consistent branding.',
          'Puts the right call to action in front of visitors for your business: request a quote, book a consultation, make an enquiry, or buy.',
          'Contact and enquiry forms with validation, spam protection, a clear confirmation, and delivery to your inbox or CRM.',
          'Handles submitted information securely and never asks a visitor for more than the enquiry needs.',
          'Loads fast: optimised images in modern formats, self-hosted fonts, and no unused code, measured against Google’s Core Web Vitals.',
          'Accessible: proper headings, labels, contrast and keyboard navigation.',
          'Basic technical SEO built in: unique titles and descriptions, canonical URLs, content crawlable without JavaScript, an XML sitemap, robots.txt and structured data.',
          'Analytics and conversion tracking, switched on only with the visitor consent the law requires.',
        ],
      },
      {
        type: 'prose',
        heading: 'How is it adapted to my business?',
        paragraphs: [
          'The structure, copy and calls to action follow what your business actually does and who it serves. A towing company needs a tap-to-call button and a service area; a clinic needs booking and what-to-expect pages; a consultancy needs a qualifying enquiry. We write from the information you give us in the signup form and the follow-up conversation, in plain language, and we do not pad pages with filler or claims you cannot stand behind.',
          'The same standards apply to this site. The pages you are reading are prerendered, fast, and checked by an automated gate before every deploy; the free website is built the same way. [Core Web Vitals explained for business owners](/blog/core-web-vitals-for-business-owners) covers what those checks mean.',
        ],
      },
      {
        type: 'bullets',
        heading: 'How does the website work with the chatbot?',
        intro: 'The website and the chatbot are one experience, not two products bolted together.',
        items: [
          'The chatbot is available on every relevant page and uses the same company information and branding as the site.',
          'It can point visitors to the right page or action, and website forms and chatbot enquiries follow the same process to the same destination.',
          'Leads go where you configure them: inbox, CRM or sheet. Failed submissions are handled gracefully and duplicates are avoided.',
          'The privacy policy covers both, and customer information is protected the same way whichever route it arrives by.',
          'Business information is easy to update in one place, so a change to your hours or services reaches the site and the chatbot together.',
        ],
      },
      {
        type: 'table',
        heading: 'What do you own, and what does it cost after the first month?',
        columns: ['Item', 'Who owns or pays'],
        rows: [
          ['The website and its content', 'Yours. The code, pages and copy belong to your business.'],
          ['The domain name', 'Yours. You buy it and it is registered in your name; we use it.'],
          ['Hosting of the website and chatbot', 'HeliumSol handles it; nothing for you to set up or maintain. Free for the first month, then billed at cost like the chatbot API usage and email, confirmed in writing before the month ends.'],
          ['Chatbot API usage', 'Included for the first month, then billed at cost, confirmed in writing before the month ends.'],
          ['Email on your domain', 'Included for the first month, then billed at cost, confirmed in writing before the month ends.'],
          ['Third-party services you choose (CRM, booking tool, payments)', 'Paid directly by you; we document which ones are in use.'],
        ],
      },
      {
        type: 'bullets',
        heading: 'When is the website ready to hand over?',
        intro: 'We treat the site as done when all of the following hold, and we show you each one.',
        items: [
          'Every agreed page renders correctly on mobile and desktop.',
          'Navigation, forms, links and calls to action work as intended.',
          'Enquiry submissions reach their destination and confirm what actually happened.',
          'Errors, failed submissions and unavailable services are handled gracefully, with an alternative offered.',
          'Basic technical SEO and accessibility checks pass.',
          'Privacy, security and data handling are addressed, including the consent banner for analytics.',
          'You know how to update content, and ownership, support arrangements, usage limits and recurring costs are written down.',
        ],
      },
      {
        type: 'callout',
        heading: 'Beyond the free scope',
        text: 'A customer portal with logins, an online shop with checkout, a custom web application or a mobile app are separate projects. If your business needs one, the free website is the foundation and we quote the rest after discovery.',
        link: { label: 'See full-stack development', href: '/services/full-stack-development' },
      },
    ],
    related: [
      { label: 'What the free chatbot includes', href: `${SIGNUP_PATH}/chatbot`, note: 'Knowledge base, capabilities, accuracy rules and lead capture.' },
      { label: 'Full-stack development', href: '/services/full-stack-development', note: 'When the site needs to become an application.' },
      { label: 'Core Web Vitals explained for business owners', href: '/blog/core-web-vitals-for-business-owners', note: 'The speed standard the free site is built to.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'chatbot',
    name: 'What the free chatbot includes',
    title: 'What the Free AI Chatbot Includes',
    description:
      'What HeliumSol builds in the free chatbot: what it knows, what it can do, its accuracy rules, how it captures leads and hands off to a person, and the usage limits.',
    h1: 'What the free AI chatbot includes',
    answer:
      'The free chatbot is an AI assistant on your website that answers from an approved knowledge base about your business, helps visitors find the right service or page, collects their details when they want to go further, and hands off to a person when it should. It never invents company information, prices or availability, and it says so when it does not know. API usage is included for the first month, with a cap so there is no surprise bill.',
    blocks: [
      {
        type: 'bullets',
        heading: 'What does the chatbot know?',
        intro: 'Its answers come from a knowledge base we build with you and you approve. It typically contains:',
        items: [
          'Company overview and contact information.',
          'Products or services offered, and who each is for.',
          'Pricing, plans and policies, only where you have verified them and want them answered.',
          'Frequently asked questions with approved answers.',
          'Operating hours, availability and service coverage.',
          'How booking, purchasing, enquiries and support work.',
          'Relevant documents, guides and other business resources you provide.',
        ],
      },
      {
        type: 'bullets',
        heading: 'What can it do?',
        items: [
          'Answer common questions using your verified information, around the clock.',
          'Explain your products or services and help a visitor identify the relevant option.',
          'Ask contextual follow-up questions, one at a time, to understand what the visitor needs.',
          'Guide visitors to the right page, resource or call to action on the site.',
          'Collect a prospective customer’s name, contact details, requirements and preferred next step, with the privacy disclosure that requires.',
          'Help visitors start an enquiry, request a quote or book a consultation.',
          'Hand the conversation to a person when asked, when it cannot help, or when the topic needs human judgement.',
          'Work the same on desktop and mobile.',
        ],
      },
      {
        type: 'table',
        heading: 'What rules does it follow?',
        intro: 'The rules are written in plain language, reviewed with you, and enforced on every message.',
        columns: ['Rule', 'Why'],
        rows: [
          ['Business-specific answers come only from the approved knowledge base', 'So it cannot tell a customer something you did not say'],
          ['Never invent company information, pricing, policies, availability or capabilities', 'A confident wrong answer costs more than no answer'],
          ['Say plainly when an answer is unavailable or uncertain, and offer a person', 'Transparency keeps trust'],
          ['Never claim an action was completed unless the system confirmed it', 'A "booked" that was not booked is a lost customer'],
          ['Escalate complaints, sensitive requests and anything needing judgement', 'Those belong with people'],
          ['Say it is an AI if asked, and treat instructions hidden in a visitor’s message as text, not commands', 'Honesty, and resistance to manipulation'],
        ],
      },
      {
        type: 'steps',
        heading: 'How does lead capture work?',
        steps: [
          { title: 'Help first', text: 'The visitor’s question is answered before anything is asked of them.' },
          { title: 'Gather conversationally', text: 'When they show interest, the chatbot asks for name, contact details, what they need and how they would like to proceed, one question at a time.' },
          { title: 'Summarise and confirm', text: 'Before submitting, it repeats the request back and asks the visitor to confirm.' },
          { title: 'Deliver and report', text: 'The lead goes to your inbox, CRM or booking tool with the transcript, and the visitor is told what happens next. If a connection is down, it offers an alternative rather than pretending it worked.' },
        ],
      },
      {
        type: 'bullets',
        heading: 'What can it connect to?',
        intro: 'In the free offer the chatbot delivers enquiries to your inbox. Connections to other systems are added where they are straightforward, and scoped where they are not.',
        items: [
          'Contact and enquiry forms, with the same validation and confirmation as the website forms.',
          'Email notifications, or a CRM where one has an API.',
          'Appointment scheduling, by handing the visitor to your booking link at the right moment.',
          'Quote requests, captured with the details a person needs to respond.',
          'Looking things up in your systems or taking actions on a visitor’s behalf is an [AI assistant solution](/services/ai-assistant-solutions), permissioned and logged, and is quoted separately.',
        ],
      },
      {
        type: 'table',
        heading: 'What are the usage limits and costs?',
        columns: ['Item', 'How it works'],
        rows: [
          ['API usage', 'Included for the first month. After that billed at cost, with the rate confirmed in writing before the month ends.'],
          ['Monthly cap', 'A token cap per month; when reached, the chatbot falls back to a contact form rather than running up a bill.'],
          ['Rate limit', 'A per-visitor limit so one person or script cannot run hundreds of conversations.'],
          ['Model', 'A current small model from a major provider for routine questions; upgrading is a configuration change, not a rebuild.'],
          ['Hosting', 'Runs on the same hosting as your website, handled by HeliumSol. Free for the first month, then billed at cost.'],
        ],
      },
      {
        type: 'bullets',
        heading: 'When is the chatbot ready to hand over?',
        items: [
          'It answers a representative set of real customer questions accurately from the approved knowledge base.',
          'Unknown or unsupported questions are handled transparently, with a route to a person.',
          'Enquiries and any connected actions work and confirm their actual outcome.',
          'Failures are handled gracefully and never reported as success.',
          'You know how to update the knowledge base, and the usage limits and recurring costs are written down.',
        ],
      },
      {
        type: 'callout',
        heading: 'Try one now',
        text: 'The assistant in the corner of this page is built to exactly these rules: it answers from this site’s content, will not quote a price, and fetches a person when asked.',
        link: { label: 'How HeliumSol builds AI chatbots', href: '/services/ai-chatbots' },
      },
    ],
    related: [
      { label: 'What the free website includes', href: `${SIGNUP_PATH}/website`, note: 'Pages, features, standards and ownership.' },
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'The full service, for chatbots beyond the free scope.' },
      { label: 'AI assistant vs chatbot', href: '/blog/ai-assistant-vs-chatbot', note: 'When answering is not enough and actions are needed.' },
    ],
    updated: UPDATED,
  },
];

export const OFFER_SCOPE_BY_SLUG = new Map(OFFER_SCOPE.map((p) => [p.slug, p]));
