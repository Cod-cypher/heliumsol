import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

// NOTE: Placeholder testimonials. Replace `testimonials` with real client
// quotes (name, business, result) when available.
const testimonials = [
  {
    quote:
      "They rebuilt our site from scratch and it finally reflects who we are. Enquiries through the contact form roughly doubled in the first two months.",
    name: "Sarah Mitchell",
    business: "Founder, BrightPath Clinic",
    result: "+112% enquiries",
  },
  {
    quote:
      "The AI chatbot and automation they set up handles the questions that used to eat our evenings. It just works, and our customers love the instant replies.",
    name: "David Okafor",
    business: "Operations Lead, FlowOps",
    result: "20 hrs/week saved",
  },
  {
    quote:
      "Our new storefront is quick, the checkout finally makes sense, and online orders climbed within the first quarter. Clear communication, on time, and genuinely good to work with.",
    name: "Elena Rossi",
    business: "Owner, Summit Gear Co.",
    result: "+38% online orders",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-slate-50/60 dark:bg-ink-900/40 py-24 sm:py-32 px-4 md:px-8 border-t border-slate-200/70 dark:border-white/10">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Trusted by businesses we've helped grow
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            We measure our work by your results — here's what a few of our clients have to say.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-7 shadow-soft"
            >
              <Quote className="h-7 w-7 text-navy-100 dark:text-navy-800 fill-navy-100 dark:fill-navy-800" />

              <div className="mt-1 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <blockquote className="mt-4 flex-1 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
                "{t.quote}"
              </blockquote>

              <figcaption className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.business}</div>
                </div>
                <span className="shrink-0 text-[11px] font-bold text-navy-700 dark:text-navy-200 bg-navy-50 dark:bg-navy-900/50 border border-navy-100 dark:border-navy-800 px-2.5 py-1 rounded-full">
                  {t.result}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
