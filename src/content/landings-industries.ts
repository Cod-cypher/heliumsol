/**
 * Industry chatbot pages. Each one is structured around what visitors in that
 * industry actually ask and the rules that apply there, so no two read alike.
 * Every page leads to the Founding Partner Program signup.
 */

import type { LandingPage } from './types';
import { SIGNUP_PATH } from '../site';
import { PROGRAM_PATH } from './program';

const UPDATED = '2026-10-22';

export const INDUSTRY_LANDINGS: LandingPage[] = [
  {
    slug: 'ai-chatbot-for-real-estate',
    name: 'AI chatbot for real estate',
    keyword: 'AI chatbot for real estate',
    parentService: 'ai-chatbots',
    group: 'industry',
    title: 'AI Chatbot for Real Estate Agents and Brokerages',
    description:
      'An AI chatbot for real estate websites: answers buyer, seller and renter questions from your content, qualifies the enquiry and books viewings or valuations.',
    h1: 'An AI chatbot for real estate that qualifies buyers and sellers without overstepping',
    answer:
      'A real estate chatbot answers the questions buyers, sellers and renters ask before they are ready to call: how your process works, which areas you cover, what a valuation involves, how viewings are arranged. It captures what the person is looking for and how to reach them, and passes that to an agent quickly. HeliumSol builds it on your own content, with rules that keep it within fair housing law and away from advice an agent should give.',
    blocks: [
      {
        type: 'table',
        heading: 'Who visits a real estate website, and what should the chatbot do for each?',
        columns: ['Visitor', 'What they ask', 'What the chatbot does'],
        rows: [
          ['Buyer', 'Areas you cover, how viewings work, what to do before making an offer', 'Answers from your content, asks budget range, areas and timing, offers a viewing request'],
          ['Seller', 'How a valuation works, how listing with you works, your fees if you publish them', 'Explains your process, collects the address and timing, books a valuation call'],
          ['Renter', 'Availability, how to apply, what documents are needed', 'Answers from your listings and process pages, collects details for the lettings team'],
          ['Landlord', 'Management services and what they include', 'Explains your services and captures the enquiry'],
        ],
      },
      {
        type: 'bullets',
        heading: 'What rules does a real estate chatbot need?',
        intro: 'Real estate has firmer lines than most industries. These are written into the chatbot’s rules and tested before launch.',
        items: [
          'Fair housing. In the US, the Fair Housing Act prohibits discrimination in housing based on race, color, religion, sex, national origin, familial status and disability, and state and local laws can add more. The chatbot never describes areas or buyers in those terms and never steers anyone toward or away from a neighbourhood.',
          'No valuations or price predictions. It explains how your valuation works and books one with an agent.',
          'No legal, tax or mortgage advice. It points people to the professionals who give it.',
          'Listing details only from your data. If a property’s status is not in the data, it sends the visitor to the listing page or an agent rather than guess.',
          'It says it is an AI assistant when asked, and fetches an agent when asked.',
        ],
      },
      {
        type: 'prose',
        heading: 'Can it answer questions about specific listings?',
        paragraphs: [
          'Yes, when the listing information is in its knowledge base or it can read your listing data through an approved connection. It re-reads when listings change, so a sold property is not offered as available.',
          'If your listings come from an MLS through an IDX provider, what the chatbot may show depends on that provider’s terms. The team checks them before the build, and where display is restricted the chatbot links to your listing pages instead of repeating the data.',
        ],
      },
      {
        type: 'steps',
        heading: 'How does an enquiry reach an agent?',
        steps: [
          { title: 'Capture', text: 'Buyer, seller or renter; areas; budget or property; timing; how to reach them.' },
          { title: 'Summarise', text: 'A short summary the visitor confirms, so the agent starts with the facts.' },
          { title: 'Route', text: 'To the right agent or team inbox, or into your CRM, with the conversation attached. See the [lead generation chatbot](/lead-generation-chatbot) for routing options.' },
          { title: 'Set expectations', text: 'The visitor is told who will be in touch and how, so they do not call three other agencies meanwhile.' },
        ],
      },
      {
        type: 'callout',
        heading: 'A real estate chatbot, free for founding partners',
        text: `Agencies and independent agents can apply to the [Founding Partner Program](${PROGRAM_PATH}) for a free chatbot build, with a new website if you need one. Hosting and API usage are free for the first month.`,
        link: { label: 'Apply for a founding place', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Can the chatbot book viewings?',
        a: 'It can send the visitor to your viewing booking link, or collect preferred times and send a viewing request to the agent. Direct calendar booking is possible where your calendar has an API.',
      },
      {
        q: 'Can it give a home valuation?',
        a: 'No. It explains how your valuation works, collects the address and timing, and books a valuation with an agent. Price estimates come from people, not from the chatbot.',
      },
      {
        q: 'How does it handle questions about who lives in an area?',
        a: 'It does not describe neighbourhoods in terms of protected characteristics. It offers factual information you publish, such as transport or amenities, and suggests the visitor speak with an agent for anything else.',
      },
      {
        q: 'Does it work after hours?',
        a: 'Yes. It answers and captures enquiries around the clock, and tells visitors when an agent will be back in touch.',
      },
      {
        q: 'Can it send leads to our CRM?',
        a: 'If your CRM has an API, the enquiry can be created there with the transcript, directly or through an automation workflow. Email is the fallback.',
      },
      {
        q: 'Does it work for lettings and property management?',
        a: 'Yes. Renter and landlord conversations are set up separately from sales, with their own questions and their own destination.',
      },
    ],
    related: [
      { label: 'Lead generation chatbot', href: '/lead-generation-chatbot', note: 'How enquiries are qualified and routed.' },
      { label: 'Appointment booking chatbot', href: '/appointment-booking-chatbot', note: 'Viewings and valuations, booked correctly.' },
      { label: 'AI chatbot for home service businesses', href: '/ai-chatbot-for-home-services', note: 'The trades side of property.' },
      { label: 'Chatbot pricing', href: '/chatbot-pricing', note: 'What a chatbot costs to build and run.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'ai-chatbot-for-home-services',
    name: 'AI chatbot for home services',
    keyword: 'AI chatbot for home service businesses',
    parentService: 'ai-chatbots',
    group: 'industry',
    title: 'AI Chatbot for Plumbers, HVAC and Home Services',
    description:
      'An AI chatbot for plumbers, electricians, HVAC, cleaners and contractors: checks your service area, separates emergencies from quotes, and collects job details.',
    h1: 'An AI chatbot for home service businesses that sorts emergencies from quotes and gets the job details right',
    answer:
      'For plumbers, electricians, HVAC, cleaning, landscaping and other trades, a website chatbot does three jobs: confirms whether you cover the visitor’s area, separates urgent jobs from routine quote requests, and collects the details you need to price the work. Urgent requests are shown your phone number straight away and alert whoever is on call; routine ones arrive in your inbox ready to quote.',
    blocks: [
      {
        type: 'steps',
        heading: 'How does it handle an emergency versus a quote?',
        steps: [
          { title: 'Is it urgent?', text: 'Asked once, plainly. Water leaking, no heat, power out. For anything dangerous, such as a gas smell, it shows the safety message you approve before anything else.' },
          { title: 'Do you cover them?', text: 'A ZIP or postcode check against your service area. Outside it, the visitor is told kindly and early.' },
          { title: 'What is the job?', text: 'The same questions you would ask on the phone: what is happening, where, how long, any access issues.' },
          { title: 'How to reach them', text: 'Name, phone, address or ZIP, and the best time to call.' },
          { title: 'Hand off', text: 'Urgent jobs: your number on screen and an alert to whoever is on call. Routine jobs: a summary in your inbox or job software.' },
        ],
      },
      {
        type: 'table',
        heading: 'What should it ask for each kind of job?',
        intro: 'Starting points. You replace them with the questions you actually ask, and the chatbot asks them one at a time.',
        columns: ['Job type', 'Questions it asks'],
        rows: [
          ['Plumbing repair', 'What is happening, where in the property, whether the water is shut off, how long it has been going on'],
          ['Heating and cooling', 'Heating or cooling, roughly how old the system is, what it is doing, any error code on the display'],
          ['Electrical', 'What stopped working, part or all of the property, any burning smell or sparks (treated as urgent)'],
          ['Cleaning', 'Property type and size, one-off or recurring, preferred days'],
          ['Landscaping and building work', 'Scope of the job, rough size, timing, whether materials are already chosen'],
        ],
      },
      {
        type: 'bullets',
        heading: 'What will it not do?',
        items: [
          'Quote a price, unless you publish set prices and ask it to repeat them.',
          'Promise an arrival time. It says when you will call back, which you control.',
          'Diagnose a fault as certain. It describes what it was told and leaves the diagnosis to your technician.',
          'Give repair instructions for gas or electrical work.',
          'Answer the phone. It is a website chat; it does not take calls, so your number stays prominent for people who prefer to ring.',
        ],
      },
      {
        type: 'prose',
        heading: 'Does it work with my job management software?',
        paragraphs: [
          'Many field service tools have an API, and where yours does, an enquiry can be created there directly or through a [workflow automation](/services/workflow-automation) with the conversation attached. Where it does not, the enquiry arrives by email and the on-call alert by text message to your own team.',
          'If you want visitors to book a slot themselves, see the [appointment booking chatbot](/appointment-booking-chatbot), which explains the three levels of booking and when each makes sense for a trade business.',
        ],
      },
      {
        type: 'callout',
        heading: 'Free for founding partners',
        text: `Trades and home service businesses are a strong fit for the [Founding Partner Program](${PROGRAM_PATH}): a free website with a service area page and a chatbot that captures jobs, with hosting and API usage free for the first month.`,
        link: { label: 'Apply for a founding place', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Can it tell customers my prices?',
        a: 'Only prices you publish and approve, such as a call-out fee. Everything else is explained as "we quote after seeing the job" and the details go to you.',
      },
      {
        q: 'Does it handle after-hours emergencies?',
        a: 'On your website, yes: it recognises urgent jobs, shows your emergency number and can alert whoever is on call. It does not answer phone calls.',
      },
      {
        q: 'Can it check whether I cover someone’s area?',
        a: 'Yes, from the list of ZIP codes, postcodes or towns you give it. Visitors outside the area are told early so neither side wastes time.',
      },
      {
        q: 'Can customers book a visit through the chat?',
        a: 'It can send them to your booking link or collect a booking request for you to confirm. Direct booking into your schedule is possible where your software has an API.',
      },
      {
        q: 'What if it records the job details wrong?',
        a: 'It reads a summary back for the customer to confirm before sending, and the full conversation is attached so your team can see exactly what was said.',
      },
      {
        q: 'Will it work on phones?',
        a: 'Yes. Most people looking for a trade are on a phone, so the chat and the call button are both designed for small screens.',
      },
    ],
    related: [
      { label: 'Appointment booking chatbot', href: '/appointment-booking-chatbot', note: 'Let customers book a visit, safely.' },
      { label: 'AI chatbot for small business', href: '/ai-chatbot-for-small-business', note: 'What a chatbot can and cannot do for a small team.' },
      { label: 'Lead generation chatbot', href: '/lead-generation-chatbot', note: 'Capturing and routing every enquiry.' },
      { label: 'AI chatbot for real estate', href: '/ai-chatbot-for-real-estate', note: 'Buyers, sellers and renters.' },
    ],
    updated: UPDATED,
  },
  {
    slug: 'ai-chatbot-for-law-firms',
    name: 'AI chatbot for law firms',
    keyword: 'AI chatbot for law firms',
    parentService: 'ai-chatbots',
    group: 'industry',
    title: 'AI Chatbot for Law Firms: Intake Without Legal Advice',
    description:
      'An AI chatbot for law firm websites that answers practice area and process questions, runs a first intake, and never gives legal advice or predicts an outcome.',
    h1: 'An AI chatbot for law firms that handles intake questions and never gives legal advice',
    answer:
      'A law firm chatbot answers what prospective clients ask before they call: which practice areas you handle, where you practise, how consultations work and what to bring. It runs a short intake, collects contact details and the basic facts your team needs to check for conflicts, and passes the enquiry to the firm. HeliumSol builds it with strict rules: it does not give legal advice, assess a case, or suggest an outcome.',
    blocks: [
      {
        type: 'bullets',
        heading: 'Why does a law firm chatbot need stricter rules?',
        items: [
          'No legal advice. Answers come only from what the firm publishes about its services and process. Questions about a person’s own situation get one reply: that is for a lawyer, and here is how to reach one.',
          'No implied relationship. A clear notice says that chatting does not make the visitor a client, and the chatbot never says the firm will take the matter.',
          'Confidentiality. Visitors are asked not to share confidential details beyond what intake needs, because a website chat is not a privileged conversation with a lawyer.',
          'Advertising rules. Rules on lawyer advertising vary by jurisdiction, so the chatbot repeats only statements the firm already publishes, and the firm approves its wording.',
          'No outcomes. It never estimates chances, compensation or how long a matter will take.',
        ],
      },
      {
        type: 'table',
        heading: 'What does the intake collect, and why?',
        intro: 'The fields are the firm’s choice. A typical first intake is short.',
        columns: ['Field', 'Why it is asked'],
        rows: [
          ['Name and contact details', 'So the firm can reply'],
          ['Practice area', 'So the enquiry goes to the right person'],
          ['Names of the other parties', 'So the firm can check for conflicts before discussing the matter'],
          ['Location', 'So the firm can see whether it practises there'],
          ['Any date the visitor says is approaching', 'So time-sensitive enquiries are seen first. The chatbot does not comment on deadlines.'],
          ['How they found the firm', 'For the firm’s own marketing records'],
        ],
      },
      {
        type: 'prose',
        heading: 'What happens after intake?',
        paragraphs: [
          'The enquiry goes to your intake team, inbox or practice management system with the conversation attached. The visitor is told when to expect contact and that a person will review the enquiry before anything else happens. A person runs the conflict check; the chatbot never confirms representation.',
          'If you offer consultations, the chatbot can hand the visitor to your consultation booking link after intake. See the [appointment booking chatbot](/appointment-booking-chatbot) for the options and how bookings are confirmed.',
        ],
      },
      {
        type: 'callout',
        heading: 'Founding partner places for professional firms',
        text: `Law firms and other professional practices can apply to the [Founding Partner Program](${PROGRAM_PATH}). The chatbot’s rules and notices are drafted with you and approved by the firm before launch.`,
        link: { label: 'Apply for a founding place', href: SIGNUP_PATH },
      },
    ],
    faq: [
      {
        q: 'Can the chatbot answer legal questions?',
        a: 'Only general questions about the firm, such as the areas you handle, how consultations work and what to bring. Questions about a visitor’s own situation are passed to a lawyer.',
      },
      {
        q: 'Are chat conversations confidential?',
        a: 'Conversations are stored in a database the firm controls and are not shared beyond the destinations you set. The chatbot also shows a notice asking visitors not to share confidential details beyond what intake needs.',
      },
      {
        q: 'Can it book consultations?',
        a: 'Yes, by handing the visitor to your consultation booking link after intake, or by sending a consultation request for your team to confirm.',
      },
      {
        q: 'Will it work with our practice management software?',
        a: 'If the software has an API, the intake can be created there, directly or through an automation workflow. Otherwise it arrives by email in a consistent format.',
      },
      {
        q: 'Who decides what the chatbot says?',
        a: 'The firm. Its rules, notices and every answer it can give come from material the firm approves, and changes are made the same way.',
      },
      {
        q: 'Does it tell visitors it is an AI?',
        a: 'Yes. It is labelled as an assistant and says so plainly if asked.',
      },
    ],
    related: [
      { label: 'Appointment booking chatbot', href: '/appointment-booking-chatbot', note: 'Booking consultations after intake.' },
      { label: 'Lead generation chatbot', href: '/lead-generation-chatbot', note: 'Qualifying and routing enquiries.' },
      { label: 'AI assistant vs chatbot', href: '/blog/ai-assistant-vs-chatbot', note: 'When a firm needs lookups and actions, not just answers.' },
      { label: 'AI chatbot development', href: '/services/ai-chatbots', note: 'What every chatbot build includes.' },
    ],
    updated: UPDATED,
  },
];
