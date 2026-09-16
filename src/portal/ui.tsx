/**
 * UI primitives for the private pages: admin login, chat inbox, loading states.
 *
 * Styled in the same navy / slate system as the public site (src/index.css
 * tokens, shadow-soft and shadow-card, dark mode through the .dark class), so
 * signing in does not feel like leaving HeliumSol.
 */

import type { ReactNode } from 'react';
import Logo from '../components/Logo';

/** Small uppercase section label, as used above every heading on the site. */
export function Eyebrow({ children, pulse = false }: { children: ReactNode; pulse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-navy-600 dark:text-navy-300 font-display">
      {pulse && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      )}
      {children}
    </span>
  );
}

export function Heading({
  children,
  level = 2,
  className = '',
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}) {
  const sizes = {
    1: 'text-4xl md:text-5xl leading-[1.1]',
    2: 'text-2xl sm:text-3xl leading-tight',
    3: 'text-lg sm:text-xl leading-snug',
  } as const;
  const Tag = (['h1', 'h2', 'h3'] as const)[level - 1];
  return (
    <Tag className={`font-display font-bold tracking-tight text-slate-900 dark:text-white ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
}

export function Card({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-5 shadow-soft ${
        hover ? 'transition-all hover:border-navy-200 dark:hover:border-white/20 hover:shadow-card' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-ink-950';

const BTN_SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
} as const;

const BTN_TONES = {
  primary: 'bg-navy-800 dark:bg-navy-600 text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500',
  outline:
    'border border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10',
  ghost: 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10',
  danger: 'border border-red-200 dark:border-red-400/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10',
} as const;

export type ButtonTone = keyof typeof BTN_TONES;

export function buttonClass(tone: ButtonTone = 'primary', size: keyof typeof BTN_SIZES = 'md') {
  return `${BTN_BASE} ${BTN_SIZES[size]} ${BTN_TONES[tone]}`;
}

export function Button({
  children,
  onClick,
  type = 'button',
  tone = 'primary',
  size = 'md',
  disabled,
  className = '',
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  tone?: ButtonTone;
  size?: keyof typeof BTN_SIZES;
  disabled?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${buttonClass(tone, size)} ${className}`}
    >
      {children}
    </button>
  );
}

export function Banner({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'warn' }) {
  const tones = {
    info: 'border-navy-100 dark:border-navy-800 bg-navy-50 dark:bg-navy-900/40 text-navy-800 dark:text-navy-100',
    error: 'border-red-200 dark:border-red-400/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
    warn: 'border-amber-200 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-200',
  } as const;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

/** Text input styling shared by the admin forms. */
export const inputClass =
  'block w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3.5 py-2.5 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 transition-colors';

export const labelClass = 'block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

/** Full-page loading state for the session check. */
export function PortalLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-ink-950 flex items-center justify-center px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-[260px] text-center">
        <div className="flex justify-center mb-6">
          <Logo size={30} />
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-navy-700 dark:bg-navy-400 animate-portal-sweep" />
        </div>
        <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">{label}…</p>
      </div>
    </div>
  );
}
