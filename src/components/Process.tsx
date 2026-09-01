import { motion } from "motion/react";
import { Compass, PenTool, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Discovery",
    description: "We learn your goals, audience, and what success actually looks like for your business.",
  },
  {
    icon: PenTool,
    title: "Design & Build",
    description: "We design, build, and refine in short cycles — with you in the loop the whole way.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "We ship, test, and make sure everything performs on every device before go-live.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description: "Ongoing support, automation, and improvements that compound results over time.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative bg-white dark:bg-ink-950 py-24 sm:py-32 px-4 md:px-8 border-t border-slate-200/70 dark:border-white/10">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
            How we work
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            A clear path from idea to impact
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            No surprises, no jargon. A transparent process you can plan around from day one.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 dark:bg-navy-600 text-white shadow-soft">
                  <Icon className="h-5 w-5 stroke-[1.8]" />
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-ink-800 border border-slate-200 dark:border-white/15 text-[10px] font-bold text-navy-700 dark:text-navy-200">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[15rem]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
