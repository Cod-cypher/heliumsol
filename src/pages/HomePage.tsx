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
import Commitments from "../components/Commitments";
import ClosingCTA from "../components/ClosingCTA";

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

        {/* What working with us involves */}
        <Commitments />

        {/* Closing call to action */}
        <ClosingCTA />
      </main>
    </>
  );
}
