import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, MessageSquare, Terminal, RefreshCw, CheckCircle2, User, Bot, HelpCircle, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  badge?: string;
  timestamp: string;
}

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

  // Core interactive message state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "bot",
      text: "Greetings! I am HE-BOT, your collaborative workspace assistant. My telemetry and matrix logic are successfully compiled and synced.",
      badge: "Synced",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: "init-2",
      sender: "bot",
      text: "You can type anything in the chat box or click any suggestion chip below to request live layout renders, database schemas, or workflow integrations. Try it!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [botState, setBotState] = useState<"IDLE" | "THINKING" | "REPLYING">("IDLE");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bot messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isBotTyping]);

  // Reply generator logic based on keywords
  const generateSmartReply = (userPrompt: string): { text: string; badge: string } => {
    const query = userPrompt.toLowerCase();
    
    if (query.includes("coordinate") || query.includes("landing") || query.includes("layout") || query.includes("deck") || query.includes("ui") || query.includes("carousel") || query.includes("card") || query.includes("project")) {
      return {
        text: "Analyzing design guidelines. Synthesized fluid flexbox grid cards. Repaired parent component constraints and applied high-contrast Swiss display headings. Look at Step 01 above to view the compiled source code!",
        badge: "UI Complete"
      };
    }
    
    if (query.includes("database") || query.includes("postgres") || query.includes("sync") || query.includes("sql") || query.includes("schema") || query.includes("drizzle")) {
      return {
        text: "Constructed Drizzle-compliant PostgreSQL structures. Migrated active tables. Dispatched secure Docker telemetry logs connecting port 3000 seamlessly.",
        badge: "Database Active"
      };
    }
    
    if (query.includes("slack") || query.includes("crm") || query.includes("integration") || query.includes("workflow") || query.includes("n8n") || query.includes("automation")) {
      return {
        text: "Constructing neural triggers. Routed live Webhook gateways linking slack handles, CRM transaction modules, and transactional SMTP relays. You can drag and test these nodes below!",
        badge: "Dockerized"
      };
    }

    if (query.includes("compile") || query.includes("error") || query.includes("integrity") || query.includes("vite") || query.includes("run")) {
      return {
        text: "Linter check: stable. Vite development server bound to host 0.0.0.0 and port 3000. All type scopes are correctly mapped. Workspace integrity is flawless.",
        badge: "Zero Errors"
      };
    }

    if (query.includes("hello") || query.includes("hi ") || query.includes("hey")) {
      return {
        text: "Hello there! I am fully synchronized and listening. What part of the HeliumSol prototyping system would you like us to assemble or review?",
        badge: "Active Host"
      };
    }

    // Default intelligent helper fallback
    return {
      text: `Understood. Processing module dispatch for "${userPrompt}". Compiling system handlers, matching token variables, and establishing workflow metrics. All parameters validated stable.`,
      badge: "Dispatched"
    };
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isBotTyping) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    
    // 2. Set Bot State
    setIsBotTyping(true);
    setBotState("THINKING");

    // 3. Simulates bot replying
    setTimeout(() => {
      setBotState("REPLYING");
      const replyData = generateSmartReply(textToSend);
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyData.text,
        badge: replyData.badge,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
      setBotState("IDLE");
    }, 1250);
  };

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
          Module 03 — Agent Terminal
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-semibold text-slate-900 dark:text-white leading-tight">
          Collaborative Agent
        </h2>
        <p className="text-[13px] sm:text-sm text-slate-500 dark:text-slate-400 mt-4 font-sans leading-relaxed">
          Interact with <b>HE-BOT</b> directly. Type your own messages or try preset hooks below to review layout adjustments, databases, or active node triggers.
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
                  Live Terminal Copilot Thread
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-ink-900 px-2 py-0.5 border border-slate-200/60 dark:border-white/10 rounded">
                Model: Gemini 2.5
              </span>
            </div>

            {/* Conversation Messages Display */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 text-left scroll-smooth"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3.5 border text-xs sm:text-[13px] leading-relaxed shadow-3xs relative overflow-hidden ${
                        msg.sender === "user"
                          ? "bg-slate-100 dark:bg-ink-800 border-slate-200 dark:border-white/10 rounded-tr-none text-slate-800 dark:text-slate-100"
                          : "bg-navy-50 dark:bg-navy-900/40 border-navy-100 dark:border-navy-800 rounded-tl-none text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {/* Decorative bot details */}
                      {msg.sender === "bot" && (
                        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-navy-700 mb-1">
                          <Bot className="h-3 w-3" />
                          <span>HE-BOT ACTIVE AGENT</span>
                          {msg.badge && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-[8px] text-emerald-700 bg-emerald-50 px-1.5 border border-emerald-100 rounded-sm uppercase tracking-wide">
                                {msg.badge}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      {/* User title */}
                      {msg.sender === "user" && (
                        <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 mb-1">
                          <User className="h-3 w-3" />
                          <span>USER PIPELINE DEMAND</span>
                        </div>
                      )}

                      <p className="font-sans font-normal">{msg.text}</p>
                      
                      <span className="block mt-1.5 text-right font-mono text-[8.5px] text-slate-400 tracking-tight">
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Live Loading state when Bot is computing response */}
              {isBotTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-navy-50 dark:bg-navy-900/40 border border-navy-100 dark:border-navy-800 rounded-2xl rounded-tl-none p-4 max-w-[85%] text-left">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-navy-700 font-bold mb-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-navy-600" />
                      <span>HE-BOT THINKING & SYNTHESIZING...</span>
                    </div>
                    <div className="flex gap-1.5 items-center mt-2 pl-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-navy-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-navy-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-navy-400 animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Message Input Actions */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="px-5 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-ink-800 flex items-center gap-2 relative"
            >
              <input
                type="text"
                maxLength={200}
                placeholder="Ask HE-BOT to build layouts, databases, triggers..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isBotTyping}
                className="w-full text-xs sm:text-sm bg-white dark:bg-ink-900 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 pr-12 font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400 shadow-3xs placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:bg-slate-55 disabled:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isBotTyping}
                className="absolute right-7 top-1/2 -translate-y-1/2 h-8.5 w-8.5 rounded-lg bg-navy-800 hover:bg-navy-900 active:scale-95 text-white flex items-center justify-center shadow-sm cursor-pointer transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>

        </div>

        {/* Dynamic suggestion chips */}
        <div className="flex gap-2 flex-wrap justify-center mt-5 select-none">
          {[
            "Redecorate UI layout guidelines", 
            "Design postgres sync database schema", 
            "Connect slack webhook notifications", 
            "Vite dev compilation status check"
          ].map((item, id) => (
            <button
              key={id}
              onClick={() => handleSendMessage(item)}
              disabled={isBotTyping}
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
