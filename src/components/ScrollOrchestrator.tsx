import { motion } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import StageCodeIntro from "./StageCodeIntro";
import StageProjectsShowcase from "./StageProjectsShowcase";
import StageAIChatbot from "./StageAIChatbot";
import StageAutomationEngine from "./StageAutomationEngine";
import { Code, Layers, MessageSquare, Cpu, Check } from "lucide-react";

export default function ScrollOrchestrator() {
  const [activeSection, setActiveSection] = useState<number>(0);

  // The rail is position:fixed, so without this it floats over every section
  // below the demos too. Shown only while the demo area is on screen.
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [railVisible, setRailVisible] = useState(false);
  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setRailVisible(entry.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // References to track intersection
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);

  const stages = [
    { id: 0, title: "01 / Code", subtitle: "Synthesis Loop", icon: <Code className="h-4 w-4" />, ref: sec1Ref },
    { id: 1, title: "02 / Showcase", subtitle: "Curated Slides", icon: <Layers className="h-4 w-4" />, ref: sec2Ref },
    { id: 2, title: "03 / Dialogue", subtitle: "AI Assistant", icon: <MessageSquare className="h-4 w-4" />, ref: sec3Ref },
    { id: 3, title: "04 / Intelligence", subtitle: "Neural Sync", icon: <Cpu className="h-4 w-4" />, ref: sec4Ref },
  ];

  // Set up an IntersectionObserver to light up the correct navigation menu item
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px", // triggers when section dominates the viewport center
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const indexAttr = entry.target.getAttribute("data-section-index");
          if (indexAttr !== null) {
            setActiveSection(parseInt(indexAttr, 10));
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    [sec1Ref, sec2Ref, sec3Ref, sec4Ref].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="workspace" ref={workspaceRef} className="relative w-full bg-white dark:bg-ink-950">

      {/* 1. ARCHITECTURAL GRID BACKGROUND OVERLAYS - Lines throughout the app */}
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-0 overflow-hidden">
        {/* Fine vertical division guidelines matched with 7xl default padding */}
        <div className="max-w-7xl mx-auto h-full w-full border-l border-r border-slate-200/30 dark:border-white/5 relative" />
      </div>

      {/* 2. FLOATING NAVIGATION TRACK RAIL INDEX - Desktop Only */}
      {/* Only from 2xl (1536px): below that the 7xl content column reaches the
          viewport edge and the rail sits on top of it. */}
      <div
        aria-hidden={!railVisible}
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col gap-5 bg-white/95 dark:bg-ink-900/90 border border-slate-200/80 dark:border-white/10 p-4 rounded-xl shadow-soft backdrop-blur-md transition-all duration-300 ${
          railVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-left block mb-1">
          Canvas Hub
        </span>
        <div className="flex flex-col gap-4 relative">
          {/* Inner line tracker timeline decoration */}
          <div className="absolute left-[17px] top-2 bottom-2 w-[1.5px] bg-slate-100/80 dark:bg-white/10">
            <div
              className="w-full bg-navy-700 dark:bg-navy-400 rounded-full transition-all duration-500"
              style={{
                height: `${((activeSection) / (stages.length - 1)) * 100}%`,
              }}
            />
          </div>

          {stages.map((stage) => {
            const isActive = stage.id === activeSection;
            const isPassed = stage.id < activeSection;

            return (
              <button
                key={stage.id}
                onClick={() => handleScrollToSection(stage.ref as React.RefObject<HTMLDivElement | null>)}
                className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-hidden"
              >
                {/* Visual node */}
                <div 
                  className={`h-8.5 w-8.5 rounded-lg border flex items-center justify-center relative z-10 transition-all duration-300 ${
                    isActive
                      ? "bg-navy-800 dark:bg-navy-500 border-navy-800 dark:border-navy-500 text-white shadow-soft scale-105"
                      : isPassed
                        ? "bg-navy-50 dark:bg-navy-900/50 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300"
                        : "bg-white dark:bg-ink-800 border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 group-hover:border-slate-350 group-hover:text-slate-655"
                  }`}
                >
                  {isPassed ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : stage.icon}
                </div>

                <div className="flex flex-col text-left">
                  <span className={`text-[9px] font-mono font-bold tracking-wider leading-none uppercase ${isActive ? "text-navy-700 dark:text-navy-300" : "text-slate-400 dark:text-slate-500"}`}>
                    {stage.title}
                  </span>
                  <span className={`text-[11px] font-bold font-sans mt-0.5 ${isActive ? "text-slate-850 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"}`}>

                    {stage.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEQUENTIAL INDIVIDUAL FULL VERTICAL SECTIONS */}
      <div className="relative z-10 flex flex-col">
        
        {/* MODULE 1: CODE CREATION SEQUENCE */}
        <div
          ref={sec1Ref}
          data-section-index="0"
          className="relative border-b border-slate-200/70 dark:border-white/10 bg-white dark:bg-ink-950"
        >
          <div className="py-24 sm:py-32 w-full">
            <StageCodeIntro progress={1.0} />
          </div>
        </div>

        {/* MODULE 2: RE-STYLISH PROJECT CAROUSEL */}
        <div
          ref={sec2Ref}
          data-section-index="1"
          className="relative border-b border-slate-200/70 dark:border-white/10 bg-slate-50/60 dark:bg-ink-900/40"
        >
          {/* Vertical spacing and container padding */}
          <div className="py-24 sm:py-32 w-full">
            {/* Standard automatic looping slider that uses scroll viewport highlights inside StageProjectsShowcase */}
            <StageProjectsShowcase progress={0.35} />
          </div>
        </div>

        {/* MODULE 3: COLLABORATIVE DIALOGUE BOT */}
        <div
          ref={sec3Ref}
          data-section-index="2"
          className="relative border-b border-slate-200/70 dark:border-white/10 bg-white dark:bg-ink-950"
        >
          <div className="py-24 sm:py-32 w-full">
            <StageAIChatbot />
          </div>
        </div>

        {/* MODULE 4: n8n NETWORK GRAPH PIPELINE */}
        <div
          ref={sec4Ref}
          data-section-index="3"
          className="relative bg-slate-50/60 dark:bg-ink-900/40"
        >
          <div className="py-24 sm:py-32 w-full">
            <StageAutomationEngine progress={0.5} />
          </div>
        </div>

      </div>
    </div>
  );
}
