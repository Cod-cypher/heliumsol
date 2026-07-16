export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  tech: string[];
  color: {
    bg: string;
    text: string;
    border: string;
    accent: string;
  };
  mockupType: "dashboard" | "commerce" | "analytics" | "canvas";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export interface NodeService {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  color: string; // Pastel tailwind class prefix (e.g. 'indigo')
  status: "idle" | "pulse" | "success";
  position: { x: number; y: number };
}

export interface NodeConnection {
  from: string;
  to: string;
  active: boolean;
}
