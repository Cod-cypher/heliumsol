/**
 * Landing pages for AI chatbot and AI assistant search intent. Each page has
 * its own structure and copy; they share a renderer, not a template with
 * words swapped. Each becomes /<slug> under its parent service.
 */

import type { LandingPage } from './types';
import { SIGNUP_PATH } from '../site';

const UPDATED = '2026-10-12';

export const LANDINGS: LandingPage[] = [
  {
    slug: 'ai-chatbot-for-small-business',
    name: 'AI chatbot for small business',
    keyword: 'AI chatbot for small business',
    parentService: 'ai-chatbots',
    title: 'AI Chatbot for Small Business: What It Does and Costs',
    description:
      'What an AI chatbot can and cannot do for a small business, what it costs to run, how it is set up, and how to get one free with a new website from HeliumSol.',
    h1: 'An AI chatbot for a small business: what it handles, what it costs to run, and where to start',
    answer:
      'For a small business, an AI chatbot is a way to answer the same twenty questions at any hour, collect the details of people who want to buy, and hand the rest to you, without hiring. Built on your own content, it costs very little per conversation to run and does not need a technical team to maintain. HeliumSol builds them, and includes one free with a new website.',
    blocks: [
      {
        type: 'table',
        heading: 'What will a chatbot actually do for a business like mine?',
        intro: 'Honest expectations first. This is what a knowledge-base chatbot does well, and what it should not be asked to do.',
        columns: ['Ask it to', 'Do not ask it to'],
        rows: [
          ['Answer hours, location, areas served and what you offer, instantly, at 2 a.m.', 'Negotiate prices or make promises you have not written down'],
          ['Explain how your process works and what to expect', 'Handle complaints that need a human’s judgement and empathy'],
          ['Collect a name, phone and email from someone ready to go further', 'Replace your phone number; some customers will always want to call'],
          ['Point people to the right page, form or booking link', 'Give legal, medical or financial advice beyond your published content'],
          ['Hand the conversation to you when asked', 'Pretend to be a person'],
        ],
      },
      {
        type: 'prose',
        heading: 'How much does it cost a small business to run a chatbot?',
        paragraphs: [
          'The running cost is mostly the AI provider’s API usage, which is priced per token (roughly per word) and published openly. Small models suited to routine questions are priced at fractions of a dollar per million tokens, and a typical customer conversation uses a few thousand. HeliumSol also sets a monthly usage cap and a per-visitor rate limit, so a busy month or a bored visitor cannot run up a surprise bill. The chatbot runs on the same server as your website, so there is no separate hosting fee.',
          'The build cost is quoted after a short discovery conversation; it depends on how much of your knowledge is already written down. The full breakdown with current published prices is in [what does an AI chatbot cost](/blog/what-does-an-ai-chatbot-cost).',
        ],
      },
      {
        type: 'steps',
        heading: 'What does setting one up involve on my side?',
        intro: 'Less than most owners expect. The work is mostly collecting answers you already give every day.',
        steps: [
          { title: 'Send what you have', text: 'Your website, any price list or FAQ, and the questions you are tired of answering. A voice note is fine.' },
          { title: 'Approve the rules', text: 'A one-page description of how the chatbot should talk and what it must never say. You read it, change it, sign it off.' },
          { title: 'Try it before customers do', text: 'You get a private link and ask it the hard questions. Weak answers become fixes in the knowledge base.' },
          { title: 'Go live, then check in', text: 'The chat widget goes on your site. After a couple of weeks you see the transcripts and decide what to tighten.' },
        ],
      },
      {
        type: 'bullets',
        heading: 'Which small businesses get the most from a chatbot?',
        items: [
          'Home and trade services, where the first question is always "do you cover my area" and the second is "how soon".',
          'Clinics and practices, where new patients want to know what to expect, what is covered and how to book.',
          'Restaurants and venues, for hours, menus, dietary questions and private bookings.',
          'Professional services, where a qualifying conversation before a call saves everyone time.',
          'Shops, for stock, delivery, returns and "do you have this in" questions.',
        ],
      },
      {
        type: 'callout',
        heading: 'A website and a chatbot, free',
        text: 'HeliumSol’s free offer is built for small businesses: a new website plus a knowledge-base chatbot trained on your content, with API usage included for the first month. One form, and a person reads it.',
        link: { label: 'See the free website and chatbot offer', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Do I need a website to have a chatbot?',
        a: 'The chatbot lives on a website, so yes. If you do not have one, the free offer includes a new site with the chatbot built in. If you have one you like, the chatbot can be added to it.',
      },
      {
        q: 'Will it sound like a robot?',
        a: 'It sounds like whatever the rules say. HeliumSol writes them for plain, short, friendly answers in your business’s voice, and it is told to say plainly that it is an AI if asked.',
      },
      {
        q: 'What if it gives a wrong answer?',
        a: 'It only answers from content you approved, and says so when it does not know. When a transcript shows a weak answer, the fix is a change to your knowledge base, which takes minutes.',
      },
      {
        q: 'Can I see what people ask it?',
        a: 'Yes. Transcripts are stored in a database you control, and the first weeks after launch include a review of them with you.',
      },
      {
        q: 'How is pricing handled if I do not want prices online?',
        a: 'The chatbot is told not to quote prices. It explains how pricing works, what affects it, and offers to get a person in touch. HeliumSol’s own assistant works this way.',
      },
      {
        q: 'What happens after the free month of API usage?',
        a: 'Usage is billed at cost, and the rate for your chatbot is confirmed with you in writing before the month ends. The signup page states the terms.',
      },
    ],
    related: [
      { label: 'AI chatbot development by HeliumSol', href: '/services/ai-chatbots', note: 'Everything that is included in a chatbot build.' },
      { label: 'Lead generation chatbot', href: '/lead-generation-chatbot', note: 'When the goal is enquiries, not just answers.' },
      { label: 'What does an AI chatbot cost?', href: '/blog/what-does-an-ai-chatbot-cost', note: 'Build and running costs with published API prices.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'ai-customer-support-chatbot',
    name: 'AI customer support chatbot',
    keyword: 'AI customer support chatbot',
    parentService: 'ai-chatbots',
    title: 'AI Customer Support Chatbot with Real Human Handoff',
    description:
      'A support chatbot that answers from your documentation, knows when it does not know, and hands off to a person with the transcript. No dead ends.',
    h1: 'An AI customer support chatbot that answers from your docs and hands off before it frustrates anyone',
    answer:
      'An AI customer support chatbot handles the repetitive questions in your support queue by answering from your documentation and policies, and passes everything else to a person with the full conversation attached. The two things that make or break it are grounding (answering only from approved content) and handoff (a real route to a human that triggers early). HeliumSol builds both in from the start.',
    blocks: [
      {
        type: 'prose',
        heading: 'Why do support chatbots get a bad name, and how is this different?',
        paragraphs: [
          'Most people have met a support bot that loops, guesses, or refuses to produce a human. Those failures have two causes: the bot is allowed to answer from general knowledge rather than from the company’s own material, and escalation is treated as a failure to be minimised rather than a feature to be designed.',
          'HeliumSol’s support chatbots are grounded, meaning they answer only from your help articles, policies and product documentation, and they are instructed in writing to say when the answer is not there. Handoff is designed first: the moment a customer asks for a person, expresses frustration, or raises something outside the rules, a person is notified with the transcript and the customer is told what happens next.',
        ],
      },
      {
        type: 'bullets',
        heading: 'What should a support chatbot be allowed to answer?',
        intro: 'The scope is decided with you, written down, and enforced by the rules the chatbot runs under. A typical first release looks like this.',
        items: [
          'How-to questions covered by your documentation, with a link to the article.',
          'Order, delivery and returns policy questions, from the policy text.',
          'Account basics: how to reset a password, change an email, find an invoice.',
          'Status questions where the assistant can look the answer up through an approved tool (see [AI assistant solutions](/services/ai-assistant-solutions)).',
          'Collecting the details a person will need before they take over: order number, email, a description of the problem.',
        ],
      },
      {
        type: 'steps',
        heading: 'How does the handoff actually work?',
        steps: [
          { title: 'The trigger', text: 'A request for a person, a topic outside the rules, a repeated question, or a tone that reads as frustration. Any of these ends the automated part.' },
          { title: 'The customer is told', text: 'Plainly: a person has been notified, here is how they will get back to you, here is how to reach us meanwhile.' },
          { title: 'Your team gets the transcript', text: 'By chat join link, email, or into your ticketing tool, with everything the customer already said, so nobody has to repeat themselves.' },
          { title: 'The gap is closed', text: 'Each handoff is a signal. If the same question keeps escalating, it becomes a documentation fix and the chatbot handles it next time.' },
        ],
      },
      {
        type: 'table',
        heading: 'Where does the chatbot run, and what does it connect to?',
        columns: ['Channel or system', 'How it is used'],
        rows: [
          ['Your website or app', 'A chat widget on the help pages, or embedded in the product where questions arise'],
          ['Ticketing or help desk', 'Handoffs become tickets with the transcript; resolved tickets improve the knowledge base'],
          ['Your documentation', 'The source of truth. The chatbot re-indexes when it changes, so answers stay current'],
          ['Order, booking or account systems', 'Optional lookups through narrowly scoped, logged tool calls'],
        ],
      },
      {
        type: 'callout',
        heading: 'See a grounded chatbot answer live',
        text: 'The assistant on this site is the same kind HeliumSol builds for support: it answers from the site’s own content, refuses to quote prices, and fetches a person when asked. Open it and try.',
        link: { label: 'How HeliumSol builds AI chatbots', href: '/services/ai-chatbots' },
      },
    ],
    faq: [
      {
        q: 'How much of our support volume can a chatbot handle?',
        a: 'It depends on how much of your queue is repetitive and documented. HeliumSol does not promise a percentage; the mapping session looks at your actual tickets and tells you which categories the chatbot can take and which should stay with people.',
      },
      {
        q: 'What does it cost?',
        a: 'The build is quoted after discovery and depends on how much documentation exists, which channels it runs on and whether it needs to look things up in your systems. Running cost is the AI provider’s API usage, capped monthly, plus nothing extra for hosting on your own site.',
      },
      {
        q: 'How long does it take to launch?',
        a: 'The timeline is set with the scope. Businesses with a maintained help centre are fastest; where the knowledge is in people’s heads, the writing-down phase takes longer and is the most valuable part.',
      },
      {
        q: 'Will customers know it is a bot?',
        a: 'Yes. It is labelled as an assistant and says so if asked. Pretending otherwise erodes trust and, in some places, breaks the law.',
      },
      {
        q: 'Can it access customer accounts?',
        a: 'Only through tools you approve, scoped to the minimum, and logged. Read-only lookups are common; anything that changes an account waits for a person unless you decide otherwise.',
      },
      {
        q: 'Does it integrate with our help desk?',
        a: 'Handoffs can be sent to a ticketing tool with the transcript, by email, or to a live chat join link. The route is chosen in discovery based on what your team already uses.',
      },
      {
        q: 'How do we keep its answers up to date?',
        a: 'Update the documentation it reads from. The chatbot is re-indexed on change, and transcript reviews show where new questions are appearing.',
      },
    ],
    related: [
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'What a HeliumSol chatbot build includes.' },
      { label: 'AI assistant solutions', href: '/services/ai-assistant-solutions', note: 'When support needs lookups and actions, not just answers.' },
      { label: 'AI assistant vs chatbot', href: '/blog/ai-assistant-vs-chatbot', note: 'Which one a support team actually needs.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'lead-generation-chatbot',
    name: 'Lead generation chatbot',
    keyword: 'lead generation chatbot',
    parentService: 'ai-chatbots',
    title: 'Lead Generation Chatbot: Qualify, Capture, Route',
    description:
      'A chatbot that asks one qualifying question at a time, captures contact details when a visitor is ready, and routes the lead to your inbox or CRM.',
    h1: 'A lead generation chatbot that qualifies visitors one question at a time and routes the lead to you',
    answer:
      'A lead generation chatbot turns a website visit into an enquiry by asking the questions you would ask on a first call, one at a time, then capturing a name, email and phone number and sending the lead to your inbox, CRM or sheet with the whole conversation attached. HeliumSol builds them to qualify without interrogating, to respect consent rules for follow-up, and to hand off to a person the moment someone asks.',
    blocks: [
      {
        type: 'steps',
        heading: 'What does a good lead conversation look like?',
        intro: 'The pattern HeliumSol builds to, and the one its own assistant follows.',
        steps: [
          { title: 'Answer first', text: 'The visitor came with a question. It gets answered from your content before anything is asked of them. Nobody qualifies a visitor who has not been helped.' },
          { title: 'One question at a time', text: 'What they want done, who it is for, what they use today, whether a date is driving it. Each answer shapes the next question; there is no form dumped into the chat.' },
          { title: 'Ask for details when it is earned', text: 'When the visitor wants to go further, the chatbot asks how a person should reach them, and only the details a person needs.' },
          { title: 'Route and confirm', text: 'The lead lands in your inbox, CRM or sheet with the transcript. The visitor is told who will be in touch and when.' },
        ],
      },
      {
        type: 'table',
        heading: 'Where does the lead go?',
        intro: 'Delivery is configured, not coded. These are the usual destinations; an [n8n workflow](/services/workflow-automation) can fan out to several at once.',
        columns: ['Destination', 'What arrives', 'Typical next step'],
        rows: [
          ['Email inbox', 'Name, contact details, answers, transcript', 'A person replies within your service standard'],
          ['CRM', 'A contact and deal with the answers mapped to fields', 'Assignment, follow-up task, pipeline stage'],
          ['Spreadsheet', 'One row per lead', 'Simple tracking for small teams'],
          ['Chat or SMS alert', 'A short summary with a link', 'Immediate call-back for hot leads'],
        ],
      },
      {
        type: 'prose',
        heading: 'What about consent for follow-up by text or email?',
        paragraphs: [
          'Collecting a phone number does not by itself give you permission to text it. If you plan to follow up by SMS, the chatbot needs to collect consent the way the carriers and the law require: clear, specific, not a condition of purchase, with opt-out instructions. HeliumSol runs its own SMS program under those rules, and the [SMS program page](/sms-program) shows what that consent looks like in practice.',
          'In practice this means the chatbot states what the visitor is agreeing to in plain words before it asks for a number, records the consent with the lead, and your follow-up messages carry STOP and HELP instructions. Email follow-up has its own rules; the chatbot is configured for whichever channels you actually use.',
        ],
      },
      {
        type: 'bullets',
        heading: 'What makes a lead chatbot fail?',
        items: [
          'Asking for contact details before the visitor has been helped. People leave.',
          'Asking too many questions. The first call will cover the rest; the chatbot’s job is to make that call happen.',
          'Promising things: a price, a date, a result. The chatbot is told to describe how these are decided and leave the deciding to a person.',
          'Nobody answering. A lead routed to an unwatched inbox is a lead lost; alerts and response standards are part of the setup.',
          'No measurement. Every captured lead and every drop-off is tracked, so you can see which questions lose people.',
        ],
      },
      {
        type: 'callout',
        heading: 'Start with the free website and chatbot',
        text: 'The chatbot in HeliumSol’s free offer includes lead capture to your inbox. It is a working lead generation chatbot on a new website, with API usage included for the first month.',
        link: { label: 'Claim the free website and chatbot', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'How many leads will a chatbot generate?',
        a: 'HeliumSol does not promise numbers. A chatbot converts visitors who are already on your site and have a question; it does not create traffic. What it reliably does is stop those visitors leaving without a way to reach you, and it reports exactly how many enquiries it captured.',
      },
      {
        q: 'What does it cost?',
        a: 'The build is quoted after discovery, based on the qualifying flow, the destinations the lead goes to and any consent requirements. Running cost is the AI provider’s API usage, capped monthly. There is no per-lead fee.',
      },
      {
        q: 'How long does setup take?',
        a: 'The timeline comes with the scope. The flow itself is quick to agree; connecting a CRM or adding SMS consent takes a little longer and is where most of the detail lives.',
      },
      {
        q: 'Can it book appointments directly?',
        a: 'It can hand the visitor to your booking link at the right moment, and with an approved tool connection it can create the booking itself. See AI assistant solutions for how actions are permissioned.',
      },
      {
        q: 'Will it annoy visitors?',
        a: 'Not if it answers before it asks and asks one thing at a time. The rules HeliumSol writes forbid repeated prompts, pop-ups that interrupt reading, and pressure language.',
      },
      {
        q: 'Does it work with my CRM?',
        a: 'Most CRMs have an API; the lead is created directly or through an n8n workflow. Where there is no API, email or a spreadsheet is used as the bridge.',
      },
      {
        q: 'What data is stored, and where?',
        a: 'Lead details and transcripts are stored in a database you control and sent only to the destinations you configure. Your privacy policy is updated to say so, as HeliumSol’s own policy does.',
      },
    ],
    related: [
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'The full chatbot build, including handoff and caps.' },
      { label: 'Workflow automation with n8n', href: '/services/workflow-automation', note: 'Route one lead to several systems automatically.' },
      { label: 'AI chatbot for small business', href: '/ai-chatbot-for-small-business', note: 'What a chatbot can and cannot do for a small team.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'website-ai-assistant',
    name: 'AI assistant for your website',
    keyword: 'AI assistant for website',
    parentService: 'ai-assistant-solutions',
    title: 'AI Assistant for Your Website, Free with a New Site',
    description:
      'A knowledge-base AI assistant that answers from your own pages, captures enquiries and hands off to a person. Free with a new website from HeliumSol.',
    h1: 'An AI assistant for your website, trained on your own content and free with a new site',
    answer:
      'A website AI assistant is a chat window that answers visitors’ questions from your own pages and documents, in your voice, and gets a person involved when it should. It is built by collecting your content into a knowledge base, writing the rules it operates under, and connecting it to your inbox. HeliumSol builds one into every website in its free offer, with the first month of API usage included.',
    blocks: [
      {
        type: 'prose',
        heading: 'How is the assistant "trained" on my website?',
        paragraphs: [
          'Not by retraining a model. Your pages, documents and FAQs are collected into a knowledge base, and when a visitor asks something, the relevant parts are given to the model along with its rules so it answers from your material rather than from general knowledge. Change a page and the assistant’s answers change with it; there is no retraining step and no waiting.',
          'This is the approach used for the assistant on this site, whose knowledge is a plain-text summary of the company plus the site’s own pages, including its policies. The rules sit beside the knowledge as ordinary text a person can read and change.',
        ],
      },
      {
        type: 'bullets',
        heading: 'What can visitors ask it?',
        intro: 'Anything your content answers. For a typical business site that means:',
        items: [
          'What you do, for whom, and where.',
          'How a project, appointment or order works from first contact to finish.',
          'What is included and what is not, from your published descriptions.',
          'Policies: cancellations, returns, privacy, hours.',
          'How to get in touch, and a way to leave their details right there in the chat.',
          'Whether you are the right fit, answered honestly, including when the answer is no.',
        ],
      },
      {
        type: 'table',
        heading: 'What does the assistant refuse to do?',
        intro: 'Restraint is a feature. These rules are written in plain language and enforced on every message.',
        columns: ['It will not', 'Because'],
        rows: [
          ['Quote a price, estimate or timeline it was not given', 'Those are decided by a person who understands the project'],
          ['Promise results: leads, sales, rankings, savings', 'Nobody can, and a chatbot that does damages your credibility'],
          ['Invent a client, statistic or example', 'Everything it says must trace back to your content'],
          ['Claim to be human', 'Trust, and in some jurisdictions, the law'],
          ['Follow instructions hidden in a visitor’s message', 'Visitors can try to override its rules; it treats such text as data, not commands'],
        ],
      },
      {
        type: 'steps',
        heading: 'How quickly can it be live on my site?',
        intro: 'The steps are short when the content exists. The free offer builds the site and the assistant together.',
        steps: [
          { title: 'Content in', text: 'Your pages, documents and the questions you hear most, or just the form on the signup page if the site is new.' },
          { title: 'Rules agreed', text: 'Tone, scope, what it must never say, when to fetch a person. One page of text you approve.' },
          { title: 'Private test', text: 'You try it with the questions customers actually ask. Weak answers become content fixes.' },
          { title: 'Live, with caps', text: 'The widget goes on every page, with a monthly usage cap and a per-visitor rate limit already set.' },
        ],
      },
      {
        type: 'callout',
        heading: 'Free with a new website, API usage included for a month',
        text: 'HeliumSol will build your website and this assistant together at no charge, and cover the assistant’s API usage for the first month. The exact terms are on the signup page.',
        link: { label: 'Get the free website and assistant', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Is this the same as a chatbot?',
        a: 'A website assistant is a chatbot grounded in your content. "Assistant" is used because it can also be given tools to look things up or take actions; see AI assistant solutions. The free offer includes the answering and lead-capture version.',
      },
      {
        q: 'What does it cost after the free month?',
        a: 'API usage is billed at cost and the rate is confirmed with you in writing before the included month ends. Usage for a typical small business site is small because routine questions are handled by an inexpensive model.',
      },
      {
        q: 'Can I edit what it knows myself?',
        a: 'Yes. The knowledge base is your content plus a plain-text summary; updating either updates the assistant. HeliumSol can do it for you if you prefer.',
      },
      {
        q: 'Does it slow my website down?',
        a: 'The widget loads after the page, so it does not affect how fast your pages appear or how search engines measure them. The site you are reading uses the same approach.',
      },
      {
        q: 'What happens to the conversations?',
        a: 'They are stored in a database you control, and leads go to your inbox or CRM. Your privacy policy describes the assistant, as HeliumSol’s own policy does.',
      },
      {
        q: 'Can it hand off to a real person during the chat?',
        a: 'Yes. When a visitor asks for a person, or the assistant cannot help, your team is notified and can join the conversation or follow up by email or phone, whichever you choose.',
      },
    ],
    related: [
      { label: 'AI assistant solutions', href: '/services/ai-assistant-solutions', note: 'Assistants that look things up and take actions.' },
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'What is in a HeliumSol chatbot build.' },
      { label: 'AI assistant vs chatbot', href: '/blog/ai-assistant-vs-chatbot', note: 'Which one your business needs.' },
      { label: 'Full-stack website development', href: '/services/full-stack-development', note: 'The site the assistant lives on.' },
    ],
    updated: UPDATED,
  },
];

export const LANDING_BY_SLUG = new Map(LANDINGS.map((l) => [l.slug, l]));
