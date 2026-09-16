/**
 * The floating chat launcher and panel.
 *
 * State lives in ChatProvider, shared with the inline chat on the homepage.
 * Renders nothing until after mount, so it adds nothing to pre-rendered HTML.
 * The panel is lazy: only the launcher ships in the page bundle.
 */

import { lazy, Suspense, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { CHAT_LAUNCHER_LABEL } from '../../content/chat';
import { useChat } from './ChatProvider';

export { OPEN_CHAT_EVENT, openChatWidget } from './ChatProvider';

const ChatPanel = lazy(() => import('./ChatPanel'));

export default function ChatWidget() {
  const { ready, open, unread, openPanel, closePanel } = useChat();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Return focus to the launcher when the panel closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  if (!ready) return null;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-expanded={open}
        aria-controls="hs-chat-panel"
        aria-label={open ? 'Close chat' : CHAT_LAUNCHER_LABEL}
        className={[
          'group fixed bottom-6 right-6 z-50 flex h-14 items-center rounded-full',
          'bg-navy-800 dark:bg-navy-600 px-4 text-white shadow-card',
          'hover:bg-navy-900 dark:hover:bg-navy-500 active:scale-95 transition-all duration-300 cursor-pointer',
          open ? 'hidden sm:flex' : 'flex',
        ].join(' ')}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <MessageSquare className="h-6 w-6" aria-hidden="true" />
          )}
          {!open && unread === 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-navy-800 dark:ring-navy-600" />
            </span>
          )}
        </span>

        {!open && (
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold group-hover:max-w-[180px] group-hover:ml-2.5 transition-all duration-300">
            {CHAT_LAUNCHER_LABEL}
          </span>
        )}

        {unread > 0 && !open && (
          <>
            <span
              className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-white dark:ring-ink-950"
              aria-hidden="true"
            >
              {unread > 9 ? '9+' : unread}
            </span>
            <span className="sr-only">{unread} new messages</span>
          </>
        )}
      </button>

      {open && (
        <Suspense fallback={null}>
          <ChatPanel />
        </Suspense>
      )}
    </>
  );
}
