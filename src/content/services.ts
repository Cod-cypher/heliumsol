/**
 * The five service pages. Each entry becomes /services/<slug>, a nav and
 * footer link, a card on /services and a Service + FAQPage + BreadcrumbList
 * set of structured data. See types.ts for the shape.
 *
 * House rules for this copy: no prices, no timelines promised, no client
 * names, no results claims. FAQs explain how pricing and timelines are
 * arrived at and what is included, which is what buyers actually ask.
 */

import type { ServicePage } from './types';
import { SIGNUP_PATH } from '../site';

const UPDATED = '2026-10-12';

export const SERVICES: ServicePage[] = [
  {
    slug: 'full-stack-development',
    name: 'Full-stack development',
    serviceType: 'Full-stack web development',
    title: 'Full-Stack Web Development: Fast Websites & Web Apps',
    description:
      'Full-stack websites and web applications: front end, server, database and integrations, prerendered and fast. Built by HeliumSol and owned by you.',
    h1: 'Full-stack web development for websites and web apps that load fast and convert',
    summary: 'Websites and web applications built front to back: design, front end, server, database and integrations.',
    answer:
      'Full-stack development means HeliumSol builds every layer of a website or web application: the pages a visitor sees, the server logic, the database, and the connections to the tools a business already uses. The result is a site that loads quickly, is indexed properly by search engines, and can grow into a customer portal, booking system or dashboard without being rebuilt.',
    deliverables: [
      'Design and a responsive front end that works on phones first',
      'Server, API and database built to fit the product, not a template',
      'Prerendered pages so search engines and AI tools read the full content',
      'Integrations with the CRM, email, payments or scheduling tools you use',
      'Analytics and lead capture wired in from day one',
      'Deployment, hosting setup and a documented handover: the code is yours',
    ],
    blocks: [
      {
        type: 'prose',
        heading: 'What does "full-stack" actually cover?',
        paragraphs: [
          'A website is at least three things: what the browser shows, what the server does, and where the data lives. A full-stack team owns all three, so a contact form really reaches your inbox, a booking really lands in your calendar, and a change to one layer does not break another.',
          'For HeliumSol that typically means a React front end, a Node server, a Postgres database and whatever your business already runs on: Stripe or a payment provider, a CRM, Google Business Profile, an email service, a scheduling tool. This site is built the same way, and its [AI assistant](/services/ai-assistant-solutions) and [contact form](/contact) run on the same stack we would hand to a client.',
        ],
      },
      {
        type: 'table',
        heading: 'Website, web app, or both?',
        intro: 'The words get used loosely. Here is how we separate them when scoping a project.',
        columns: ['You need', 'What it is', 'Typical examples'],
        rows: [
          ['A website', 'Pages that explain and persuade, with a way to enquire or book', 'Service business sites, clinic sites, agency sites, product launches'],
          ['A web app', 'Logged-in screens where people do work with data', 'Customer portals, dashboards, internal tools, booking back-offices'],
          ['Both', 'A public site and a private app sharing one backend', 'A shop with an admin panel; a marketing site with a client portal'],
        ],
      },
      {
        type: 'steps',
        heading: 'How does a full-stack project run?',
        intro: 'The same four stages as every HeliumSol project, with the detail that matters for a build.',
        steps: [
          { title: 'Discovery', text: 'What the site must do, who it is for, what you already have (brand, content, domain, tools) and what success looks like. Scope and price follow this, not precede it.' },
          { title: 'Design and build in short cycles', text: 'You see working pages early and often. Content, design and code move together so nothing is designed that cannot be built or built that cannot be filled.' },
          { title: 'Launch', text: 'Performance, accessibility and search checks on every page; redirects from any old URLs; analytics and conversion events confirmed live.' },
          { title: 'Grow', text: 'Optional ongoing work: new pages, blog posts, a chatbot, automations, and the measurement that tells you which of them earned their keep.' },
        ],
      },
      {
        type: 'bullets',
        heading: 'Why does the technical build matter for search and for leads?',
        intro: 'Two things decide whether a site brings in enquiries: whether people can find it, and whether it loads fast enough that they stay. Both are engineering decisions.',
        items: [
          'Every page is prerendered to real HTML, so Google, Bing and AI search tools read the whole page without executing JavaScript. [Core Web Vitals explained for business owners](/blog/core-web-vitals-for-business-owners) covers why that matters.',
          'Images ship with explicit sizes in modern formats, fonts are self-hosted, and unused code is removed, so pages stay fast on a phone on a weak connection.',
          'One canonical URL per page, a generated sitemap, structured data and clean redirects, so nothing you publish is invisible or duplicated.',
          'Forms, phone taps and chat conversations are tracked as events, so you can see which pages produce enquiries rather than guessing.',
        ],
      },
      {
        type: 'callout',
        heading: 'Start with a free website',
        text: `If you do not have a site yet, or the one you have needs replacing, HeliumSol will build you one free, together with a knowledge-base chatbot and a month of included hosting, API usage and email. [What the free website includes](${SIGNUP_PATH}/website) lists every page and standard; the terms are on the signup page.`,
        link: { label: 'See the free website and chatbot offer', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'How much does a full-stack website or web app cost?',
        a: 'HeliumSol does not publish prices and does not quote before discovery. The cost depends on the number of pages or screens, whether there is a logged-in area, which integrations are needed and how much content already exists. After a discovery conversation you get a written scope with a fixed price for that scope, and any change to the scope is priced before it is built.',
      },
      {
        q: 'How long does a build take?',
        a: 'A timeline is given with the scope, after discovery. What moves it most is how quickly content and decisions arrive, so the plan names what the team needs from you and when. Work is shown as it progresses rather than at the end.',
      },
      {
        q: 'What is included, and what is not?',
        a: 'Included: design, front end, server and database, the integrations in the scope, analytics, deployment and a handover with documentation. Not included unless scoped: copywriting and photography (though we will advise), ongoing hosting fees charged by the provider, and third-party subscriptions such as a CRM or payment processor.',
      },
      {
        q: 'Do I own the code and the site?',
        a: 'Yes. The repository, the domain and the hosting accounts are set up in your name or transferred to you at handover. There is no proprietary builder you are locked into.',
      },
      {
        q: 'Which technologies do you use?',
        a: 'Most builds use React for the front end, Node for the server and Postgres for the database, with Vite and Tailwind for the build and styling. If a project is better served by a different stack, a headless CMS, or an existing platform such as Shopify, the team will say so during discovery.',
      },
      {
        q: 'Can you work with my existing website instead of rebuilding it?',
        a: 'Often, yes. Performance fixes, new sections, a chatbot, an integration or a migration can all be done on an existing site. The honest answer sometimes is that a rebuild costs less than patching, and you will hear that in discovery rather than after a quote.',
      },
      {
        q: 'What happens after launch?',
        a: 'You can run the site yourself with the handover documentation, or keep HeliumSol on for updates, new pages, content and automation. Support is scoped separately so you only pay for what you use.',
      },
    ],
    related: [
      { label: 'Mobile app development for iOS and Android', href: '/services/mobile-app-development', note: 'When the product belongs in a pocket, not a browser.' },
      { label: 'Add an AI chatbot to your website', href: '/services/ai-chatbots', note: 'Answer questions and capture leads around the clock.' },
      { label: 'Core Web Vitals explained for business owners', href: '/blog/core-web-vitals-for-business-owners', note: 'What Google measures and why it affects enquiries.' },
      { label: 'What the free website includes', href: `${SIGNUP_PATH}/website`, note: 'The pages, features and standards in the free build.' },
      { label: 'Case studies', href: '/case-studies', note: 'Concept examples now; client work as it is published.' },
      { label: 'Workflow automation with n8n', href: '/services/workflow-automation', note: 'Connect the site to the tools behind it.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'mobile-app-development',
    name: 'Mobile app development',
    serviceType: 'Mobile application development',
    title: 'Mobile App Development for iOS and Android',
    description:
      'iOS and Android apps built by HeliumSol: React Native or Flutter when one codebase fits, Swift or Kotlin when it does not, with backend and store release.',
    h1: 'Mobile app development for iOS and Android, with the backend and the launch included',
    summary: 'iOS and Android apps, cross-platform or native, with the server behind them and the app store release handled.',
    answer:
      'HeliumSol designs and builds mobile apps for iOS and Android, chooses between a cross-platform codebase (React Native or Flutter) and native code (Swift or Kotlin) based on what the app has to do, and builds the server and database the app talks to. The engagement includes app store submission, so what you get is an app people can install, not a prototype.',
    deliverables: [
      'Product definition: the screens, flows and data the app needs on day one',
      'A cross-platform or native build, chosen for the app rather than by habit',
      'The backend: authentication, data, notifications and integrations',
      'App Store and Google Play submission, listings and review handling',
      'Crash reporting and analytics so you know how the app is used',
      'A documented codebase you own, with a path for future releases',
    ],
    blocks: [
      {
        type: 'prose',
        heading: 'Do you need a mobile app, or a mobile-friendly web app?',
        paragraphs: [
          'This is the first question in discovery, and the honest answer is sometimes "a web app". If your users mostly arrive from search, do not need the camera, push notifications or offline use, and would not install anything, a responsive [web application](/services/full-stack-development) reaches more people for less.',
          'A native or cross-platform app earns its place when the product lives in the phone: notifications that bring people back, camera and location features, offline work in the field, or a presence in the app stores that customers expect. Those are the cases this page is about.',
        ],
      },
      {
        type: 'table',
        heading: 'Cross-platform or native: how do we choose?',
        intro: 'There is no universal answer. These are the factors that decide it in practice; the full reasoning is in [native vs cross-platform mobile apps](/blog/native-vs-cross-platform-mobile-apps).',
        columns: ['Factor', 'Cross-platform (React Native, Flutter)', 'Native (Swift, Kotlin)'],
        rows: [
          ['One team, two stores', 'One codebase ships to iOS and Android', 'Two codebases, or one platform first'],
          ['Platform-specific features', 'Available through native modules; heavy use adds work', 'First-class access on day one'],
          ['Shares code with a web app', 'React Native shares logic and skills with a React web app', 'No sharing'],
          ['Graphics-heavy or hardware-heavy', 'Fine for most apps; demanding cases need care', 'The default choice'],
          ['Long-term maintenance', 'One codebase to keep current', 'Two sets of updates, two sets of expertise'],
        ],
      },
      {
        type: 'steps',
        heading: 'What does the app project look like from your side?',
        steps: [
          { title: 'Discovery and the first release', text: 'We define the smallest app that is useful to a real user, not the biggest one imaginable. Everything else goes on a list for release two.' },
          { title: 'Design on real screens', text: 'Flows are reviewed on a phone, not in a slide deck. Platform conventions are respected so the app feels at home on each store.' },
          { title: 'Build the app and its backend together', text: 'The server, authentication, data and notifications are built alongside the app, so nothing is mocked at launch.' },
          { title: 'Test, submit, release', text: 'Beta builds go to your testers through TestFlight and Google Play testing tracks, then the store submissions and any review questions are handled for you.' },
        ],
      },
      {
        type: 'bullets',
        heading: 'What usually goes wrong in app projects, and how do we avoid it?',
        items: [
          'Scope grows until nothing ships: the first release is written down and defended; later ideas are logged, not lost.',
          'The backend is an afterthought: it is scoped with the app, because an app without a reliable server is a demo.',
          'Store review surprises: privacy labels, sign-in rules, permissions copy and test accounts are prepared before submission, not after a rejection.',
          'No one can measure the result: crash reporting and analytics are built in, so you can see retention and failures, not just downloads.',
          'The app cannot be updated without the original team: the codebase, store accounts and signing keys are yours and documented.',
        ],
      },
      {
        type: 'callout',
        heading: 'Add an assistant inside the app',
        text: 'Apps that answer questions, take bookings or support customers often benefit from the same knowledge-base assistant HeliumSol builds for websites, embedded in the app and grounded in your content.',
        link: { label: 'How AI assistant solutions work', href: '/services/ai-assistant-solutions' },
      },
    ],
    faq: [
      {
        q: 'How much does it cost to build a mobile app?',
        a: 'HeliumSol prices an app after discovery, with a written scope and a fixed price for that scope. The biggest drivers are the number of screens and flows, whether a backend has to be built or already exists, how many integrations there are, and whether both platforms ship at once. Prices are never published or guessed up front.',
      },
      {
        q: 'How long does an app take to build?',
        a: 'The timeline comes with the scope and depends on the first release you choose. Keeping that release small is the single biggest lever on time to launch; the team will push for that in discovery.',
      },
      {
        q: 'What is included in the price?',
        a: 'Design, the app for the platforms in scope, the backend the app needs, app store submission and release, crash reporting and analytics, and a documented handover. Store developer account fees, hosting charges and third-party services such as push or maps providers are paid directly by you.',
      },
      {
        q: 'Should I build for iOS and Android at the same time?',
        a: 'Only if your users are genuinely split. Many first releases ship on one platform to learn faster; a cross-platform codebase keeps the second platform cheap to add. This is decided with you in discovery, based on where your customers are.',
      },
      {
        q: 'Who owns the app and the store accounts?',
        a: 'You do. The Apple Developer and Google Play accounts are created in your business name, the source code is in a repository you control, and signing credentials are handed over securely.',
      },
      {
        q: 'Can you take over an existing app?',
        a: 'Usually, after a short code review to see what state it is in. Sometimes the honest recommendation is a rebuild on a maintainable foundation; you get that assessment before any quote.',
      },
      {
        q: 'Do you handle updates after launch?',
        a: 'Yes, as a separately scoped arrangement: operating system updates, store policy changes, new features and fixes. Or your own team can take over using the handover documentation.',
      },
    ],
    related: [
      { label: 'Native vs cross-platform mobile apps: how to choose', href: '/blog/native-vs-cross-platform-mobile-apps', note: 'The decision explained with vendor documentation.' },
      { label: 'Full-stack web development', href: '/services/full-stack-development', note: 'When a web app reaches more people than a store listing.' },
      { label: 'AI assistant solutions', href: '/services/ai-assistant-solutions', note: 'An assistant inside the app, grounded in your content.' },
      { label: 'AI customer support chatbot', href: '/ai-customer-support-chatbot', note: 'Support inside the app or on the site, with real handoff.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'ai-chatbots',
    name: 'AI chatbots',
    serviceType: 'AI chatbot development',
    title: 'AI Chatbot Development: Knowledge-Base Chatbots',
    description:
      'Chatbots grounded in your own content that answer questions, capture leads and hand off to a person. The assistant on this site is a working example.',
    h1: 'AI chatbot development: a chatbot that answers from your content and hands off to a person',
    summary: 'Chatbots grounded in your own knowledge base that answer questions, capture leads and escalate to a human.',
    answer:
      'HeliumSol builds AI chatbots that answer only from material you approve: your pages, service descriptions, price lists and documents. They answer common questions around the clock, collect a name and contact details when a visitor wants to go further, and hand the conversation to a person when asked or when they cannot help. The chatbot on this site is one of them, running live rather than as a mockup.',
    deliverables: [
      'A knowledge base built from your website, documents and FAQs, reviewed with you',
      'A chatbot persona and rules written in plain language: what it may and may not say',
      'Lead capture that reaches your inbox, CRM or sheet, with the conversation attached',
      'Human handoff: a person can join the chat or receive it by email',
      'A rate limit and monthly usage cap so there is no runaway API bill',
      'A chat widget for your website, or deployment to the channel you use',
      'A monthly transcript review in the first weeks to tighten answers',
    ],
    blocks: [
      {
        type: 'prose',
        heading: 'What is a knowledge-base chatbot, and how is it different from a generic AI chat?',
        paragraphs: [
          'A generic AI chat box will answer anything, including things about your business that are wrong. A knowledge-base chatbot is given your content and told, in writing, to answer from that and nothing else: your services, your process, your hours, your policies. When the answer is not in the material it says so and offers a person instead of improvising.',
          'The rules matter as much as the content. The assistant on this site, for example, is told never to quote a price, never to promise a result and never to invent a client. Those rules are what let a business put an AI in front of customers without worrying about what it will say.',
        ],
      },
      {
        type: 'bullets',
        heading: 'What can a chatbot do for a business?',
        items: [
          'Answer the questions that fill your inbox and voicemail: hours, areas served, what is included, how to get started.',
          'Qualify an enquiry with one question at a time, then capture a name, email and phone so a person can follow up.',
          'Book or request appointments by handing a visitor to your scheduling link at the right moment.',
          'Support existing customers with how-to answers drawn from your documentation.',
          'Escalate: when a visitor asks for a person, a person is notified and can join or reply, with the full transcript.',
          'Run on your website, and on other channels where a chat interface exists, with the same knowledge base.',
        ],
      },
      {
        type: 'steps',
        heading: 'How is a chatbot built and launched?',
        steps: [
          { title: 'Gather the knowledge', text: 'Your site, documents, FAQs and the questions your team answers every week. Gaps are written up together, in your words.' },
          { title: 'Write the rules', text: 'Persona, tone, what it must never do, when it must offer a person. These are reviewed with you as text, not buried in code.' },
          { title: 'Build and connect', text: 'The chatbot, the lead capture, the handoff route, usage caps and the widget. Everything is tested against real questions before it goes live.' },
          { title: 'Launch and tune', text: 'Transcripts are reviewed in the first weeks. Wrong or weak answers become knowledge-base fixes, not patches to the model.' },
        ],
      },
      {
        type: 'table',
        heading: 'What does a chatbot cost to run?',
        intro: 'Build cost is quoted after discovery. Running cost is mostly the AI provider’s API usage, which is public and small per conversation. The full breakdown, with current published prices, is in [what does an AI chatbot cost](/blog/what-does-an-ai-chatbot-cost).',
        columns: ['Cost', 'Who charges it', 'How HeliumSol keeps it predictable'],
        rows: [
          ['Model API usage', 'The AI provider, per token', 'A small model for routine answers, a monthly token cap, and a rate limit per visitor'],
          ['Hosting', 'Your hosting provider', 'The chatbot runs on the same server as your website; no extra service to pay for'],
          ['Knowledge updates', 'HeliumSol, if you want help', 'Content changes are text edits; you can make many yourself'],
        ],
      },
      {
        type: 'callout',
        heading: 'Get the chatbot free, with a website',
        text: `The free offer includes a knowledge-base chatbot on a new website, with hosting, API usage and email covered for the first month. [What the free chatbot includes](${SIGNUP_PATH}/chatbot) spells out its knowledge, rules and limits. It is the fastest way to see one answering your customers.`,
        link: { label: 'Claim the free website and chatbot', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'How much does an AI chatbot cost?',
        a: 'Two costs: the build, which HeliumSol quotes after discovery based on how much knowledge there is to prepare, which channels it runs on and what it connects to; and the running cost, which is mostly the AI provider’s per-token API pricing. Published API prices make the running cost small per conversation, and a monthly cap keeps it bounded. Specific numbers are only given by a person after discovery.',
      },
      {
        q: 'How long does it take to launch a chatbot?',
        a: 'It depends mainly on how ready your content is. A business with a clear website and written FAQs is faster than one where the answers live in someone’s head. The timeline is set with the scope after discovery.',
      },
      {
        q: 'Will it make things up?',
        a: 'It is built not to: it answers from your approved content, is instructed in writing to say when it does not know, and offers a person instead. No system is perfect, which is why transcripts are reviewed after launch and the knowledge base is corrected where an answer was weak.',
      },
      {
        q: 'Which AI model does it use?',
        a: 'A current model from a major provider, chosen for the job: a small, inexpensive model handles routine questions well and keeps running costs low. The choice is explained in your scope and can change as models improve, without rebuilding the chatbot.',
      },
      {
        q: 'What happens when a visitor wants a human?',
        a: 'The chatbot offers a person at any point and whenever it cannot help. Your team is notified with the transcript and can join the conversation live or reply by email or phone, depending on how you want it set up.',
      },
      {
        q: 'Does it work on channels other than my website?',
        a: 'The knowledge base and rules are channel-independent. The website widget is standard; other channels are scoped case by case, depending on what interface they offer.',
      },
      {
        q: 'What do I need to provide?',
        a: 'Your content: the website, any documents, price lists if you want them answered, and the questions you hear most. Plus decisions on tone and on what the chatbot must not discuss. The team helps draft all of it.',
      },
      {
        q: 'Is my customers’ data safe?',
        a: 'Conversations are stored in a database you control, lead details go only where you direct them, and the AI provider’s API terms apply to message content. The privacy policy on your site is updated to describe the chatbot, as HeliumSol’s own policy does.',
      },
    ],
    related: [
      { label: 'AI chatbot for small business', href: '/ai-chatbot-for-small-business', note: 'What it can and cannot do for a small team.' },
      { label: 'AI customer support chatbot', href: '/ai-customer-support-chatbot', note: 'Deflection without dead ends: grounding and handoff.' },
      { label: 'Lead generation chatbot', href: '/lead-generation-chatbot', note: 'Qualify, capture and route enquiries.' },
      { label: 'AI assistant for your website', href: '/website-ai-assistant', note: 'Trained on your site, free with a new one.' },
      { label: 'Chatbot pricing', href: '/chatbot-pricing', note: 'What you pay, and what is free for founding partners.' },
      { label: 'Free AI chatbot for your website', href: '/free-ai-chatbot-for-website', note: 'Built for you, free for founding partners.' },
      { label: 'What does an AI chatbot cost?', href: '/blog/what-does-an-ai-chatbot-cost', note: 'Build and running costs, with public API prices.' },
      { label: 'What the free chatbot includes', href: `${SIGNUP_PATH}/chatbot`, note: 'Knowledge base, rules, lead capture and limits.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'ai-assistant-solutions',
    name: 'AI assistant solutions',
    serviceType: 'AI assistant development',
    title: 'AI Assistant Solutions: Answer, Act and Hand Off',
    description:
      'AI assistants that look things up in your systems, take approved actions like booking or logging, and hand off to people. Permissioned, logged, in the loop.',
    h1: 'AI assistant solutions: assistants that answer, take approved actions and know when to stop',
    summary: 'Assistants connected to your systems that can look things up, take approved actions and escalate to people.',
    answer:
      'An AI assistant solution is a chatbot that can also do things: check an order, create a booking, log a support request, or draft a reply, by calling tools your business approves. HeliumSol builds these for customer-facing websites and apps and for internal teams, with every action permissioned, logged, and backed by a route to a person. The difference from a plain chatbot is explained in [AI assistant vs chatbot](/blog/ai-assistant-vs-chatbot).',
    deliverables: [
      'Discovery of the tasks worth automating, and the ones that must stay with people',
      'A grounded assistant with a knowledge base and written rules, as with every HeliumSol chatbot',
      'Tool connections to your systems: CRM, calendar, orders, ticketing, spreadsheets, APIs',
      'Permissions and approvals: which actions run automatically and which wait for a human',
      'An audit log of every action the assistant takes',
      'Workflow automation behind the assistant where it makes sense, with n8n',
      'Deployment on your website, in your app, or as an internal tool for staff',
    ],
    blocks: [
      {
        type: 'prose',
        heading: 'What makes something an assistant rather than a chatbot?',
        paragraphs: [
          'A chatbot answers. An assistant answers and acts. Technically, the model is given a set of tools, each described in plain language, and can ask your application to run one: look up a booking by email, create a calendar event, add a row to a sheet, open a ticket. Your code runs the tool and returns the result, and the assistant carries on the conversation with real information instead of a guess. The major providers document this under names like tool use and function calling.',
          'That capability is only as safe as the permissions around it. HeliumSol separates read actions (look things up) from write actions (change things), decides with you which write actions run without a human and which wait for approval, and logs every call. An assistant that can issue refunds without a person in the loop is a liability, not a feature.',
        ],
      },
      {
        type: 'table',
        heading: 'Where do assistants earn their keep?',
        columns: ['Setting', 'What the assistant does', 'What stays with people'],
        rows: [
          ['Customer-facing website', 'Answers, checks availability, books, captures and routes leads', 'Pricing beyond the published list; complaints; anything the rules exclude'],
          ['Inside a mobile or web app', 'Answers from your docs, retrieves the user’s own data, starts common tasks', 'Account changes with financial impact; disputes'],
          ['Internal team tool', 'Drafts replies, summarises tickets, fills forms, searches internal knowledge', 'Sending anything external; decisions with policy weight'],
          ['Operations and automation', 'Triages inbound messages and feeds n8n workflows with structured data', 'Approvals, exceptions, and anything the workflow flags'],
        ],
      },
      {
        type: 'steps',
        heading: 'How does HeliumSol build an assistant?',
        steps: [
          { title: 'Map the tasks', text: 'Which questions and tasks arrive most, which have a clear rule, and which need judgement. The assistant gets the first group; people keep the rest.' },
          { title: 'Ground it', text: 'Knowledge base, persona and rules, exactly as for a chatbot. An assistant that acts must first be one that answers correctly.' },
          { title: 'Connect tools carefully', text: 'Each tool is small, named for what it does, and scoped to the minimum data and permission. Write actions get an approval step until trust is earned.' },
          { title: 'Observe and expand', text: 'Logs and transcripts show what the assistant did and where it hesitated. Tools and permissions are widened deliberately, based on evidence.' },
        ],
      },
      {
        type: 'bullets',
        heading: 'What does HeliumSol insist on?',
        items: [
          'A route to a person in every conversation, and a human fallback when the assistant cannot help.',
          'No action without a log entry you can read.',
          'Rules in plain language you have reviewed: never quote prices it was not given, never promise outcomes, never claim to be human.',
          'Usage caps and rate limits so a busy day or a malicious visitor cannot run up the bill.',
          'Your data stays in systems you control; the assistant reaches into them through narrow, revocable connections.',
        ],
      },
      {
        type: 'callout',
        heading: 'Automate the work behind the conversation',
        text: 'Most assistants are more useful with a workflow behind them: a captured lead that lands in the CRM and triggers a follow-up, a booking that updates three systems at once. HeliumSol builds those with n8n.',
        link: { label: 'Workflow automation with n8n', href: '/services/workflow-automation' },
      },
    ],
    faq: [
      {
        q: 'How much does an AI assistant solution cost?',
        a: 'It is quoted after discovery. The main drivers are how many systems the assistant connects to, how many actions it can take and how much approval logic each needs, plus the knowledge preparation any chatbot requires. Running costs are the model’s API usage and whatever your own systems charge for API access; HeliumSol caps the former and tells you about the latter up front.',
      },
      {
        q: 'How long does it take?',
        a: 'Longer than a plain chatbot because every tool is built, tested and permissioned. The scope sets the timeline; shipping with a small set of safe actions and expanding later is usually the fastest way to real value.',
      },
      {
        q: 'What is included?',
        a: 'Discovery, knowledge base and rules, the tool connections in scope, permissions and approval steps, logging, deployment on the agreed channel, and a review period after launch. Third-party API fees and your own systems’ subscriptions are not included.',
      },
      {
        q: 'Can the assistant make mistakes with real consequences?',
        a: 'That is the risk this service is designed around. Actions are scoped as narrowly as possible, anything with money or legal weight waits for a human, and every action is logged. You decide, with the team, where the line sits, and the line can move as trust builds.',
      },
      {
        q: 'Which systems can it connect to?',
        a: 'Anything with an API or a reliable export: common CRMs, calendars, email, ticketing tools, spreadsheets, e-commerce and payment platforms, and custom databases. Where a direct connection does not exist, an n8n workflow usually bridges it.',
      },
      {
        q: 'Is this the same as an "AI agent"?',
        a: 'Broadly, yes: an assistant that can use tools and complete multi-step tasks is often called an agent. HeliumSol avoids the word because it suggests autonomy; the assistants it builds act within explicit permissions and keep people in the loop.',
      },
      {
        q: 'Do we need a chatbot first?',
        a: 'Not necessarily, but an assistant is a chatbot with tools, so the grounding work is the same. Many businesses start with the chatbot in the free offer and add actions once the answers are proven.',
      },
    ],
    related: [
      { label: 'AI assistant vs chatbot: which does your business need?', href: '/blog/ai-assistant-vs-chatbot', note: 'The difference, with vendor documentation.' },
      { label: 'AI assistant for your website', href: '/website-ai-assistant', note: 'A knowledge-base assistant trained on your site.' },
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'The answering layer every assistant starts from.' },
      { label: 'AI customer support chatbot', href: '/ai-customer-support-chatbot', note: 'Where lookups and actions matter most.' },
      { label: 'Appointment booking chatbot', href: '/appointment-booking-chatbot', note: 'The most common action: booking, confirmed properly.' },
      { label: 'Workflow automation with n8n', href: '/services/workflow-automation', note: 'The workflows that run behind an assistant.' },
      { label: 'What can you automate with n8n?', href: '/blog/what-can-you-automate-with-n8n', note: 'Twelve workflows, including the human-fallback pattern.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'workflow-automation',
    name: 'Workflow automation',
    serviceType: 'Workflow automation with n8n',
    title: 'Workflow Automation with n8n: Connect Your Tools',
    description:
      'n8n automations that connect the tools you already use: leads to CRM, bookings to calendars, documents to folders, alerts to chat, with humans in the loop.',
    h1: 'Workflow automation with n8n: connect the tools you already use and remove the busywork',
    summary: 'n8n automations that move data between your tools, with approvals and alerts where a person should stay involved.',
    answer:
      'Workflow automation is the connective tissue between the tools a business already pays for: when a form is submitted, the lead goes into the CRM, a thank-you email goes out, the team is alerted in chat and a follow-up task is created, with no one copying and pasting. HeliumSol builds these workflows with n8n, an automation platform that can be self-hosted on your own server, and keeps a person in the loop at every step where judgement matters.',
    deliverables: [
      'A map of your current manual steps and which ones are worth automating first',
      'n8n workflows built, tested and documented, on n8n Cloud or self-hosted',
      'Connections to your CRM, forms, email, calendar, sheets, accounting and chat tools',
      'Error handling and alerts, so a failed step is noticed rather than silently lost',
      'Approval steps for anything that should wait for a human',
      'AI steps where they help: summarising, classifying, drafting, extracting',
      'A handover so your team can read, run and adjust the workflows',
    ],
    blocks: [
      {
        type: 'prose',
        heading: 'What is n8n, and why use it rather than a point-and-click tool?',
        paragraphs: [
          'n8n is a workflow automation platform. Workflows are built visually from nodes: a trigger (a form submission, a new email, a schedule), steps that transform data, and actions in the apps you use. Its documentation describes it as a fair-code licensed tool that combines AI features with business process automation, and it can be run on n8n’s cloud or on a server you control.',
          'HeliumSol uses it because it fits real businesses: hundreds of built-in integrations, a plain HTTP node for anything without one, AI steps that connect to the major model providers, and the option to self-host so your data and your automations stay with you. Where a simpler tool is enough, you will be told so; where a workflow needs real logic, n8n handles it.',
        ],
      },
      {
        type: 'bullets',
        heading: 'What do businesses automate first?',
        intro: 'These are the workflows that pay for themselves quickest, in roughly the order we see them requested.',
        items: [
          'Lead handling: form or chat enquiry in, CRM record created, acknowledgement sent, team alerted, follow-up task scheduled.',
          'Bookings: a new appointment updates the calendar, the CRM and the customer, and reminders go out on schedule.',
          'Documents: quotes, invoices and reports generated from a template and filed where they belong.',
          'Inbox triage: incoming email classified, routed and summarised, with the urgent ones flagged in chat.',
          'Reporting: numbers pulled from several tools into one sheet or dashboard every morning.',
          'Content and listings: a new product, post or review published to each channel from one source.',
        ],
      },
      {
        type: 'steps',
        heading: 'How does an automation project run?',
        steps: [
          { title: 'Map the work', text: 'A short session walking through who does what, in which tool, how often. The output is a list of candidate workflows ranked by time saved and risk.' },
          { title: 'Build the first workflow', text: 'One workflow, end to end, in n8n, with test data. You see it run before it touches live systems.' },
          { title: 'Add safety', text: 'Error alerts, retries, approval steps for anything irreversible, and a log you can read.' },
          { title: 'Hand over and extend', text: 'Documentation and a walkthrough, then the next workflow on the list, or your team takes it from here.' },
        ],
      },
      {
        type: 'table',
        heading: 'n8n Cloud or self-hosted?',
        columns: ['Option', 'Good for', 'What to know'],
        rows: [
          ['n8n Cloud', 'Teams that want nothing to maintain', 'Hosted by n8n on a monthly plan; HeliumSol sets it up and builds in it'],
          ['Self-hosted', 'Businesses that want data on their own server, or already have one', 'Runs alongside your website or on a small server; HeliumSol installs, secures and updates it'],
        ],
      },
      {
        type: 'callout',
        heading: 'Put an assistant in front of the workflow',
        text: 'A workflow that needs structured input is a natural fit for an AI assistant that collects it in conversation, then hands the clean data to n8n. HeliumSol builds both ends.',
        link: { label: 'AI assistant solutions', href: '/services/ai-assistant-solutions' },
      },
    ],
    faq: [
      {
        q: 'How much does workflow automation cost?',
        a: 'Workflows are scoped and priced individually after the mapping session, so you can start with one. The price reflects the number of systems involved, the logic in between and how much safety (approvals, alerts, retries) the workflow needs. n8n’s own cloud plans or your hosting costs are paid directly by you and stated up front.',
      },
      {
        q: 'How long does it take to automate a process?',
        a: 'A single well-defined workflow is usually one of the shorter projects HeliumSol does; a set of connected workflows across many tools takes longer. The mapping session gives you an honest estimate per workflow before anything is built.',
      },
      {
        q: 'What is included?',
        a: 'Mapping, the workflows in scope built and tested, error handling and alerts, approval steps where agreed, documentation and a handover. Subscriptions for n8n Cloud or for the apps being connected are not included.',
      },
      {
        q: 'Do I need technical staff to keep it running?',
        a: 'No. Workflows are documented and visual; many adjustments are a matter of changing a value in a node. HeliumSol can also look after them under a support arrangement, and alerts tell you quickly if something breaks.',
      },
      {
        q: 'Can a workflow break something in my systems?',
        a: 'Any automation that writes to a system can, which is why workflows are tested with test data first, irreversible actions get an approval step, and every run is logged. The mapping session is also where the team tells you which processes are better left manual.',
      },
      {
        q: 'Can you add AI to a workflow?',
        a: 'Yes. n8n connects to the major model providers, so a workflow can classify an email, extract fields from a document, summarise a thread or draft a reply as one step among others, with a human fallback when the model is unsure.',
      },
      {
        q: 'What if a tool I use has no n8n integration?',
        a: 'Most tools expose an API, and n8n’s HTTP Request node can call any of them. For tools with no API, an export, a shared folder or an email can usually be used as the bridge.',
      },
    ],
    related: [
      { label: 'What can you automate with n8n? Real workflows explained', href: '/blog/what-can-you-automate-with-n8n', note: 'Examples with links to the n8n documentation.' },
      { label: 'AI assistant solutions', href: '/services/ai-assistant-solutions', note: 'Assistants that collect input and trigger workflows.' },
      { label: 'Lead generation chatbot', href: '/lead-generation-chatbot', note: 'Where many automations start: a captured enquiry.' },
      { label: 'Full-stack development', href: '/services/full-stack-development', note: 'The website and backend the workflows connect to.' },
    ],
    updated: UPDATED,
  },
];

export const SERVICE_BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));
