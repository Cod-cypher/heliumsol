/**
 * Transcript + composer, bound to the shared conversation in ChatProvider.
 *
 * Rendered by the floating panel and by the inline chat in the homepage's AI
 * assistant section, so both show — and send into — the same thread.
 */

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { CHAT_INPUT_PLACEHOLDER } from '../../content/chat';
import { useChat } from './ChatProvider';
import ChatMessageList from './ChatMessageList';
import { ChatStatusBar } from './ChatActivity';

interface Props {
  /** Focus the composer on mount (the floating panel does; inline does not). */
  autoFocus?: boolean;
  initialDraft?: string;
  placeholder?: string;
  /** Unique per surface, so two composers on one page do not share an id. */
  idPrefix: string;
  className?: string;
}

export default function ChatConversation({
  autoFocus = false,
  initialDraft = '',
  placeholder = CHAT_INPUT_PLACEHOLDER,
  idPrefix,
  className = '',
}: Props) {
  const {
    session,
    messages,
    starting,
    awaitingReply,
    sending,
    sendError,
    activity,
    handoffOutcome,
    sendText,
    clearSendError,
  } = useChat();
  const [draft, setDraft] = useState(initialDraft);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  const submit = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft('');
    const ok = await sendText(text);
    if (!ok) setDraft((d) => d || text);
    inputRef.current?.focus();
  };

  const closed = session?.status === 'CLOSED';

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      <ChatMessageList
        messages={messages}
        starting={starting}
        awaitingReply={awaitingReply}
        activity={activity}
        agentLabel={session?.agentLabel}
      />

      {!activity && (
        <ChatStatusBar
          status={session?.status}
          agentLabel={session?.agentLabel}
          handoffOutcome={handoffOutcome}
        />
      )}

      {sendError && (
        <p role="alert" className="px-4 pb-2 text-xs text-red-600 dark:text-red-400 leading-relaxed">
          {sendError}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-ink-800 p-3 flex items-end gap-2"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <label htmlFor={`${idPrefix}-input`} className="sr-only">
          Your message
        </label>
        <textarea
          id={`${idPrefix}-input`}
          ref={inputRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (sendError) clearSendError();
          }}
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter is a newline.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder={placeholder}
          disabled={closed}
          className="flex-1 resize-none max-h-28 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3.5 py-2.5 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 disabled:opacity-60 transition-colors"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || closed}
          aria-label="Send message"
          className="shrink-0 h-10 w-10 grid place-items-center rounded-lg bg-navy-800 dark:bg-navy-600 text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 active:scale-95 transition-all cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/10 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
