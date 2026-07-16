import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";

export default function FloatingChatButton() {
  const goToChat = () => {
    document
      .getElementById("chatbot-stage-container")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={goToChat}
      aria-label="Chat with our agent"
      title="Chat with our agent"
      className="group fixed bottom-6 right-6 z-50 flex h-14 items-center rounded-full bg-navy-800 pl-4 pr-4 text-white shadow-card hover:bg-navy-900 active:scale-95 transition-all duration-300"
    >
      {/* Icon + online indicator */}
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-800 group-hover:ring-navy-900" />
        </span>
      </span>

      {/* Label expands on hover */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold group-hover:max-w-[180px] group-hover:ml-2.5 transition-all duration-300">
        Chat with our agent
      </span>
    </motion.button>
  );
}
