/**
 * Router and page shell.
 *
 * There is no routing library: the path is read here and the matching view
 * rendered. In the browser the path comes from window.location; at build time
 * src/entry-server.tsx passes it in, so every route pre-renders to real HTML.
 *
 * Navbar, Footer and the chat widget are rendered around every view so the
 * chrome is identical on each page. ChatProvider holds the one chat
 * conversation that the floating widget and the homepage's inline chat share.
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatWidget from "./components/chat/ChatWidget";
import ChatProvider from "./components/chat/ChatProvider";
import ConsentBanner from "./components/ConsentBanner";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import LegalPage from "./pages/LegalPage";
import NotFoundPage from "./pages/NotFoundPage";
import ServicesIndexPage from "./pages/ServicesIndexPage";
import ServicePage from "./pages/ServicePage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import SignupPage from "./pages/SignupPage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogCategoryPage from "./pages/BlogCategoryPage";
import PostPage from "./pages/PostPage";
import { PRIVACY, TERMS, SMS_PROGRAM } from "./content/legal";
import { getRoute, applyRouteMeta, navigate, ROUTES, type RouteMeta } from "./routes";
import { trackPageViewStart } from "./lib/tracker";
import { trackPageView } from "./lib/analytics";

const INTERNAL_PATHS = new Set(ROUTES.map((r) => r.path));

function renderView(route: RouteMeta) {
  switch (route.view) {
    case "home":
      return <HomePage />;
    case "contact":
      return <ContactPage />;
    case "about":
      return <AboutPage />;
    case "caseStudies":
      return <CaseStudiesPage />;
    case "signup":
      return <SignupPage />;
    case "services":
      return <ServicesIndexPage />;
    case "service":
      return <ServicePage slug={route.slug} />;
    case "landing":
      return <LandingPage slug={route.slug} />;
    case "blog":
      return <BlogIndexPage />;
    case "blogCategory":
      return <BlogCategoryPage category={route.category} />;
    case "post":
      return <PostPage key={route.slug} slug={route.slug} />;
    case "privacy":
      return <LegalPage doc={PRIVACY} />;
    case "terms":
      return <LegalPage doc={TERMS} />;
    case "sms":
      return <LegalPage doc={SMS_PROGRAM} />;
    case "notfound":
      return <NotFoundPage />;
  }
}

export default function App({ initialPath }: { initialPath?: string }) {
  const [pathname, setPathname] = useState(
    () => initialPath ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
  );

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

  /*
    Plain <a href="/contact"> links anywhere on the site navigate client-side.
    Links with a hash (/#services), modifier keys, targets or other origins are
    left to the browser.
  */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      if (!INTERNAL_PATHS.has(url.pathname)) return;
      e.preventDefault();
      navigate(url.pathname + url.search);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const route = getRoute(pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    applyRouteMeta(route);
    trackPageViewStart(window.location.pathname + window.location.search);

    /*
      Scroll to the top on navigation, but never on the initial render — doing
      it there would fight the browser over restoring a reload position and
      would break a deep link to a homepage anchor such as /#services. The GA4
      tag records the first page view itself; only SPA navigations need one
      sent by hand.
    */
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    trackPageView(window.location.pathname + window.location.search);
  }, [route]);

  return (
    <ChatProvider>
    <div className="relative min-h-screen w-full bg-white dark:bg-ink-950 text-slate-800 dark:text-slate-200 antialiased font-sans">
      {/* Floating navigation rail */}
      <Navbar />

      {renderView(route)}

      {/* Footer credits and information */}
      <Footer />

      <ChatWidget />
      <ConsentBanner />
    </div>
    </ChatProvider>
  );
}
