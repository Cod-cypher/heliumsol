import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ScrollOrchestrator from "./components/ScrollOrchestrator";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import ClosingCTA from "./components/ClosingCTA";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-ink-950 text-slate-800 dark:text-slate-200 antialiased font-sans">
      {/* Floating navigation rail */}
      <Navbar />

      {/* Main content */}
      <main className="relative">
        {/* Hero — value proposition + primary CTA */}
        <Hero />

        {/* What we offer */}
        <Services />

        {/* Capability demos + portfolio (scroll-driven sequence) */}
        <ScrollOrchestrator />

        {/* How we work */}
        <Process />

        {/* Social proof */}
        <Testimonials />

        {/* Closing call to action */}
        <ClosingCTA />
      </main>

      {/* Footer credits and information */}
      <Footer />

      {/* Always-on floating chat shortcut to the agent view */}
      <FloatingChatButton />
    </div>
  );
}
