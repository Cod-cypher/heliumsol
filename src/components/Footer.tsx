import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { BOOKING_URL, CONTACT } from "../constants";
import { navigate } from "../routes";
import { SIGNUP_PATH } from "../site";
import { SERVICES } from "../content/services";

export default function Footer() {
  /*
    Real hrefs, intercepted for client-side navigation. Keeping the href means
    the links are still middle-clickable, still open in a new tab, and are
    still followed by anything that reads the markup rather than clicking.
  */
  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "SMS Program", href: "/sms-program" },
  ];

  const serviceLinks = SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}` }));

  const companyLinks = [
    { label: "Free website + chatbot", href: SIGNUP_PATH },
    { label: "About", href: "/about" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "How we work", href: "/#process" },
    { label: "Contact", href: BOOKING_URL },
  ];

  return (
    <footer className="bg-slate-50/60 dark:bg-ink-900/40 border-t border-slate-200/90 dark:border-white/10 py-16 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Logo column (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4 text-left">
            <a href="/" className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 dark:bg-navy-600 shadow-inner">
                <span aria-hidden="true" className="font-display text-sm font-extrabold text-white leading-none">H</span>
              </div>
              <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Helium<span className="text-navy-700 dark:text-navy-300 font-semibold">Sol</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm font-normal leading-relaxed">
              A full-service digital agency building websites, apps, chatbots, and automation —
              built to help growing businesses ship faster and get results.
            </p>
          </div>

          {/* Link columns (8 cols total) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 font-display uppercase tracking-widest mb-4">
                Services
              </h3>
              <ul className="flex flex-col gap-2.5">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors font-medium">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left">
              <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 font-display uppercase tracking-widest mb-4">
                Company
              </h3>
              <ul className="flex flex-col gap-2.5">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-xs text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors font-medium">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left col-span-2 sm:col-span-1">
              <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 font-display uppercase tracking-widest mb-4">
                Get in touch
              </h3>
              <ul className="flex flex-col gap-3 mb-4">
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors font-medium">
                    <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors font-medium">
                    <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    {CONTACT.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  {CONTACT.location}
                </li>
              </ul>
              <a
                href={BOOKING_URL}
                className="group inline-flex items-center gap-1.5 rounded-lg bg-navy-800 dark:bg-navy-600 px-3.5 py-2 text-xs font-semibold text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all"
              >
                Contact us
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Closing Row */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span>© {new Date().getFullYear()} HeliumSol. HeliumSol is a brand of Idea Brothers LLC. All rights reserved.</span>
          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.href);
                }}
                className="hover:text-navy-700 dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
