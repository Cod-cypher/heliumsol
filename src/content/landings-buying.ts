/**
 * Buyer-intent chatbot pages: pricing, the free chatbot, and booking. Each
 * one leads to the Founding Partner Program signup. Prices are never quoted
 * beyond what the offer states; running costs point to the sourced cost guide.
 */

import type { LandingPage } from './types';
import { SIGNUP_PATH } from '../site';
import { PROGRAM_PATH } from './program';

const UPDATED = '2026-10-22';

export const BUYING_LANDINGS: LandingPage[] = [
  {
    slug: 'chatbot-pricing',
    name: 'Chatbot pricing',
    keyword: 'chatbot pricing',
    parentService: 'ai-chatbots',
    eyebrow: 'Pricing',
    title: 'AI Chatbot Pricing: Free Build, Then Usage at Cost',
    description:
      'How HeliumSol prices an AI chatbot: no build fee for founding partners, hosting and API usage free for a month, then billed at cost with a monthly cap.',
    h1: 'AI chatbot pricing: what you pay, what the AI provider charges, and what is free',
    answer:
      'HeliumSol prices a chatbot in two parts: the build and the running costs. For businesses accepted into the Founding Partner Program the build has no upfront fee, and hosting, chatbot API usage and email are free for the first month, then billed at cost. Outside the program, builds are quoted after a short discovery conversation, and the running costs work the same way.',
    blocks: [
      {
        type: 'table',
        heading: 'What are you actually paying for?',
        intro: 'Every cost, side by side. Nothing here is discovered after launch; the written terms before work begins repeat it.',
        columns: ['Item', 'Founding Partner Program', 'Standard project'],
        rows: [
          ['Chatbot build', 'No upfront fee for the agreed scope', 'Quoted after discovery'],
          ['Website build, if you need one', 'No upfront fee for the agreed scope', 'Quoted after discovery'],
          ['Hosting of the site and chatbot', 'Free for the first month, then at cost', 'At cost'],
          ['Chatbot API usage', 'Free for the first month, then at cost, with a monthly cap', 'At cost, with a monthly cap'],
          ['Email on your domain', 'Free for the first month, then at cost', 'At cost, if we set it up'],
          ['Your domain name', 'You buy it and own it', 'You buy it and own it'],
          ['New features after launch', 'Scoped and quoted separately, only if you want them', 'Scoped and quoted separately'],
        ],
      },
      {
        type: 'prose',
        heading: 'What does "billed at cost" mean?',
        paragraphs: [
          'It means you pay what the underlying services charge for your site, without a margin on top. The AI provider charges per token, which is roughly per word processed; hosting and email are monthly services. Before your free month ends, you get the rate for your setup in writing, so the first bill is never a surprise.',
          'For a sense of scale, the published per-token prices put a typical customer conversation on a small model at a fraction of a cent. The full breakdown, with the providers’ own pricing pages linked, is in [what does an AI chatbot cost](/blog/what-does-an-ai-chatbot-cost).',
        ],
      },
      {
        type: 'bullets',
        heading: 'How is this different from a monthly chatbot plan?',
        intro: 'Some businesses compare a built chatbot with a subscription tool. The model here is different in four ways.',
        items: [
          'You pay for usage, not for seats or plan tiers. A quiet month costs less than a busy one.',
          'The chatbot runs on your website’s hosting, and its knowledge base is plain text you keep.',
          'The rules it follows are written for your business and approved by you, not picked from a template.',
          'Handoff to a person and lead delivery to your inbox are part of the build, not an upgrade.',
        ],
      },
      {
        type: 'bullets',
        heading: 'How is the running cost kept predictable?',
        items: [
          'A monthly token cap. When it is reached the chatbot stops calling the model and shows a contact form instead, so a runaway bill cannot happen.',
          'A per-visitor rate limit, so one person or one script cannot run up hundreds of conversations.',
          'A small model by default. Routine questions about your business do not need an expensive one, and upgrading later is a setting, not a rebuild.',
          'A usage report from the transcript log, so you can see what you are paying for.',
        ],
      },
      {
        type: 'callout',
        heading: 'Start at no build cost',
        text: `The [Founding Partner Program](${PROGRAM_PATH}) is selecting a small number of businesses for a free chatbot build, with a website and email on your domain if you need them. One five-minute form, and a person replies within one business day.`,
        link: { label: 'Apply for a founding place', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Is there a setup fee for the chatbot?',
        a: 'Not for founding partners: the build has no upfront fee for the agreed scope. For standard projects the build is quoted after a short discovery conversation, because the work depends on how much of your knowledge is already written down and what the chatbot connects to.',
      },
      {
        q: 'How much does a chatbot cost per month to run?',
        a: 'It depends on how many conversations it handles and which model it runs on. On a small model, the published API prices put a typical conversation at a fraction of a cent. Hosting and email are small monthly costs. Your exact rate is given in writing before the first month ends.',
      },
      {
        q: 'Do you charge per conversation or per user?',
        a: 'Neither as a plan. You pay what the AI provider charges for the usage, at cost, and the monthly cap stops it at a limit you agree.',
      },
      {
        q: 'What happens when the monthly cap is reached?',
        a: 'The chatbot stops calling the AI model and shows visitors a contact form, so enquiries still reach you. The cap resets the next month, and you can raise it if your traffic needs it.',
      },
      {
        q: 'Why do you not publish build prices?',
        a: 'Because an honest figure depends on the project. A business with clear service pages and an FAQ is quick to prepare; one where the answers live in the owner’s head needs a writing phase first. The founding program removes the build fee altogether for the businesses selected.',
      },
      {
        q: 'Is the free build really free?',
        a: 'Yes, for the agreed scope. What we ask in return is honest feedback and, only if you are happy with the result, permission to show the project. The only costs after the first month are hosting, API usage and email at cost, plus your domain.',
      },
    ],
    related: [
      { label: 'What does an AI chatbot cost?', href: '/blog/what-does-an-ai-chatbot-cost', note: 'Per-conversation costs with the providers’ published prices.' },
      { label: 'Free AI chatbot for your website', href: '/free-ai-chatbot-for-website', note: 'What the free build covers and how to apply.' },
      { label: 'What the free chatbot includes', href: `${SIGNUP_PATH}/chatbot`, note: 'Knowledge base, rules, lead capture and limits.' },
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'What every HeliumSol chatbot build includes.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'free-ai-chatbot-for-website',
    name: 'Free AI chatbot for your website',
    keyword: 'free AI chatbot for website',
    parentService: 'ai-chatbots',
    eyebrow: 'Free offer',
    title: 'Free AI Chatbot for Your Website, Built for You',
    description:
      'A free AI chatbot built for your website and trained on your content, with API usage and hosting free for the first month. What "free" covers and how to apply.',
    h1: 'A free AI chatbot for your website, built and set up for you rather than left for you to configure',
    answer:
      'HeliumSol builds a knowledge-base AI chatbot for your website at no charge for businesses accepted into its Founding Partner Program. It is trained on your own content, set up and tested by a person, and its API usage and hosting are covered for the first month. After that month, usage and hosting are billed at cost, with the rate confirmed in writing first.',
    blocks: [
      {
        type: 'table',
        heading: 'A free chatbot tool, or a free chatbot built for you?',
        intro: 'Searching for a free chatbot usually turns up do-it-yourself tools. This offer is the other kind. The difference is who does the work.',
        columns: ['Compared on', 'Do-it-yourself free plan', 'HeliumSol founding build'],
        rows: [
          ['Who sets it up', 'You', 'HeliumSol'],
          ['Who writes the knowledge base', 'You', 'We draft it with you from your site and documents'],
          ['Rules and tone', 'You configure them', 'Written for your business, approved by you'],
          ['Handoff to a person', 'Varies by tool and plan', 'Built in'],
          ['Lead capture', 'Varies by tool and plan', 'Built in, delivered to your inbox'],
          ['Cost after the free period', 'Set by the vendor’s plans', 'Hosting and API usage at cost'],
        ],
      },
      {
        type: 'bullets',
        heading: 'What exactly is free?',
        items: [
          'The chatbot build for the agreed scope: knowledge base, rules, widget, testing.',
          'Drafting the knowledge base from your website, documents and the questions you hear most.',
          'Lead capture to your inbox and a handoff to a person when a visitor asks for one.',
          'Installation on your existing website, or on a new website we build as part of the same offer.',
          'The first month of chatbot API usage and hosting.',
          'Not included: your domain name, which you buy and own.',
        ],
      },
      {
        type: 'prose',
        heading: 'What is the catch?',
        paragraphs: [
          `There is no catch hidden in the terms; the reason it is free is stated openly. HeliumSol is a new brand building its first public portfolio through the [Founding Partner Program](${PROGRAM_PATH}). Rather than spend the money on advertising, we build for a small number of businesses and ask for honest feedback in return.`,
          'If you are happy with the result, we would like permission to show the project. You can say no, and the chatbot works the same either way. Places are limited because each build gets a person’s full attention.',
        ],
      },
      {
        type: 'steps',
        heading: 'How do you get one?',
        steps: [
          { title: 'Apply', text: 'A five-minute form on the signup page. It never asks for a password.' },
          { title: 'A person reviews it', text: 'Within one business day: next steps, or an honest note if it is not a fit.' },
          { title: 'Terms in writing', text: 'Scope, ongoing costs after the first month, usage limits and ownership, before any work starts.' },
          { title: 'Build, test, launch', text: 'You test the chatbot on real questions and approve it before visitors see it.' },
        ],
      },
      {
        type: 'callout',
        heading: 'Claim a free chatbot build',
        text: 'Keep your current website or get a new one with the chatbot built in. Either way, the build is free for founding partners.',
        link: { label: 'Apply for a founding place', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Can you add the chatbot to my existing website?',
        a: 'Yes. Choose "I have a website I want to keep" in the signup form. The widget is a small script that most website platforms allow you to add; the team confirms yours before starting.',
      },
      {
        q: 'Do I need any technical skills?',
        a: 'No. HeliumSol builds, installs and tests it. Your part is answering questions about your business and approving the chatbot’s rules and answers.',
      },
      {
        q: 'What if I do not have much written content?',
        a: 'That is common. The knowledge base is drafted with you from what you already say to customers, and you approve it. The answers have to be true, so we write down what you tell us rather than invent it.',
      },
      {
        q: 'Is there a limit on conversations?',
        a: 'There is a monthly usage cap and a per-visitor rate limit, both set with you. When the cap is reached the chatbot shows a contact form instead, so enquiries still arrive.',
      },
      {
        q: 'Is it free forever?',
        a: 'The build is free. Hosting and API usage are free for the first month and then billed at cost, at a rate you are given in writing before that month ends.',
      },
      {
        q: 'Will it work on phones?',
        a: 'Yes. The widget is built for mobile and desktop, and it loads after your page so it does not slow the page down.',
      },
    ],
    related: [
      { label: 'Chatbot pricing', href: '/chatbot-pricing', note: 'Every cost, for founding partners and standard projects.' },
      { label: 'AI assistant for your website', href: '/website-ai-assistant', note: 'How the assistant is trained on your content.' },
      { label: 'What the free chatbot includes', href: `${SIGNUP_PATH}/chatbot`, note: 'The full scope, rules and limits.' },
      { label: 'The Founding Partner Program', href: PROGRAM_PATH, note: 'Why the build is free and what is asked in return.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'appointment-booking-chatbot',
    name: 'Appointment booking chatbot',
    keyword: 'appointment booking chatbot',
    parentService: 'ai-assistant-solutions',
    title: 'Appointment Booking Chatbot for Your Website',
    description:
      'A booking chatbot answers questions first, then hands off to your booking page, sends a request, or books via your calendar, confirming only real bookings.',
    h1: 'An appointment booking chatbot that answers first, books second, and never confirms a slot it did not get',
    answer:
      'An appointment booking chatbot answers a visitor’s questions about your services, then helps them book: by sending them to your booking page at the right moment, by passing a booking request to you, or, when connected to your calendar or booking tool, by checking availability and creating the appointment. HeliumSol builds all three, and in every version the chatbot only confirms a booking after your system has.',
    blocks: [
      {
        type: 'table',
        heading: 'Which kind of booking chatbot do you need?',
        intro: 'Three levels. Most businesses start at the first or second and move up when the volume justifies it.',
        columns: ['Level', 'What it does', 'Good for'],
        rows: [
          ['Hand-off to your booking page', 'Answers questions, then sends the visitor to your existing booking link when they are ready', 'Businesses already happy with their booking tool'],
          ['Booking request', 'Collects the service, preferred times and contact details, and sends a request for you to confirm', 'Businesses that confirm by hand or need to check something first'],
          ['Direct booking', 'Checks live availability through your calendar or booking tool and creates the appointment after the visitor confirms a summary', 'Higher volume and simple appointment types'],
        ],
      },
      {
        type: 'steps',
        heading: 'What does a booking conversation look like?',
        steps: [
          { title: 'Answer the question', text: 'Most visitors ask something before they book: what a service involves, how long it takes, what to bring.' },
          { title: 'Narrow the service', text: 'One question at a time until the chatbot knows which appointment type fits.' },
          { title: 'Offer times', text: 'Real availability at the direct-booking level, or the visitor’s preferences at the request level.' },
          { title: 'Summarise and confirm', text: 'Service, time, name and contact details, read back for the visitor to confirm before anything is sent.' },
          { title: 'Book, then say so', text: 'The chatbot reports what your system actually did. If the booking failed, it says that and offers another way.' },
        ],
      },
      {
        type: 'bullets',
        heading: 'What can go wrong, and how is it handled?',
        items: [
          'Two people want the same slot: availability is checked at the moment of booking, not from an earlier copy.',
          'Your booking system is unavailable: the chatbot says so plainly and offers a booking request or your phone number. It never pretends.',
          'Someone wants to reschedule or cancel: they are sent to your booking tool’s own links or to a person, so changes happen in one place.',
          'People forget appointments: reminders come from your booking tool or from an [automation workflow](/services/workflow-automation), not from the chat.',
          'Sensitive details: the chatbot collects only what the appointment needs.',
        ],
      },
      {
        type: 'prose',
        heading: 'What does it connect to?',
        paragraphs: [
          'Direct booking needs your calendar or booking tool to have an API. Google Calendar and Microsoft Outlook calendars offer one, as do many booking tools; the team confirms yours before quoting. Where there is no API, the booking-request level works with any setup, and an [n8n workflow](/blog/what-can-you-automate-with-n8n) can put the request into your calendar for a person to approve.',
          'Booking is an action, so it follows the rules of [AI assistant solutions](/services/ai-assistant-solutions): a narrowly scoped connection, a confirmation before acting, and a log of what happened.',
        ],
      },
      {
        type: 'callout',
        heading: 'Booking in the free chatbot',
        text: `The free chatbot in the [Founding Partner Program](${PROGRAM_PATH}) includes the hand-off to your booking page and booking requests to your inbox. Whether direct calendar booking fits in the free scope for your business is set out in writing before work begins.`,
        link: { label: 'Apply for a founding place', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Can it book into the booking software I already use?',
        a: 'If the software has an API, usually yes; the team checks it before quoting. If it does not, the chatbot hands visitors to your booking page or sends you booking requests instead.',
      },
      {
        q: 'Will it double-book?',
        a: 'At the direct-booking level it checks availability at the moment it books and only confirms what your system accepted. At the other levels your booking tool or a person makes the booking, so the chatbot cannot double-book.',
      },
      {
        q: 'Can customers reschedule or cancel in the chat?',
        a: 'They are pointed to your booking tool’s reschedule and cancel links, or to a person. Keeping changes in one system avoids two records disagreeing.',
      },
      {
        q: 'Does it send reminders?',
        a: 'Reminders come from your booking tool or from an automation workflow. The chatbot’s job is to get the booking made correctly.',
      },
      {
        q: 'Can it take deposits or payments?',
        a: 'Payments stay in your booking or payment tool. The chatbot can send the visitor to that step, but it does not handle card details.',
      },
      {
        q: 'What if a visitor wants to speak to someone instead?',
        a: 'They can ask at any point and the conversation goes to a person, with everything they already said attached.',
      },
    ],
    related: [
      { label: 'AI assistant solutions', href: '/services/ai-assistant-solutions', note: 'Assistants that take actions safely.' },
      { label: 'AI chatbot for home service businesses', href: '/ai-chatbot-for-home-services', note: 'Booking jobs, separating emergencies from quotes.' },
      { label: 'AI chatbot for law firms', href: '/ai-chatbot-for-law-firms', note: 'Booking consultations after intake.' },
      { label: 'Workflow automation with n8n', href: '/services/workflow-automation', note: 'Reminders and calendar sync behind the chat.' },
    ],
    updated: UPDATED,
  },
];
