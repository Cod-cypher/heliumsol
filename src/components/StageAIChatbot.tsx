import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { useChat } from "./chat/ChatProvider";
import ChatConversation from "./chat/ChatConversation";
import ChatForm from "./chat/ChatForm";

export default function StageAIChatbot() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Set up screen-width detection to prevent layout overflow on smaller viewports
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Calculate offsets based on user's scroll speed and device width
  const slideOffset = isMobile ? 40 : 180;

  // Track if terminal has been triggered to fully build
  const [terminalTriggered, setTerminalTriggered] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (latestVal) => {
      if (latestVal > 0.28) {
        setTerminalTriggered(true);
      } else if (latestVal < 0.1) {
        setTerminalTriggered(false);
      }
    });
  }, [scrollYProgress]);

  // The HE-BOT Character column slides in from the left first
  const charX = useTransform(scrollYProgress, [0.05, 0.38], [-slideOffset, 0]);
  const charOpacity = useTransform(scrollYProgress, [0.05, 0.38], [0, 1]);

  // The live assistant. Shared with the floating widget through ChatProvider,
  // so a conversation started here carries on in the corner widget and on
  // every other page.
  const { session, sending, awaitingReply, sendText, setInlineVisible } = useChat();
  const botState = (awaitingReply || sending ? "THINKING" : "IDLE") as "IDLE" | "THINKING" | "REPLYING";

  // While this section is on screen, replies here are being read, so they do
  // not count as unread on the launcher.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInlineVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      setInlineVisible(false);
    };
  }, [setInlineVisible]);

  return (
    <div 
      ref={sectionRef}
      className="relative w-full py-16 px-4 sm:px-6 overflow-hidden min-h-[580px] flex flex-col justify-center"
      id="chatbot-stage-container"
    >
      {/* Visual editorial grid pattern */}
      <div className="absolute inset-0 grid-lines-y bg-[size:3.5rem] pointer-events-none" />

      {/* Header text introducing Stage */}
      <div className="text-center max-w-xl mx-auto mb-12 relative z-10 select-none">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 block mb-3 font-display">
          Module 03 — AI Assistant
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 dark:text-white leading-tight">
          Talk to our AI assistant
        </h2>
        <p className="text-[13px] sm:text-sm text-slate-500 dark:text-slate-400 mt-4 font-sans leading-relaxed">
          The same kind of assistant we build for clients, answering live. Ask about a project, or ask for a person and someone from the team can join the chat.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col justify-center">
        
        {/* Unified Chat Terminal Frame */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 shadow-card overflow-hidden text-left flex flex-col md:flex-row min-h-[460px] w-full">
          
          {/* LEFT COLUMN: THE SEAMLESS HE-BOT STATS & CHARACTER ORB */}
          <motion.div 
            style={{ x: charX, opacity: charOpacity }}
            className="md:w-[280px] bg-navy-900 text-slate-200 border-b md:border-b-0 md:border-r border-navy-800 p-6 flex flex-col items-center justify-between select-none relative"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-700 pointer-events-none" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-700 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-700 pointer-events-none" />

            <div className="w-full text-center">
              <span className="text-[9px] font-mono font-bold tracking-[0.15em] text-navy-300 uppercase block mb-1">
                Cognitive Host
              </span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                HE-BOT CORE // ACTIVE
              </h3>
            </div>

            {/* Glowing Seamless Animated Character Face Orb */}
            <motion.div 
              animate={{ 
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="my-6 md:my-0 flex flex-col items-center justify-center relative w-28 h-28"
            >
              {/* Outer decorative sonar ring */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse" />
              
              {/* Inner glowing server node background */}
              <div className="w-24 h-24 rounded-full bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent)] pointer-events-none" />
                
                {/* BLINKING DIGITAL EYES */}
                <div className="flex gap-3.5 items-center justify-center h-4 mb-2 z-10">
                  {botState === "THINKING" ? (
                    <>
                      {/* Spinning core eyes for thinking */}
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="h-3 w-3 rounded-full border-2 border-dashed border-cyan-400"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="h-3 w-3 rounded-full border-2 border-dashed border-cyan-400"
                      />
                    </>
                  ) : botState === "REPLYING" ? (
                    <>
                      {/* Happy talking eyes */}
                      <span className="text-cyan-400 text-xs font-mono font-bold font-serif">^</span>
                      <span className="text-cyan-400 text-xs font-mono font-bold font-serif">^</span>
                    </>
                  ) : (
                    <>
                      {/* Standard idle breath eyes */}
                      <div className="h-1.5 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                      <div className="h-1.5 w-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                    </>
                  )}
                </div>

                <span className="text-[8px] font-mono tracking-[0.25em] text-cyan-305 font-bold">
                  {botState}
                </span>

                {/* Micro voice grid spectrum bars */}
                <div className="flex gap-0.5 items-end h-2.5 mt-2 z-10">
                  {[0.4, 0.9, 0.6, 0.2, 0.8, 0.5, 0.3].map((val, idx) => (
                    <motion.div 
                      key={idx}
                      animate={botState === "REPLYING" ? {
                        height: [2, 10, 2],
                      } : botState === "THINKING" ? {
                        height: [2, 6, 2]
                      } : {
                        height: 2
                      }}
                      transition={{
                        duration: 0.4 + idx * 0.1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-0.5 bg-cyan-500 rounded-xs"
                      style={{ height: 2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Live telemetry list */}
            <div className="w-full text-[9px] font-mono text-slate-400 space-y-2.5 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
                </span>
              </div>
              <div className="flex justify-between">
                <span>CPU TEMP</span>
                <span className="text-slate-200">34.1°C</span>
              </div>
              <div className="flex justify-between">
                <span>EMPATHY MATRIX</span>
                <span className="text-slate-200">98.5% stable</span>
              </div>
              <div className="flex justify-between">
                <span>PORT SOCKET</span>
                <span className="text-cyan-400">3000 // synced</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: THE INTERACTIVE CONVERSATION FIELD */}
          <motion.div 
            animate={{
              x: terminalTriggered ? 0 : slideOffset,
              opacity: terminalTriggered ? 1 : 0,
              scale: terminalTriggered ? 1 : 0.94,
            }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 100,
            }}
            className="flex-1 flex flex-col bg-slate-50/20 dark:bg-ink-900 justify-between h-[460px] origin-left"
          >

            {/* Thread Header with client specs */}
            <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-ink-800 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-[11px] font-mono font-bold text-slate-520 dark:text-slate-300 uppercase tracking-wider">
                  HeliumSol assistant
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-ink-900 px-2 py-0.5 border border-slate-200/60 dark:border-white/10 rounded">
                Live AI assistant
              </span>
            </div>

            {/* The live conversation — the same thread as the floating widget. */}
            {session?.mode === "form" ? (
              <ChatForm notice={session.notice} onDone={() => {}} />
            ) : (
              <ChatConversation
                idPrefix="hs-inline-chat"
                placeholder="Ask about a website, app, chatbot or automation…"
              />
            )}
          </motion.div>

        </div>

        {/* Dynamic suggestion chips */}
        <div className="flex gap-2 flex-wrap justify-center mt-5 select-none">
          {[
            "Can you build an AI chatbot for my website?",
            "What can you automate with n8n?",
            "How does a website project work?",
            "I want to talk to a person"
          ].map((item, id) => (
            <button
              key={id}
              onClick={() => void sendText(item)}
              disabled={sending || awaitingReply}
              className="text-[10px] sm:text-[11.5px] font-semibold text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 hover:bg-slate-50 dark:hover:bg-ink-700 px-3.5 py-1.5 rounded-full shadow-3xs cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
