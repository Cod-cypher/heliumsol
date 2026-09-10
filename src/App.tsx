/**
 * Router and page shell.
 *
 * The site is served with an SPA fallback (any unmatched path returns
 * index.html), so the path is read here and the matching view rendered. There
 * is no routing library: three routes did not justify the dependency, and this
 * mirrors how the sibling optimizeindex site resolves its own marketing views.
 *
 * Navbar and Footer are rendered around every view so the chrome is identical
 * on the homepage and the legal pages.
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LegalPage from "./pages/LegalPage";
import { PRIVACY, TERMS, SMS_PROGRAM } from "./content/legal";
import { getRoute, applyRouteMeta } from "./routes";

export default function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  /*
    One listener serves both the browser's back/forward buttons and the
    synthetic popstate that routes.ts dispatches after a pushState, so in-app
    links and browser history stay in sync without a second code path.
  */
  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const route = getRoute(pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    applyRouteMeta(route);

    /*
      Scroll to the top on navigation, but never on the initial render — doing
      it there would fight the browser over restoring a reload position and
      would break a deep link to a homepage anchor such as /#services.
    */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-ink-950 text-slate-800 dark:text-slate-200 antialiased font-sans">
      {/* Floating navigation rail */}
      <Navbar />

      {route.view === "privacy" ? (
        <LegalPage doc={PRIVACY} />
      ) : route.view === "terms" ? (
        <LegalPage doc={TERMS} />
      ) : route.view === "sms" ? (
        <LegalPage doc={SMS_PROGRAM} />
      ) : (
        <HomePage />
      )}

      {/* Footer credits and information */}
      <Footer />
    </div>
  );
}
