import { motion, useScroll } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, Database, Send, Mail, Slack, BarChart2, Globe, Sparkles, AlertCircle, Play, CheckCircle2 
} from "lucide-react";
import { NodeService, NodeConnection } from "../types";

interface StageAutomationEngineProps {
  progress?: number; 
}

export default function StageAutomationEngine({ progress = 0.55 }: StageAutomationEngineProps) {
  // Section reference to track local scroll progress
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const [localScroll, setLocalScroll] = useState(0.5);

  // Set after mount: a clock read during render differs between the build-time
  // pre-render and the browser, which breaks hydration.
  const [logTime, setLogTime] = useState("--:--:--");
  useEffect(() => {
    setLogTime(new Date().toLocaleTimeString([], { hour12: false }));
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setLocalScroll(latest);
    });
  }, [scrollYProgress]);

  // Measured width of parent box to calculate CSS scaling
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(780);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width || 780);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Standard safe node definitions (Virtual Space matches 780 width, 360 height)
  const virtualW = 780;
  const virtualH = 340;
  
  // Calculate precise responsive scale factor
  const scale = Math.min(1, containerWidth / (virtualW + 32)); // safe margins

  // State to hold draggable node positions inside our virtual canvas
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number } }>({
    api: { x: 40, y: 70 },
    database: { x: 40, y: 230 },
    agent: { x: 310, y: 150 },
    analytics: { x: 310, y: 280 },
    crm: { x: 580, y: 40 },
    email: { x: 580, y: 150 },
    slack: { x: 580, y: 260 },
  });

  // Base configurations
  const nodes = [
    { id: "api", label: "External API Trigger", icon: "Globe", color: "emerald", status: "success" },
    { id: "database", label: "Postgres DB Sync", icon: "Database", color: "amber", status: "pulse" },
    { id: "agent", label: "HeliumSol AI Agent", icon: "Cpu", color: "blue", status: "pulse" },
    { id: "analytics", label: "Realtime Analytics", icon: "BarChart2", color: "indigo", status: "success" },
    { id: "crm", label: "Salesforce CRM", icon: "Sparkles", color: "pink", status: "idle" },
    { id: "email", label: "Transactional SMTP", icon: "Mail", color: "rose", status: "success" },
    { id: "slack", label: "Enterprise Slack", icon: "Slack", color: "sky", status: "pulse" },
  ];

  const connections: NodeConnection[] = [
    { from: "api", to: "agent", active: true },
    { from: "database", to: "agent", active: true },
    { from: "agent", to: "crm", active: true },
    { from: "agent", to: "email", active: true },
    { from: "agent", to: "slack", active: true },
    { from: "agent", to: "analytics", active: true },
  ];

  // Track pointer dragging state across the scaled window viewport
  const [activeDragNode, setActiveDragNode] = useState<string | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    pointerX: number;
    pointerY: number;
  } | null>(null);

  const handlePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.preventDefault();
    const pos = nodePositions[nodeId] || { x: 0, y: 0 };
    dragStartRef.current = {
      startX: pos.x,
      startY: pos.y,
      pointerX: e.clientX,
      pointerY: e.clientY
    };
    setActiveDragNode(nodeId);
  };

  useEffect(() => {
    if (!activeDragNode) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const start = dragStartRef.current;
      if (!start) return;

      // Standard screenspace pointer distances
      const deltaX = e.clientX - start.pointerX;
      const deltaY = e.clientY - start.pointerY;

      // Convert screenspace distances to virtual canvas coordinates using scale ratio
      const virtualDeltaX = deltaX / scale;
      const virtualDeltaY = deltaY / scale;

      setNodePositions((prev) => {
        const newX = Math.max(5, Math.min(virtualW - nodeW - 5, start.startX + virtualDeltaX));
        const newY = Math.max(5, Math.min(virtualH - nodeH - 5, start.startY + virtualDeltaY));
        return {
          ...prev,
          [activeDragNode]: { x: newX, y: newY }
        };
      });
    };

    const handleWindowPointerUp = () => {
      setActiveDragNode(null);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [activeDragNode, scale]);

  const renderNodeIcon = (iconName: string) => {
    const iconClass = "h-4 w-4 stroke-[1.8]";
    switch (iconName) {
      case "Globe": return <Globe className={`${iconClass} text-emerald-600`} />;
      case "Database": return <Database className={`${iconClass} text-amber-600`} />;
      case "Cpu": return <Cpu className={`${iconClass} text-navy-600`} />;
      case "BarChart2": return <BarChart2 className={`${iconClass} text-indigo-600`} />;
      case "Sparkles": return <Sparkles className={`${iconClass} text-pink-600`} />;
      case "Mail": return <Mail className={`${iconClass} text-rose-600`} />;
      case "Slack": return <Slack className={`${iconClass} text-sky-600`} />;
      default: return <Cpu className={`${iconClass} text-slate-600`} />;
    }
  };

  const getNodeStyles = (color: string) => {
    switch (color) {
      case "emerald": return { bg: "bg-emerald-50/80 border-emerald-200/90", border: "border-emerald-500", text: "text-emerald-800", particle: "#10b981" };
      case "amber": return { bg: "bg-amber-50/80 border-amber-200/90", border: "border-amber-500", text: "text-amber-800", particle: "#f59e0b" };
      case "blue": return { bg: "bg-navy-50 border-navy-200/90", border: "border-navy-500", text: "text-navy-800", particle: "#243f63" };
      case "indigo": return { bg: "bg-indigo-50/80 border-indigo-200/90", border: "border-indigo-500", text: "text-indigo-800", particle: "#6366f1" };
      case "pink": return { bg: "bg-pink-50/80 border-pink-200/90", border: "border-pink-500", text: "text-pink-800", particle: "#ec4899" };
      case "rose": return { bg: "bg-rose-50/80 border-rose-200/90", border: "border-rose-500", text: "text-rose-800", particle: "#f43f5e" };
      case "sky": return { bg: "bg-sky-50/80 border-sky-200/90", border: "border-sky-500", text: "text-sky-805", particle: "#0ea5e9" };
      default: return { bg: "bg-slate-50 border-slate-200", border: "border-slate-500", text: "text-slate-800", particle: "#64748b" };
    }
  };

  // Bezier curve calculations for connections
  const getBezierPath = (fromX: number, fromY: number, toX: number, toY: number) => {
    const handleOffset = Math.abs(toX - fromX) * 0.45;
    return `M ${fromX} ${fromY} C ${fromX + handleOffset} ${fromY}, ${toX - handleOffset} ${toY}, ${toX} ${toY}`;
  };

  // Rigid dimensions of each card inside virtual view box
  const nodeW = 160;
  const nodeH = 46;

  // Active pulsing velocity speeds up when scrolled further
  const speedFactor = Math.max(0.3, Math.min(1.8, localScroll * 1.5));
  const particleDur = `${3.0 / speedFactor}s`;

  return (
    <div 
      ref={sectionRef} 
      className="relative w-full h-full flex flex-col justify-center py-6 px-4 sm:px-6"
      id="neural-integrations-container"
    >
      
      {/* Editorial Title */}
      <div className="text-center max-w-xl mx-auto mb-8 select-none">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 block mb-2 font-display">
          04 — Intelligence Canvas
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-semibold text-slate-800 dark:text-white">
          Neural Integrations
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-sans leading-relaxed">
          Interact directly with compilation triggers. <b>Drag any node</b> around with your cursor inside the canvas—the connections adjust in real-time. <b>Scroll down</b> to speed up data packets.
        </p>
      </div>

      {/* Main Board Container */}
      <div 
        ref={containerRef}
        className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200/85 dark:border-white/10 bg-white dark:bg-ink-900 shadow-card p-4 relative overflow-hidden flex flex-col"
      >

        {/* Dynamic Telemetry Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3 mb-4 select-none">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display">
              Pipeline Flow Graph: active_router_synced
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Flow Rate: {(speedFactor * 10).toFixed(1)}x
            </span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Live Workspace Active
            </span>
          </div>
        </div>

        {/* Dynamic perfectly aligned grid view sandbox */}
        <div 
          className="relative w-full overflow-hidden flex items-center justify-center bg-[#fafbfc]/80 dark:bg-ink-950/60 rounded-xl border border-slate-100/70 dark:border-white/5"
          style={{ height: virtualH * scale }}
        >
          {/* Draggable scaling whiteboard */}
          <div 
            className="absolute origin-center select-none"
            style={{
              width: virtualW,
              height: virtualH,
              transform: `scale(${scale})`,
            }}
          >
            
            {/* SVG Wires Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="glowing-wire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9db4d6" />
                  <stop offset="50%" stopColor="#243f63" />
                  <stop offset="100%" stopColor="#c5d4e8" />
                </linearGradient>
              </defs>

              {connections.map((conn, idx) => {
                const fromPos = nodePositions[conn.from];
                const toPos = nodePositions[conn.to];

                if (!fromPos || !toPos) return null;

                // Connection Ports: Output is mid-right, Input is mid-left
                const fromX = fromPos.x + nodeW;
                const fromY = fromPos.y + nodeH / 2;
                const toX = toPos.x;
                const toY = toPos.y + nodeH / 2;

                const pathStr = getBezierPath(fromX, fromY, toX, toY);
                const colorMeta = getNodeStyles(nodes.find(n => n.id === conn.from)?.color || "blue");

                return (
                  <g key={idx}>
                    {/* Background visual cable jacket */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    {/* Core wire vector */}
                    <path
                      d={pathStr}
                      fill="none"
                      stroke="url(#glowing-wire-grad)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    {/* Active moving signal bubble */}
                    <circle r="4" fill={colorMeta.particle} className="drop-shadow-sm">
                      <animateMotion
                        dur={particleDur}
                        repeatCount="indefinite"
                        path={pathStr}
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* DOM Nodes Overlay Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {nodes.map((node) => {
                const pos = nodePositions[node.id] || { x: 0, y: 0 };
                const styles = getNodeStyles(node.color);

                return (
                  <motion.div
                    key={node.id}
                    onPointerDown={(e) => handlePointerDown(node.id, e)}
                    whileHover={{ scale: 1.04 }}
                    className="absolute cursor-grab active:cursor-grabbing pointer-events-auto select-none rounded-xl bg-white dark:bg-ink-800 border shadow-xs hover:shadow-md transition-shadow duration-200"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: nodeW,
                      height: nodeH,
                    }}
                  >
                    <div className={`w-full h-full flex items-center justify-between rounded-xl px-3 py-2 border ${styles.bg}`}>
                      
                      {/* Port connection dots */}
                      <div className="absolute -left-1 h-2 w-2 rounded-full border border-slate-300 bg-white shadow-3xs" />
                      
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-white border border-slate-100 flex items-center justify-center">
                          {renderNodeIcon(node.icon)}
                        </div>
                        <div className="text-left leading-tight">
                          <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">
                            {node.label}
                          </h4>
                        </div>
                      </div>

                      {/* Micro pulse signals */}
                      <div className="flex items-center">
                        {node.status === "pulse" ? (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.border}`} />
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.border}`} />
                          </span>
                        ) : node.status === "success" ? (
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        ) : (
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <div className="absolute -right-1 h-2 w-2 rounded-full border border-slate-300 bg-white shadow-3xs" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Live Logger Footer Panel */}
        <div className="bg-slate-900 rounded-xl p-3 text-left font-mono text-[9px] sm:text-[10px] text-zinc-300 mt-4 flex items-center gap-4 overflow-x-auto min-h-[38px] select-none">
          <div className="flex items-center gap-1.5 text-emerald-400 border-r border-slate-800 pr-3 shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>LOGGER DRAG STATUS: ACTIVE</span>
          </div>
          <div className="flex gap-4 whitespace-nowrap">
            <span className="text-zinc-500">[{logTime}]</span>
            <span className="text-blue-400">Node coordinates recalculated successfully</span>
            <span className="text-emerald-400 font-semibold">GET /api/v1/telemetry 200 OK</span>
            <span className="text-amber-400">Scroll acceleration multiplier active</span>
          </div>
        </div>

      </div>
    </div>
  );
}
