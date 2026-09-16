import { motion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { BOOKING_URL, CONTACT } from "../constants";

export default function ClosingCTA() {
  return (
    <section id="contact" className="relative bg-white dark:bg-ink-950 px-4 md:px-8 py-20 border-t border-slate-200/70 dark:border-white/10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl bg-navy-900 px-6 py-16 sm:px-16 sm:py-20 shadow-card"
        >
          {/* Soft ambient accents */}
          <div className="absolute top-[-30%] right-[-10%] w-[420px] h-[420px] bg-navy-700/40 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-40%] left-[-10%] w-[420px] h-[420px] bg-navy-800/50 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-2xl">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-navy-300 font-display">
              Let's talk
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Ready to grow your business?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-navy-100/70 leading-relaxed">
              Tell us what you're building and we'll come back with how a new website, app,
              chatbot, or automation could work for you — no pressure, no obligation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={BOOKING_URL}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-soft hover:bg-slate-100 transition-all duration-300"
              >
                Contact us
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy-700 px-7 py-3.5 text-sm font-semibold text-navy-100 hover:bg-navy-800 transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
                {CONTACT.email}
              </a>
            </div>

            <p className="mt-5 text-xs text-navy-300/80">{CONTACT.responseTime}.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
