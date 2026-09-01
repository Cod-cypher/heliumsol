import { motion } from "motion/react";
import { Sparkles, ArrowRight, ArrowDownRight } from "lucide-react";
import { BOOKING_URL } from "../constants";

export default function Hero() {
  return (
    <section id="vibe" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 md:px-8 bg-white dark:bg-ink-950 overflow-hidden">
      {/* Soft ambient background accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-navy-50 dark:bg-navy-900/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-50 dark:bg-ink-800/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay for clean background division */}
      <div className="absolute inset-0 grid-lines bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Top Tag - Clean Editorial Border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-300 shadow-soft backdrop-blur-xs mb-8 hover:border-navy-200 dark:hover:border-white/20 transition-all duration-300"
        >
          <Sparkles className="h-3 w-3 text-navy-600 dark:text-navy-300" />
          <span className="uppercase tracking-[0.1em] text-[10px]">Full-Service Digital Agency</span>
        </motion.div>

        {/* Headline with subtle accent contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] max-w-4xl"
        >
          We build websites, apps & automation
          <span className="block mt-2 font-display text-navy-700 dark:text-navy-300 font-semibold">
            that grow your business.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-normal leading-relaxed"
        >
          HeliumSol partners with ambitious businesses to design and build full-stack websites,
          web & mobile apps, AI chatbots, and the automated workflows that run quietly behind
          them.
        </motion.p>

        {/* Call to Actions - Curated Editorial buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-sm px-4"
        >
          <a
            href={BOOKING_URL}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-6 py-3.5 text-sm font-semibold text-white shadow-card hover:bg-navy-900 dark:hover:bg-navy-500 transition-all duration-300"
          >
            <span>Book a call</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#work"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 transition-all duration-300"
          >
            <span>View our work</span>
          </a>
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl"
        >
          {[
            { label: "Websites", text: "Built to convert" },
            { label: "Web & Apps", text: "Full-stack builds" },
            { label: "AI Chatbots", text: "24/7 lead capture" },
            { label: "Automation", text: "n8n workflows" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-5 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xs text-center hover:bg-white dark:hover:bg-white/10 hover:border-navy-200 dark:hover:border-white/20 hover:shadow-soft transition-all duration-300"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase text-navy-600/70 dark:text-navy-300/80 block mb-1 font-display">{item.label}</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator — anchored to the bottom-center of the section */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
          className="flex flex-col items-center gap-1.5 cursor-pointer text-slate-400 dark:text-slate-500 hover:text-navy-700 dark:hover:text-white transition-colors"
          onClick={() => {
            document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase">See what we do</span>
          <ArrowDownRight className="h-4 w-4 rotate-45" />
        </motion.div>
      </div>
    </section>
  );
}
