/**
 * The transcript.
 *
 * Messages render as plain text with line breaks preserved — no markdown, no
 * HTML. The only exception is the narrow allowlist handled by MessageText: our
 * own phone number and email become tappable anywhere, and a human agent's
 * message may carry a real URL. A link the model invented is never clickable.
 */

import { useEffect, useRef } from 'react';
import type { ChatMessageDTO } from '../../../shared/chatTypes';
import { CHAT_GREETING } from '../../content/chat';
import MessageText from './MessageText';
import { ChatActivitySteps } from './ChatActivity';
import type { ChatActivity } from './ChatProvider';

interface Props {
  messages: ChatMessageDTO[];
  starting: boolean;
  awaitingReply: boolean;
  /** What is in flight, shown as steps in place of a bare typing indicator. */
  activity?: ChatActivity | null;
  agentLabel?: string;
}

export default function ChatMessageList({ messages, starting, awaitingReply, activity, agentLabel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll the list itself, never the page — the inline homepage chat must not
  // yank the visitor's scroll position when a reply lands.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, awaitingReply, activity]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 bg-white dark:bg-ink-900"
    >
      {/*
        aria-live on the list, not each bubble. Replies arrive whole rather than
        streaming, so each new message is announced exactly once.
      */}
      <div aria-live="polite" aria-atomic="false" className="space-y-3">
        {/* Before a conversation exists, show the greeting it will open with. */}
        {messages.length === 0 && (
          <Bubble
            message={{
              id: 'greeting',
              seq: 0,
              role: 'ASSISTANT',
              content: CHAT_GREETING,
              kind: 'message',
              createdAt: '',
            }}
          />
        )}

        {messages.map((message) =>
          message.kind === 'notice' ? (
            <p
              key={message.id}
              className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 py-1"
            >
              {message.content}
            </p>
          ) : (
            <Bubble key={message.id} message={message} />
          ),
        )}
      </div>

      {activity ? (
        <div className="mt-3">
          <ChatActivitySteps activity={activity} agentLabel={agentLabel} />
        </div>
      ) : (
        (awaitingReply || (starting && messages.length === 0)) && (
          <div className="mt-3">
            <TypingIndicator />
          </div>
        )
      )}
    </div>
  );
}

function Bubble({ message }: { message: ChatMessageDTO }) {
  const mine = message.role === 'VISITOR';
  // Only decides whether a link may be clickable; a human typed it.
  const fromAgent = message.role === 'AGENT';

  return (
    <div className={mine ? 'flex justify-end' : 'flex justify-start'}>
      <div className="max-w-[85%]">
        {!mine && message.authorLabel && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            {message.authorLabel}
          </p>
        )}
        <div
          className={[
            'px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
            mine
              ? 'bg-navy-800 dark:bg-navy-600 text-white rounded-2xl rounded-br-md shadow-soft'
              : 'bg-slate-100 dark:bg-ink-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-white/10 rounded-2xl rounded-bl-md',
          ].join(' ')}
        >
          <MessageText content={message.content} fromAgent={fromAgent} />
        </div>
      </div>
    </div>
  );
}

/** Dots are decorative; the single status node carries the meaning. */
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-3.5 py-3 bg-slate-100 dark:bg-ink-800 border border-slate-200/70 dark:border-white/10 rounded-2xl rounded-bl-md">
        <span className="sr-only" role="status">
          Typing
        </span>
        <span className="flex gap-1.5 items-center" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-navy-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-navy-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-navy-400 animate-bounce" />
        </span>
      </div>
    </div>
  );
}
