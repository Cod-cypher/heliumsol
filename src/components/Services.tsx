import { motion } from "motion/react";
import { Globe, Smartphone, Bot, Workflow, ArrowRight } from "lucide-react";
import { BOOKING_URL } from "../constants";

const services = [
  {
    icon: Globe,
    name: "Full-Stack Websites",
    outcome: "Fast, conversion-focused sites that turn visitors into customers.",
    tag: "Web",
  },
  {
    icon: Smartphone,
    name: "Web & Mobile Apps",
    outcome: "Custom applications that scale with your business.",
    tag: "Apps",
  },
  {
    icon: Bot,
    name: "AI Chatbots",
    outcome: "24/7 assistants that capture leads and answer instantly.",
    tag: "AI",
  },
  {
    icon: Workflow,
    name: "Workflow Automation",
    outcome: "Connect your tools with n8n and automate the busywork.",
    tag: "n8n",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-slate-50/60 dark:bg-ink-900/40 py-24 sm:py-32 px-4 md:px-8 border-t border-slate-200/70 dark:border-white/10">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
            What we do
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Services built to move your business forward
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            From the first line of code to the automations running quietly behind it, we cover the
            full stack of building online — design, build, ship, and automate.
          </p>
        </div>

        {/* Services grid.
            Four across on desktop rather than three: with four services a
            three-column grid leaves a single orphaned card on the second row. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 dark:bg-navy-900/50 text-navy-700 dark:text-navy-200">
                  <Icon className="h-5 w-5 stroke-[1.8]" />
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                    {service.name}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-navy-600/70 dark:text-navy-300 bg-navy-50 dark:bg-navy-900/50 border border-navy-100 dark:border-navy-800 px-1.5 py-0.5 rounded">
                    {service.tag}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {service.outcome}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Inline reassurance + soft CTA */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <a
            href={BOOKING_URL}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all duration-300"
          >
            Contact us
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Not sure what you need? We'll help you scope it on a free discovery call.
          </p>
        </div>
      </div>
    </section>
  );
}
