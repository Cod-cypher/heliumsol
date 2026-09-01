/**
 * The marketing homepage — the scroll-driven sequence that was previously the
 * entire body of App.tsx.
 *
 * Extracted when the legal pages were added so App.tsx could become the router
 * and this file could stay the page. The section order is unchanged.
 */

import Hero from "../components/Hero";
import Services from "../components/Services";
import ScrollOrchestrator from "../components/ScrollOrchestrator";
import Process from "../components/Process";
import Testimonials from "../components/Testimonials";
import ClosingCTA from "../components/ClosingCTA";
import FloatingChatButton from "../components/FloatingChatButton";

export default function HomePage() {
  return (
    <>
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

      {/*
        Lives here rather than in App because it scrolls to #chatbot-stage-container,
        which only exists on this page. On a legal page the button would be a
        no-op, so it simply is not rendered there.
      */}
      <FloatingChatButton />
    </>
  );
}
