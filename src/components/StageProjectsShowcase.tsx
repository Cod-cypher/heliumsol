import { motion } from "motion/react";
import { useState } from "react";
import { Project } from "../types";
import { 
  ExternalLink, Layers, Sparkles, TrendingUp, BarChart2, ShoppingBag, FolderKanban, Cpu, ChevronLeft, ChevronRight 
} from "lucide-react";

interface StageProjectsShowcaseProps {
  progress?: number;
}

export default function StageProjectsShowcase({}: StageProjectsShowcaseProps) {
  // NOTE: Placeholder portfolio. Replace these with real client projects
  // (name, live URL, stack, and a one-line result) when available.
  const projects: Project[] = [
    {
      id: "brightpath",
      title: "BrightPath Clinic",
      subtitle: "Healthcare · Website + Booking",
      description: "A new website with online appointment booking that doubled new patient enquiries.",
      category: "Website",
      tech: ["React", "Node", "Booking"],
      color: {
        bg: "bg-amber-50/70",
        text: "text-amber-700",
        border: "border-amber-100",
        accent: "bg-amber-500"
      },
      mockupType: "dashboard"
    },
    {
      id: "summit-gear",
      title: "Summit Gear Co.",
      subtitle: "Outdoor retail · E-commerce",
      description: "A headless storefront with a streamlined checkout that cut cart abandonment and lifted online sales.",
      category: "E-Commerce",
      tech: ["Next.js", "Shopify", "Stripe"],
      color: {
        bg: "bg-emerald-50/70",
        text: "text-emerald-700",
        border: "border-emerald-100",
        accent: "bg-emerald-500"
      },
      mockupType: "commerce"
    },
    {
      id: "ledgerly",
      title: "Ledgerly",
      subtitle: "Fintech · Web app",
      description: "A full-stack analytics dashboard giving finance teams real-time visibility across every account.",
      category: "Web App",
      tech: ["React", "FastAPI", "Postgres"],
      color: {
        bg: "bg-teal-50/70",
        text: "text-teal-700",
        border: "border-teal-100",
        accent: "bg-teal-500"
      },
      mockupType: "analytics"
    },
    {
      id: "flowops",
      title: "FlowOps",
      subtitle: "Operations · Automation + Chatbot",
      description: "An n8n automation suite and AI support chatbot that handles enquiries and routes leads around the clock.",
      category: "Automation + AI",
      tech: ["n8n", "OpenAI", "Slack"],
      color: {
        bg: "bg-violet-50/70",
        text: "text-violet-700",
        border: "border-violet-100",
        accent: "bg-violet-500"
      },
      mockupType: "canvas"
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  const prevSlide = () => {
    setActiveIdx((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIdx((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const translateX = -activeIdx * 100;

  return (
    <div id="work" className="relative w-full h-full flex flex-col justify-center py-6 px-4 sm:px-6 scroll-mt-24">

      {/* Background Grid Accent inside Section */}
      <div className="absolute inset-0 grid-lines-x bg-[size:4rem]" />

      {/* Visual background guide */}
      <div className="text-center max-w-xl mx-auto mb-10 relative z-10">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 block mb-3 font-display">
          Our Work
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 dark:text-white leading-tight">
          Sites & systems we've shipped
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-4 font-sans leading-relaxed">
          A sample of the websites, apps, and automations we've designed and built for clients — from
          e-commerce storefronts to full-stack apps and round-the-clock automation.
        </p>
      </div>

      {/* Main Mac-style Container Window */}
      <div className="relative z-10 mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 shadow-card overflow-hidden flex flex-col">

        {/* Mac-style titlebar */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-ink-800 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="hidden sm:inline-block text-slate-400 dark:text-slate-500 font-mono text-[11px] select-all">
            https://safari.heliumsol.co/showcase/{projects[activeIdx].id}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 rounded-lg px-2.5 py-1 text-slate-500 dark:text-slate-400 text-[11px] font-mono shadow-3xs">
              <span>SCREEN {activeIdx + 1} / {projects.length}</span>
            </div>
            <Layers className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Carousel Window Viewport */}
        <div className="relative overflow-hidden w-full h-[360px] sm:h-[420px] bg-slate-50/40 dark:bg-ink-950/40">

          {/* Slide Progress line bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-white/10 z-10">
            <div
              className="h-full bg-navy-700 transition-all duration-500"
              style={{ width: `${((activeIdx + 1) / projects.length) * 100}%` }}
            />
          </div>

          {/* Left / Right chevron triggers inside the slide viewport */}
          <div className="absolute inset-y-0 left-4 z-20 flex items-center">
            <button 
              onClick={prevSlide}
              className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-ink-800/90 hover:bg-white dark:hover:bg-ink-800 text-slate-600 dark:text-slate-300 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.2]" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-4 z-20 flex items-center">
            <button 
              onClick={nextSlide}
              className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-ink-800/90 hover:bg-white dark:hover:bg-ink-800 text-slate-600 dark:text-slate-300 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Carousel Slide Carriage */}
          <motion.div
            style={{
              x: `${translateX}%`,
            }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 100,
            }}
            className="flex h-full w-full"
          >
            {projects.map((project, idx) => {
              const scale = idx === activeIdx ? 1 : 0.95;
              
              return (
                <div 
                  key={project.id} 
                  className="w-full flex-none h-full flex items-center justify-center p-4 sm:p-8"
                  style={{ width: "100%" }}
                >
                  <motion.div 
                    animate={{ scale }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-4xl h-full grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-ink-900 p-5 sm:p-6 shadow-3xs"
                  >
                    {/* Visual mockup (5 columns on desktop) */}
                    <div className="col-span-1 md:col-span-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex items-center justify-center overflow-hidden min-h-[140px] md:min-h-0 relative shadow-inner">
                      {project.mockupType === "dashboard" && (
                        <div className="w-full h-full flex flex-col justify-between gap-3">
                          <div className="flex justify-between items-center bg-white border border-slate-200 p-2.5 rounded-lg shadow-3xs">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-amber-500" /> Solar Flux Array
                            </span>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">Live: 94.6 KW</span>
                          </div>
                          {/* Mini analytics graph bar */}
                          <div className="flex-1 flex items-end gap-1.5 h-16 pt-2">
                            {[42, 68, 48, 79, 90, 54, 76, 92, 60, 48, 85, 94].map((h, bIdx) => (
                              <div key={bIdx} className="flex-1 bg-amber-100 hover:bg-amber-400 rounded-sm transition-colors duration-200" style={{ height: `${h}%` }} />
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 border-t border-slate-200/60 pt-2">
                            <span>00:00 UTC</span>
                            <span>12:00 UTC</span>
                          </div>
                        </div>
                      )}

                      {project.mockupType === "commerce" && (
                        <div className="w-full h-full flex flex-col justify-between gap-3">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <ShoppingBag className="h-3 w-3 text-emerald-500" /> Aura Checkout
                            </span>
                            <div className="flex gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                            </div>
                          </div>
                          <div className="flex-1 flex items-center justify-between py-2">
                            <div className="flex items-center gap-2.5">
                              <div className="h-11 w-11 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600 shadow-3xs">
                                <Cpu className="h-5 w-5 animate-pulse" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-slate-700">HeliumCore Sol-X</h4>
                                <span className="text-[10px] text-zinc-400">Qty: 1</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-slate-800">$299.00 USD</span>
                          </div>
                          <button className="w-full rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-medium py-2.5 shadow-3xs flex items-center justify-center gap-1.5 transition-colors cursor-default">
                            <span>Complete Purchase</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {project.mockupType === "analytics" && (
                        <div className="w-full h-full flex flex-col justify-between gap-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <BarChart2 className="h-3 w-3 text-teal-500" /> Flow Distribution
                            </span>
                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">+12.4%</span>
                          </div>
                          <div className="flex-1 flex items-center justify-center relative">
                            {/* SVG Circle diagram for visual elegance */}
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle cx="48" cy="48" r="36" className="stroke-slate-205 fill-none" strokeWidth="8" />
                              <circle cx="48" cy="48" r="36" className="stroke-teal-400 fill-none" strokeWidth="8" strokeDasharray="226" strokeDashoffset="60" strokeLinecap="round" />
                              <circle cx="48" cy="48" r="36" className="stroke-indigo-300 fill-none" strokeWidth="8" strokeDasharray="226" strokeDashoffset="180" strokeLinecap="round" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className="text-xs font-extrabold text-slate-700">83%</span>
                              <span className="text-[8px] text-slate-405">Optimal</span>
                            </div>
                          </div>
                          <div className="flex gap-4 justify-center text-[9px] font-mono text-slate-400">
                            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> Web</span>
                            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-indigo-300" /> API</span>
                          </div>
                        </div>
                      )}

                      {project.mockupType === "canvas" && (
                        <div className="w-full h-full flex flex-col justify-between gap-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <FolderKanban className="h-3 w-3 text-violet-500" /> Canvas Jobs
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Running</span>
                          </div>
                          {/* Simulated mini Kanban workflow columns */}
                          <div className="flex-1 grid grid-cols-2 gap-2 mt-1">
                            <div className="rounded border border-dashed border-slate-200 bg-white/40 p-2 text-left">
                              <span className="text-[8px] font-mono uppercase bg-slate-100 text-slate-500 px-1 rounded">Pending</span>
                              <div className="h-1.5 w-[80%] bg-slate-100 rounded mt-2" />
                              <div className="h-1.5 w-[50%] bg-slate-100 rounded mt-1" />
                            </div>
                            <div className="rounded border border-violet-100 bg-violet-50/20 p-2 text-left relative overflow-hidden">
                              <span className="text-[8px] font-mono uppercase bg-violet-100 text-violet-600 px-1 rounded">Active</span>
                              <div className="h-1.5 w-[90%] bg-violet-200/60 rounded mt-2" />
                              <div className="h-1.5 w-[30%] bg-violet-200/60 rounded mt-1" />
                              <div className="absolute right-1 bottom-1 h-2 w-2 rounded-full bg-violet-500 animate-ping" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata column (6 columns on desktop) */}
                    <div className="col-span-1 md:col-span-6 flex flex-col justify-between text-left">
                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.color.bg} ${project.color.text} border ${project.color.border}`}>
                            {project.category}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-slate-450 text-[10px]">
                            <Sparkles className="h-3 w-3 text-navy-600" /> Sol-Vetted Core
                          </span>
                        </div>

                        {/* Title and details */}
                        <h3 className="font-serif text-xl sm:text-3xl font-normal text-slate-900 dark:text-white leading-tight">
                          {project.title}
                          <span className="block text-[10px] tracking-widest uppercase text-slate-400 dark:text-slate-500 font-bold font-display mt-2">{project.subtitle}</span>
                        </h3>

                        <p className="mt-3 sm:mt-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                          {project.description}
                        </p>
                      </div>

                      {/* Tech labels & Link icon */}
                      <div className="mt-4 sm:mt-0 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-ink-800 border border-slate-205 dark:border-white/10 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                              {t}
                            </span>
                          ))}
                        </div>

                        <a
                          href="#contact"
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:text-navy-700 dark:hover:text-white transition-colors"
                        >
                          <span>Start a project</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Carousel Indicators Bullet controls */}
        <div className="py-3.5 bg-slate-50/50 dark:bg-ink-800/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-2">
          {projects.map((_, pIdx) => (
            <button
              key={pIdx}
              onClick={() => setActiveIdx(pIdx)}
              className={`h-2 rounded-full transition-all duration-300 ${pIdx === activeIdx ? "w-6 bg-navy-700 dark:bg-navy-400" : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
