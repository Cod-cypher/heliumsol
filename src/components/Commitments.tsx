import { motion } from "motion/react";
import { Clock, UserCheck, MessageSquareText, Scale, RefreshCcw, Bot } from "lucide-react";
import { BOOKING_URL, CONTACT } from "../constants";

// What working with HeliumSol actually involves. Every item here is something
// the site already commits to elsewhere (contact page, process, assistant), so
// nothing in this section is a claim that needs a client to back it up.
const commitments = [
  {
    icon: Clock,
    title: "A reply within one business day",
    text: "Every enquiry gets an answer from us within a business day, whether it comes through the contact form, email or the chat.",
  },
  {
    icon: UserCheck,
    title: "A real person reads your enquiry",
    text: "Forms and chat handoffs go straight to the team. You can ask the assistant for a person at any time and someone can join the conversation.",
  },
  {
    icon: Scale,
    title: "Honest about fit",
    text: "If a website, app, chatbot or automation is not the right answer for your problem, we will say so rather than sell you one.",
  },
  {
    icon: MessageSquareText,
    title: "Pricing after we understand the project",
    text: "No guesswork quotes and no promised numbers. Scope, timeline and price come after a discovery conversation about what you need.",
  },
  {
    icon: RefreshCcw,
    title: "You're in the loop the whole way",
    text: "We design and build in short cycles and show you working progress, so feedback shapes the product before launch, not after.",
  },
  {
    icon: Bot,
    title: "Try the kind of assistant we build",
    text: "The AI assistant on this site answers live and hands off to a person when asked. It is a working example, not a mockup.",
  },
];

export default function Commitments() {
  return (
    <section
      id="how-we-work"
      className="relative bg-slate-50/60 dark:bg-ink-900/40 py-24 sm:py-32 px-4 md:px-8 border-t border-slate-200/70 dark:border-white/10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
            Working with us
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            What you can expect from HeliumSol
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Straightforward commitments about how we communicate, scope and build — the things that
            matter before a single line of code is written.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {commitments.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-soft"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 dark:bg-navy-900/50 text-navy-700 dark:text-navy-200">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <a
            href={BOOKING_URL}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all duration-300"
          >
            Tell us about your project
          </a>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Or email{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-medium text-navy-700 dark:text-navy-300 hover:underline">
              {CONTACT.email}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
