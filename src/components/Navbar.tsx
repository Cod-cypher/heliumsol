import { motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { BOOKING_URL } from "../constants";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/#work" },
    { label: "Process", href: "/#process" },
    { label: "Why us", href: "/#how-we-work" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4"
    >
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-ink-900/80 px-6 py-3.5 shadow-soft backdrop-blur-xl">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-navy-800 dark:bg-navy-600 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <div className="w-4 h-4 bg-white rounded-xs rotate-45" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Helium<span className="text-navy-700 dark:text-navy-300 font-semibold">Sol</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors duration-250 relative group py-1"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-navy-700 dark:bg-navy-300 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <a
              href={BOOKING_URL}
              className="group hidden sm:flex items-center gap-2 rounded-lg bg-navy-800 dark:bg-navy-600 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all duration-300"
            >
              <span>Contact us</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-xl lg:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-navy-700 dark:hover:text-white py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 h-px bg-slate-100 dark:bg-white/10" />
            <div className="flex flex-col gap-2 pt-2">
              <a
                href="/#work"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-white/10 text-center py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                View our work
              </a>
              <a
                href={BOOKING_URL}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-navy-800 dark:bg-navy-600 text-center py-2.5 text-sm font-medium text-white shadow-sm hover:bg-navy-900 dark:hover:bg-navy-500"
              >
                Contact us
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
