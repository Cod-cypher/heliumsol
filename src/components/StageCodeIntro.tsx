import { motion, useScroll } from "motion/react";
import React, { useEffect, useState, useRef } from "react";
import { Terminal, FileCode, Bot, Sparkles, Code, CheckCircle } from "lucide-react";

interface CodeCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  headerComment: string;
  highlightColor: string;
  code: string[];
  scrollVal: number;
  startScroll: number;
  endScroll: number;
  yOffset: number; 
  xOffset: number;
  rotateVal: number;
  scaleVal: number;
  zIndexVal: number;
}

function CodeEditorCard({
  id,
  name,
  icon,
  headerComment,
  highlightColor,
  code,
  scrollVal,
  startScroll,
  endScroll,
  yOffset,
  xOffset,
  rotateVal,
  scaleVal,
  zIndexVal,
}: CodeCardProps) {
  const fullText = code.join("\n");
  
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent internal element scrolling from eating the wheel event
      e.preventDefault();
      // Scroll the parent window instead
      window.scrollBy({
        top: e.deltaY,
        behavior: "auto"
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Calculate typed characters based on active scroll range
  let typedChars = 0;
  if (scrollVal >= endScroll) {
    typedChars = fullText.length;
  } else if (scrollVal > startScroll) {
    const ratio = (scrollVal - startScroll) / (endScroll - startScroll);
    typedChars = Math.floor(ratio * fullText.length);
  }

  const isCurrentlyTyping = scrollVal > startScroll && scrollVal < endScroll;
  const isFullyComplete = scrollVal >= endScroll;

  // Distribute typed chars to each line, keeping the original layout stable
  let charsRemaining = typedChars;
  const lineRenderData = code.map((lineText) => {
    if (charsRemaining <= 0) {
      return { typed: "", untyped: lineText };
    } else if (charsRemaining >= lineText.length) {
      charsRemaining -= (lineText.length + 1); // +1 accounts for the newline char
      return { typed: lineText, untyped: "" };
    } else {
      const typedPart = lineText.slice(0, charsRemaining);
      const untypedPart = lineText.slice(charsRemaining);
      charsRemaining = 0;
      return { typed: typedPart, untyped: untypedPart };
    }
  });

  // Header border glow classes based on status
  const borderStatusClass = isCurrentlyTyping
    ? `border-navy-300 ring-2 ring-navy-500/10 shadow-card`
    : isFullyComplete
    ? "border-slate-200 shadow-soft"
    : "border-slate-200 shadow-3xs";

  return (
    <motion.div
      style={{
        y: yOffset,
        x: xOffset,
        scale: scaleVal,
        rotate: rotateVal,
        zIndex: zIndexVal,
      }}
      className={`absolute w-[92vw] sm:w-[85vw] md:w-full max-w-2xl rounded-xl border bg-white dark:bg-ink-900 flex flex-col h-[180px] md:h-[224px] transition-shadow duration-300 hover:shadow-card ${borderStatusClass}`}
      id={`code-card-${id}`}
    >
      {/* Editorial corner details */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-300 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-300 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-300 pointer-events-none" />

      {/* Code Editor Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-ink-800 border-b border-slate-200 dark:border-white/10 select-none rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-rose-450" />
          <div className="h-2 w-2 rounded-full bg-amber-450" />
          <div className="h-2 w-2 rounded-full bg-emerald-450" />
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-slate-200/80 dark:border-white/10 bg-white dark:bg-ink-900 px-2.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 shadow-3xs font-semibold">
          {icon}
          <span>{name}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-455">
          {isCurrentlyTyping ? (
            <span className="text-navy-700 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-navy-600 animate-ping" />
              SYNTHESIZING...
            </span>
          ) : isFullyComplete ? (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Code className="h-2.5 w-2.5 text-emerald-550" />
              COMPLETE
            </span>
          ) : (
            <span className="text-slate-400">QUEUED</span>
          )}
        </div>
      </div>

      {/* Editor Content Area */}
      <div 
        ref={editorRef}
        className="flex-1 p-3.5 md:p-4.5 overflow-y-auto overflow-x-auto font-mono text-[10px] md:text-[11.5px] text-left text-slate-700 dark:text-slate-300 bg-white dark:bg-ink-900 leading-relaxed select-all scrollbar-thin"
      >
        <span className={`block mb-1.5 font-semibold text-[9.5px] md:text-[10px] text-${highlightColor}-600`}>
          {headerComment}
        </span>
        
        {lineRenderData.map((lineData, lIdx) => (
          <div key={lIdx} className="prefix-editor-line min-h-[1.1rem] flex items-start">
            <span className="w-5 text-slate-300 dark:text-slate-600 pr-2 text-right select-none text-[8.5px] md:text-[9px] leading-5 font-semibold">
              {String(lIdx + 1).padStart(2, "0")}
            </span>
            <span className="pl-0.5 whitespace-pre leading-5 text-slate-700 dark:text-slate-300 flex-1 relative">
              {/* Highlight and show typed text */}
              {lineData.typed.length > 0 && (
                <span>
                  {lineData.typed.split(/(\s+)/).map((word, wIdx) => {
                    const isKeyword = ["import", "def", "class", "return", "const", "new", "async", "await", "from", "with", "export", "default", "function"].some(k => word === k || word === `<${k}` || word === `</${k}>`);
                    if (isKeyword) {
                      return <span key={wIdx} className="text-navy-700 font-semibold">{word}</span>;
                    }
                    if (word.startsWith('"') || word.startsWith("'") || word.endsWith('"') || word.endsWith("'")) {
                      return <span key={wIdx} className="text-emerald-600 font-normal">{word}</span>;
                    }
                    if (word.includes("@") || word.includes("def ") || word.includes("print")) {
                      return <span key={wIdx} className="text-indigo-600 font-semibold">{word}</span>;
                    }
                    return <span key={wIdx}>{word}</span>;
                  })}
                </span>
              )}
              {/* Invisible untyped filler text to hold layout dimensions perfectly */}
              {lineData.untyped.length > 0 && (
                <span className="opacity-0 select-none pointer-events-none">
                  {lineData.untyped}
                </span>
              )}
              {/* Cursor renders only at the active edge of typing */}
              {lineData.typed.length > 0 && lineData.untyped.length > 0 && (
                <span className="inline-block h-3.5 w-[3px] bg-navy-600 animate-pulse ml-0.5 align-middle" />
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Footer bar */}
      <div className="px-4 py-1.5 bg-slate-50 dark:bg-ink-800 border-t border-slate-150 dark:border-white/10 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono select-none rounded-b-xl">
        <span className="flex items-center gap-1 font-semibold text-slate-500">
          {isFullyComplete ? (
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-emerald-500" /> COMPLETE
            </span>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              {id.toUpperCase()} MODULE LOADED
            </>
          )}
        </span>
        <span>Lines: {code.length}</span>
      </div>
    </motion.div>
  );
}

interface StageCodeIntroProps {
  progress?: number;
}

export default function StageCodeIntro({}: StageCodeIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track context scroll progress across this module section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollVal(latest);
    });
  }, [scrollYProgress]);

  // Defined three tabs based on chronological progression requirements:
  // Tab 1 (server.py) first, Tab 2 (AGENTS.md) second, Tab 3 (App.tsx) third
  const tabs = [
    {
      id: "server",
      name: "server.py",
      icon: <Terminal className="h-3 w-3 text-emerald-500" />,
      headerComment: "# Step 01: Python Asyncio Metric Dispatcher",
      highlightColor: "emerald",
      startScroll: 0.15,
      endScroll: 0.40,
      code: [
        "import asyncio, json, random",
        "from websockets import serve",
        "",
        "async def telemetry_stream(websocket, path):",
        "    while True:",
        "        payload = {",
        '            "cpu": random.randint(12, 38),',
        '            "memory": round(random.uniform(42.1, 78.9), 1),',
        '            "status": "HEALTHY"',
        "        }",
        "        await websocket.send(json.dumps(payload))",
        "        await asyncio.sleep(0.75)",
        "",
        "async def main():",
        '    async with serve(telemetry_stream, "0.0.0.0", 3001):',
        "        await asyncio.Future()",
        "",
        'if __name__ == "__main__":',
        "    asyncio.run(main())"
      ]
    },
    {
      id: "agents",
      name: "AGENTS.md",
      icon: <Bot className="h-3 w-3 text-amber-500" />,
      headerComment: "<!-- Step 02: AI Copilot Instruction Mandates & Guardrails -->",
      highlightColor: "amber",
      startScroll: 0.42,
      endScroll: 0.68,
      code: [
        "# Agent System Rules - HeliumSol Prototyping",
        "1. Strictly prevent non-secure custom backend triggers.",
        "2. Utilize the @google/genai SDK for real-time model telemetry.",
        "3. Ensure Vite processes bind directly to host 0.0.0.0 and port 3000.",
        "4. Enforce high-contrast slate editorial styling across all screens.",
        "5. Guard against infinite React re-renders in dependency arrays."
      ]
    },
    {
      id: "tsx",
      name: "App.tsx",
      icon: <FileCode className="h-3 w-3 text-navy-600" />,
      headerComment: "// Step 03: React Applet UI with Realtime Charts",
      highlightColor: "blue",
      startScroll: 0.70,
      endScroll: 0.95,
      code: [
        'import React, { useState, useEffect } from "react";',
        'import { LineChart, ResponsiveContainer, Line, YAxis } from "recharts";',
        "",
        "export default function App() {",
        "  const [telemetry, setTelemetry] = useState({ cpu: 0, memory: 0 });",
        "  useEffect(() => {",
        '    const socket = new WebSocket("ws://localhost:3000/api/telemetry");',
        "    socket.onmessage = (e) => setTelemetry(JSON.parse(e.data));",
        "    return () => socket.close();",
        "  }, []);",
        "  return (",
        '    <div className="p-8 max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl">',
        '      <h1 className="text-3xl font-serif text-slate-800">HeliumSol Diagnostics</h1>',
        '      <p className="text-xs text-slate-500 uppercase mt-2">Latency: {telemetry.cpu}ms</p>',
        "    </div>",
        "  );",
        "}"
      ]
    }
  ];

  // Measured after mount so the first client render matches the pre-render.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 1. Scale growth factor as user scrolls. Starts compact, expands to target size
  const startScale = 0.65;
  const targetScale = 0.98;
  const currentScale = startScale + Math.min(scrollVal * 1.5, 1) * (targetScale - startScale);

  // 2. Vertical spacing calculations that PUSH components apart as scroll progress advances
  const stackOffsetFactor = 1 - Math.min(scrollVal * 1.8, 1);

  const initialX1 = isMobile ? -14 : -32;
  const initialX3 = isMobile ? 14 : 32;
  const initialY1 = -24;
  const initialY3 = 24;

  // The spread distance vertically between tabs should increase dramatically
  // to give them generous negative space and prevent overlapping titles
  const maxSpreadDistance = isMobile ? 190 : 255; 
  const spreadProgress = Math.min(scrollVal * 1.75, 1); // fully pushed apart around 57% scroll progress to avoid overlaps

  const y1 = (stackOffsetFactor * initialY1) + (spreadProgress * -maxSpreadDistance);
  const y2 = 0;
  const y3 = (stackOffsetFactor * initialY3) + (spreadProgress * maxSpreadDistance);

  const x1 = stackOffsetFactor * initialX1;
  const x2 = 0;
  const x3 = stackOffsetFactor * initialX3;

  const r1 = stackOffsetFactor * -2.5;
  const r2 = stackOffsetFactor * 1.5;
  const r3 = stackOffsetFactor * -1.0;

  return (
    <div ref={containerRef} className="relative w-full h-[320vh]">
      {/* Sticky Viewport Wrapper */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-white dark:bg-ink-950">

        {/* Background Grid Lines to enhance the aesthetic */}
        <div className="absolute inset-0 grid-lines bg-[size:4rem] pointer-events-none" />

        {/* Floating status tag */}
        <div className="absolute left-6 top-6 md:top-24 z-30 hidden sm:flex items-center gap-2 border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 py-1 px-2.5 rounded-lg text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold shadow-soft uppercase select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-navy-600 animate-pulse" />
          <span>SYNTH_PIPELINE: {Math.round(scrollVal * 100)}%</span>
        </div>

        {/* Header - Configured with proper safe margins to avoid any overlaps with the code card stack */}
        <div className="absolute top-6 md:top-14 left-0 right-0 text-center max-w-xl mx-auto z-10 px-4 select-none">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-navy-600 dark:text-navy-300 block mb-2 font-display">
            Module 01 — Synthesizer
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-semibold text-slate-900 dark:text-white leading-tight">
            Code Synthesis Loop
          </h2>
          <p className="text-[11.5px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2 font-sans leading-relaxed max-w-md mx-auto">
            Scroll down to watch code stack expand. First <b>server.py</b> types, then <b>AGENTS.md</b>, and finally <b>App.tsx</b> structures.
          </p>
        </div>

        {/* Dynamic Accordion Canvas Area */}
        <div className="relative w-full flex-1 flex items-center justify-center pt-24 pb-8 md:pt-40">
          
          <div className="relative w-full max-w-3xl h-[260px] md:h-[325px] flex items-center justify-center">
            
            {/* Tab 1: server.py (Moves up) */}
            <CodeEditorCard
              {...tabs[0]}
              scrollVal={scrollVal}
              yOffset={y1}
              xOffset={x1}
              rotateVal={r1}
              scaleVal={currentScale}
              zIndexVal={5 + Math.floor(scrollVal * 5)}
            />

            {/* Tab 2: AGENTS.md (Middle) */}
            <CodeEditorCard
              {...tabs[1]}
              scrollVal={scrollVal}
              yOffset={y2}
              xOffset={x2}
              rotateVal={r2}
              scaleVal={currentScale}
              zIndexVal={20}
            />

            {/* Tab 3: App.tsx (Moves down) */}
            <CodeEditorCard
              {...tabs[2]}
              scrollVal={scrollVal}
              yOffset={y3}
              xOffset={x3}
              rotateVal={r3}
              scaleVal={currentScale}
              zIndexVal={5 + Math.floor((1 - scrollVal) * 5)}
            />

          </div>

        </div>

      </div>
    </div>
  );
}
