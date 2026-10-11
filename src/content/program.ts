/**
 * The Founding Partner Program: the reason the website and chatbot are free.
 * Used by /founding-partner-program, the homepage section and the offer page.
 */

import type { Block, FaqItem, LinkItem } from './types';
import { SIGNUP_PATH } from '../site';

export const PROGRAM_PATH = '/founding-partner-program';
export const PROGRAM_NAME = 'Founding Partner Program';

/** The short version, for the homepage and the offer page. */
export const PROGRAM_SUMMARY = {
  eyebrow: 'Why is this free?',
  heading: 'The Founding Partner Program',
  paragraphs: [
    'HeliumSol is selecting a small number of businesses to receive a professionally built website and AI chatbot as part of its founding client program. We would rather prove what we build on real businesses than spend the same money on advertising.',
    'In exchange we ask for one thing: honest feedback about the experience. If you are happy with the result, we would appreciate permission to showcase the project in our portfolio, but that is entirely separate from the quality of the work you receive and you can decline it.',
    'There are no upfront development fees for the agreed scope. Every ongoing cost, usage limit, ownership term and optional paid service is explained in writing before work begins.',
  ],
};

/** One paragraph, for the section at the end of the offer page. */
export const PROGRAM_SHORT =
  'HeliumSol is selecting a small number of businesses to receive a professionally built website and AI chatbot as part of its founding client program. In exchange we ask for honest feedback, and, only if you are happy with the result, permission to showcase the project. No upfront development fees for the agreed scope; every ongoing cost, limit and ownership term is explained in writing before work begins.';

export const PROGRAM_ANSWER =
  'The Founding Partner Program is how HeliumSol builds its first public portfolio: a small number of businesses get a professionally built website, a knowledge-base chatbot and email on their domain with no upfront development fees for the agreed scope. In return we ask for honest feedback, and, only if you are happy with the result, permission to show the project. Ongoing costs, limits and ownership are explained before any work starts.';

export const PROGRAM_BLOCKS: Block[] = [
  {
    type: 'prose',
    heading: 'Why would an agency build a website for free?',
    paragraphs: [
      'Because a new brand has to earn trust, and the fastest honest way to do that is to build real things for real businesses and let the results speak. HeliumSol is a new brand. Rather than spend the equivalent of several builds on advertising that says we are good, we are putting that effort into a small number of founding clients whose sites and chatbots will show it.',
      'That is the whole reason. There is no catch hidden in the terms, no bait price that doubles later, and no obligation to say anything nice about us. If the work is not good, we want to hear that most of all.',
    ],
  },
  {
    type: 'table',
    heading: 'What do you get, and what do we ask?',
    columns: ['You receive', 'We ask'],
    rows: [
      [
        `A professional, mobile-first website coded by HeliumSol, adapted to your business. [See what the website includes](${SIGNUP_PATH}/website).`,
        'Honest feedback: a short conversation or written notes at launch and again after the first month.',
      ],
      [
        `A knowledge-base chatbot that answers from your approved content, captures enquiries and hands off to you. [See what the chatbot includes](${SIGNUP_PATH}/chatbot).`,
        'If, and only if, you are happy with the result: permission to show the project in our portfolio. You can say no, and the work is the same either way.',
      ],
      [
        'Email on your domain, with hosting, chatbot API usage and email included for the first month.',
        'Reasonable responsiveness during the build: content, decisions and approvals when we ask for them, so the project ships.',
      ],
      ['No upfront development fees for the agreed scope.', 'Nothing else. No reviews required, no referrals required, no lock-in.'],
    ],
  },
  {
    type: 'bullets',
    heading: 'Who is the program for?',
    intro: 'We are looking for a small number of businesses that fit these points. Being a large company is not one of them.',
    items: [
      'A real business with a real product or service, whether it is one person or a team.',
      'No website yet, a website that needs replacing, or a website you like that needs a chatbot.',
      'Someone who will answer our questions and give honest feedback, including the critical kind.',
      'Content that can be written down: what you do, who for, how it works. We help you draft it, but it has to be true.',
      'Any industry. Home services, practices, professional services, hospitality, retail, education and software are all a fit.',
    ],
  },
  {
    type: 'steps',
    heading: 'How does selection work?',
    intro: 'Places are limited because each build gets a person’s full attention. Here is how a signup becomes a founding client.',
    steps: [
      { title: 'You sign up', text: 'The form on the offer page takes about five minutes and asks only what we need to see the fit.' },
      { title: 'A person reviews it', text: 'Within one business day you hear back: either next steps, or an honest note that the program is not the right fit and why.' },
      { title: 'Terms in writing', text: 'Before any work starts you get the scope, the ongoing costs after the first month, the usage limits, the ownership terms and any optional paid services, in plain words.' },
      { title: 'We build, you launch', text: 'Working pages early, the chatbot tested on your real questions, your approval before go-live, then feedback at launch and after a month.' },
    ],
  },
  {
    type: 'table',
    heading: 'What does it cost, exactly?',
    intro: 'Free means free for the build. The recurring items are small and are stated before work begins, never discovered afterwards.',
    columns: ['Item', 'Cost'],
    rows: [
      ['The website build', 'No charge for the agreed scope.'],
      ['The chatbot build', 'No charge for the agreed scope.'],
      ['Hosting of the website and chatbot', 'Free for the first month, then billed at cost.'],
      ['Chatbot API usage', 'Free for the first month, then billed at cost, with a monthly cap so it cannot run away.'],
      ['Email on your domain', 'Free for the first month, then billed at cost.'],
      ['Your domain name', 'You buy it and own it. It stays registered in your name.'],
      ['Optional extras (a customer portal, a shop, an app, more automations)', 'Scoped and quoted separately, only if you want them.'],
    ],
  },
  {
    type: 'bullets',
    heading: 'What does "showcase the project" mean?',
    intro: 'If you agree, and only then:',
    items: [
      'Your business name, a link to the live site, and a short description of what was built appear on our case studies page.',
      'Any result we mention has to be one you have confirmed. We do not invent numbers.',
      'You approve the wording before it goes up and can ask for it to come down later.',
      'Declining changes nothing about the build, the hosting or the support you receive.',
    ],
  },
  {
    type: 'callout',
    heading: 'Ownership, in one line',
    text: 'The website, its content and your domain are yours. HeliumSol hosts the site and chatbot and documents every dependency, so the project can be maintained, moved or expanded on the agreed terms.',
    link: { label: 'Read the full website scope', href: `${SIGNUP_PATH}/website` },
  },
];

export const PROGRAM_FAQ: FaqItem[] = [
  {
    q: 'Is there really no fee for the build?',
    a: 'There is no upfront development fee for the agreed scope. The only recurring costs are hosting, chatbot API usage and email after the first free month, all billed at cost and confirmed in writing before the month ends, plus the domain name, which you buy and own.',
  },
  {
    q: 'What if I do not want my project shown publicly?',
    a: 'Then it is not shown. Showcasing is a request we make only if you are happy with the result, and declining has no effect on the work, the hosting or the support.',
  },
  {
    q: 'How many businesses are you selecting?',
    a: 'A small number at a time, because each build is done by a person who gives it full attention. We do not publish a figure; when places are full the signup page says so and you can ask to be told when the next ones open.',
  },
  {
    q: 'What kind of feedback are you looking for?',
    a: 'Plain, honest answers to a few questions at launch and after a month: what was confusing, what took too long, what the chatbot got wrong, what customers said. Critical feedback is the most useful kind.',
  },
  {
    q: 'What happens after the first month?',
    a: 'The site keeps running. Hosting, chatbot API usage and email move to being billed at cost, at the rate you were given in writing. You can keep HeliumSol on for updates and new work, scoped separately, or run the site with the handover documentation.',
  },
  {
    q: 'Can I get the chatbot without a new website?',
    a: 'Yes. If you have a website you want to keep, choose that option in the signup form and the chatbot is added to it.',
  },
  {
    q: 'What if my business turns out not to be a fit?',
    a: 'You hear that within one business day, with the reason. Often it is that the business needs something outside the free scope, such as a shop or a portal, and we say what that would involve.',
  },
];

export const PROGRAM_RELATED: LinkItem[] = [
  { label: 'Claim a founding partner place', href: SIGNUP_PATH, note: 'The signup form. About five minutes.' },
  { label: 'What the free website includes', href: `${SIGNUP_PATH}/website`, note: 'Pages, features, standards and ownership.' },
  { label: 'What the free chatbot includes', href: `${SIGNUP_PATH}/chatbot`, note: 'Knowledge base, rules, lead capture and limits.' },
  { label: 'About HeliumSol', href: '/about', note: 'Who we are and how a project runs.' },
];
