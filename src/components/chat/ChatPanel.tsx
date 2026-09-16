/**
 * The floating chat panel.
 *
 * Lazy-loaded on first open. On mobile it is a full-screen sheet; on desktop a
 * card above the launcher that deliberately does not trap focus — a chat widget
 * is an aside, not a modal over the page someone is reading.
 */

import { useEffect, useState } from 'react';
import { Bell, BellOff, RotateCcw, X } from 'lucide-react';
import {
  CHAT_NEW_CHAT_CONFIRM,
  CHAT_NEW_CHAT_LABEL,
  CHAT_PANEL_TITLE,
} from '../../content/chat';
import { isMuted, setMuted } from '../../lib/chatNotify';
import { useChat } from './ChatProvider';
import ChatConversation from './ChatConversation';
import ChatForm from './ChatForm';

/** How long the reset button stays armed before going back to its label. */
const CONFIRM_WINDOW_MS = 4000;

export default function ChatPanel() {
  const { session, messages, prefill, closePanel, reset } = useChat();
  const [muted, setMutedState] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  useEffect(() => {
    if (!confirmingReset) return;
    const t = window.setTimeout(() => setConfirmingReset(false), CONFIRM_WINDOW_MS);
    return () => window.clearTimeout(t);
  }, [confirmingReset]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKeyDown);

    // Only lock the page behind a full-screen sheet.
    let previousOverflow = '';
    if (isMobile) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (isMobile) document.body.style.overflow = previousOverflow;
    };
  }, [closePanel, isMobile]);

  const isForm = session?.mode === 'form';
  const iconButton =
    'h-8 w-8 grid place-items-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer';

  return (
    <div
      id="hs-chat-panel"
      role="dialog"
      aria-modal={isMobile ? 'true' : 'false'}
      aria-labelledby="hs-chat-title"
      className={[
        'fixed z-50 flex flex-col overflow-hidden bg-white dark:bg-ink-900',
        'border border-slate-200 dark:border-white/10 shadow-card',
        'inset-0 sm:inset-auto sm:bottom-24 sm:right-6',
        'sm:w-[380px] sm:h-[min(620px,calc(100dvh-8rem))] sm:rounded-2xl',
      ].join(' ')}
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-800 dark:bg-navy-600 text-white">
            <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
              <path d="M10 8h3.5v6.25h5V8H22v16h-3.5v-6.25h-5V24H10Z" fill="currentColor" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-ink-900" />
          </span>
          <div className="min-w-0">
            <h2 id="hs-chat-title" className="font-display text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {CHAT_PANEL_TITLE}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              AI assistant · a person can join
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {session?.id && !isForm && messages.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (!confirmingReset) {
                  setConfirmingReset(true);
                  return;
                }
                setConfirmingReset(false);
                reset();
              }}
              aria-label={confirmingReset ? CHAT_NEW_CHAT_CONFIRM : CHAT_NEW_CHAT_LABEL}
              title={CHAT_NEW_CHAT_LABEL}
              className={
                confirmingReset
                  ? 'h-8 px-2.5 rounded-lg bg-navy-50 dark:bg-navy-900/60 text-navy-700 dark:text-navy-200 text-[11px] font-semibold cursor-pointer'
                  : iconButton
              }
            >
              {confirmingReset ? CHAT_NEW_CHAT_CONFIRM : <RotateCcw size={15} aria-hidden="true" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const next = !muted;
              setMuted(next);
              setMutedState(next);
            }}
            aria-label={muted ? 'Turn message sound on' : 'Turn message sound off'}
            aria-pressed={muted}
            className={iconButton}
          >
            {muted ? <BellOff size={15} aria-hidden="true" /> : <Bell size={15} aria-hidden="true" />}
          </button>
          <button type="button" onClick={closePanel} aria-label="Close chat" className={iconButton}>
            <X size={17} aria-hidden="true" />
          </button>
        </div>
      </header>

      {isForm ? (
        <ChatForm notice={session?.notice} onDone={closePanel} />
      ) : (
        <ChatConversation key={prefill} idPrefix="hs-chat" autoFocus initialDraft={prefill} />
      )}
    </div>
  );
}
