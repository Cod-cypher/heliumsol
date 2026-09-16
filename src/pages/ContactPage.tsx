/**
 * /contact — the enquiry page.
 *
 * Plain markup rather than motion wrappers: the page is pre-rendered, and an
 * entrance animation would ship its text at opacity 0 to anything that reads
 * the HTML without running JavaScript.
 */

import { Mail, Phone, Clock, MessageCircle } from "lucide-react";
import ContactLeadForm from "../components/ContactLeadForm";
import { openChatWidget } from "../components/chat/ChatWidget";
import { CONTACT } from "../constants";

const HELP_WITH = [
  "AI chatbots and assistants for your website or support channels",
  "AI and workflow automation, including n8n, that connects the tools you already use",
  "Websites built to load fast and turn visitors into enquiries",
  "Custom web and mobile apps",
  "Other software, AI or integration work — ask, and we will say honestly if it is a fit",
];

export default function ContactPage() {
  return (
    <main className="relative pt-28 pb-24 px-4 md:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 grid-lines bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-6 lg:pt-6">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
            Contact
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Let's talk about your chatbot, AI or tech project
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            Whether you want an AI assistant answering your customers, automations that take
            busywork off your team, or a website or app built properly, start with three quick
            questions. A person at HeliumSol reads every enquiry.
          </p>

          <h2 className="mt-10 font-display text-lg font-bold text-slate-900 dark:text-white">
            What we can help with
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {HELP_WITH.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-navy-600 dark:bg-navy-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-lg font-bold text-slate-900 dark:text-white">
            Other ways to reach us
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2.5 hover:text-navy-700 dark:hover:text-white transition-colors">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2.5 hover:text-navy-700 dark:hover:text-white transition-colors">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openChatWidget()}
                className="inline-flex items-center gap-2.5 hover:text-navy-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat with our AI assistant
              </button>
            </li>
            <li className="inline-flex items-center gap-2.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {CONTACT.responseTime}.
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6 w-full max-w-xl lg:max-w-none mx-auto">
          <ContactLeadForm />
        </div>
      </div>
    </main>
  );
}
