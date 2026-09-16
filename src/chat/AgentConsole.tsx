/**
 * The team's side of a live chat.
 *
 * Served from app-shell.html the same way /admin is, with the context injected
 * as window.__CHAT_AGENT__. Deliberately NOT a route in src/routes.ts: adding
 * one would oblige it to carry a canonical, a title, a description, a sitemap
 * entry, an llms.txt bullet and 700 words of body copy, all enforced by
 * scripts/verify-seo.ts, for a private page that must never be indexed.
 *
 * Kept plain on purpose. It is opened on a phone, usually in a hurry, to answer
 * someone who is waiting.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatAgentContext,
  ChatAgentPollResponse,
  ChatAgentViewResponse,
  ChatMessageDTO,
  VisitorState,
} from '../../shared/chatTypes';
import { mergeMessages } from '../lib/chat';
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from '../routes';
import {
  CHAT_AGENT_VISITOR_AWAY,
  CHAT_AGENT_VISITOR_GONE,
  CHAT_AGENT_VISITOR_HERE,
  CHAT_AGENT_VISITOR_LEFT_BANNER,
} from '../content/chat';
import MessageText from '../components/chat/MessageText';
import { playIncoming, setTabBadge, unlockAudio } from '../lib/chatNotify';
import { ArrowUp } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { buttonClass, inputClass } from '../portal/ui';

interface Props {
  context: ChatAgentContext;
}

const POLL_LIVE_MS = 2000;

/**
 * One-tap lines the agent can drop into the draft.
 *
 * The phone number and email are written as plain text, not as markup: the
 * transcript renderer recognises HeliumSol's own contact details and turns
 * them into tel: and mailto: links on the visitor's side (see
 * components/chat/MessageText.tsx). So the agent types words and the visitor
 * gets something tappable, with no way for anyone to inject a different target.
 */
const QUICK_REPLIES = [
  {
    label: 'Send call link',
    text: `Easiest is a quick call — tap ${CONTACT_PHONE_DISPLAY} and you will get one of us.`,
  },
  {
    label: 'Send email link',
    text: `You can also reach us at ${CONTACT_EMAIL} and we will reply there.`,
  },
  {
    label: 'Ask for a time',
    text: 'What time works for you in the next day or two? I will make sure someone is free.',
  },
] as const;

export default function AgentConsole({ context }: Props) {
  const [view, setView] = useState<ChatAgentViewResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  /**
   * The poll cursor, held in a ref rather than state.
   *
   * It was state, and the polling effect listed it as a dependency — so every
   * message tore the effect down and built it back up, cancelling the pending
   * timer and starting a fresh 2s wait. With messages arriving steadily that
   * means the poll keeps getting pushed back, and since the poll IS the
   * heartbeat the server uses to decide the agent is still here, a busy
   * conversation was the one most at risk of being handed back to the
   * assistant. Nothing re-renders on a cursor change, so a ref is the honest
   * type for it.
   */
  const cursorRef = useRef(0);
  const [joined, setJoined] = useState(context.joined);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [unread, setUnread] = useState(0);
  /**
   * Whether the visitor is still on the page.
   *
   * Starts as "away" rather than "here": at first paint nothing is known, and
   * guessing they are present is the guess that gets someone typing a careful
   * reply to an empty room. The first poll settles it within two seconds.
   */
  const [visitor, setVisitor] = useState<VisitorState>('away');
  const [visitorLastSeen, setVisitorLastSeen] = useState<string | undefined>();
  /** Previous value, so the alert fires on the edge and not on every tick. */
  const visitorRef = useRef<VisitorState>('away');
  /**
   * `joined` for the poll loop to read.
   *
   * Not the state directly: the poll effect deliberately depends on [id] alone,
   * because it is the heartbeat the server uses to decide someone is still
   * here, and every extra dependency is another thing that can tear the timer
   * down and restart the wait. A ref reads the current value without being one.
   */
  const joinedRef = useRef(context.joined);

  const endRef = useRef<HTMLDivElement>(null);
  const id = context.conversationId;

  /**
   * Takes the token out of the address bar as soon as the page is up.
   *
   * The join link is a bearer credential in a URL path. The cookie is already
   * set by the time this runs, so the token in the location bar is pure
   * liability — it would otherwise survive in browser history, in a screenshot
   * of the conversation, and in anything the agent pastes to a colleague.
   */
  useEffect(() => {
    if (window.location.pathname.startsWith('/chat/join/')) {
      window.history.replaceState({}, '', '/chat/agent');
    }
  }, []);

  const load = useCallback(async () => {
    const res = await fetch(`/api/chat/agent/${encodeURIComponent(id)}`, {
      credentials: 'same-origin',
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as ChatAgentViewResponse;
    setView(data);
    setMessages(data.messages);
    cursorRef.current = data.cursor;
    setJoined(data.joined);
    joinedRef.current = data.joined;
    setVisitor(data.visitor);
    visitorRef.current = data.visitor;
    setVisitorLastSeen(data.visitorLastSeenAt);
  }, [id]);

  useEffect(() => {
    void load().catch(() => setError('This conversation could not be loaded. The link may have expired.'));
  }, [load]);

  /* --- polling --------------------------------------------------------- */

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const tick = async () => {
      try {
        const query = new URLSearchParams({ after: String(cursorRef.current) });
        const res = await fetch(`/api/chat/agent/${encodeURIComponent(id)}/messages?${query}`, {
          credentials: 'same-origin',
        });
        if (res.ok) {
          const data = (await res.json()) as ChatAgentPollResponse;
          if (!cancelled && data.messages.length > 0) {
            setMessages((prev) => mergeMessages(prev, data.messages));
            cursorRef.current = data.cursor;

            // Only the visitor's own messages. The assistant's replies and the
            // agent's own echo are not things to be alerted about.
            const fromVisitor = data.messages.filter((m) => m.role === 'VISITOR').length;
            if (fromVisitor > 0) {
              playIncoming();
              if (document.visibilityState === 'hidden') setUnread((n) => n + fromVisitor);
            }
          }

          if (!cancelled && data.visitor) {
            /*
              Ring on the way out, once.

              The transition is what carries the information — "they just
              left", not "they are not here", which the pill already says and
              which would otherwise chime every two seconds forever. Only while
              joined: before that, nobody is mid-sentence to be interrupted.
            */
            if (visitorRef.current !== 'gone' && data.visitor === 'gone' && joinedRef.current) {
              playIncoming();
            }
            visitorRef.current = data.visitor;
            setVisitor(data.visitor);
            setVisitorLastSeen(data.visitorLastSeenAt);
          }
        }
      } catch {
        // Transient. The next tick retries.
      } finally {
        if (!cancelled) timer = window.setTimeout(tick, POLL_LIVE_MS);
      }
    };

    timer = window.setTimeout(tick, POLL_LIVE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  // The console is usually one tab among many. The count in the title is how a
  // waiting visitor gets noticed at all.
  useEffect(() => {
    setTabBadge(unread);
    return () => setTabBadge(0);
  }, [unread]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') setUnread(0);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  /*
    Tell the server on the way out.

    Best effort only, and deliberately not the mechanism this relies on:
    beforeunload does not fire on a crash, a killed tab, or a phone losing
    signal. The heartbeat in server/chat/presence.ts is what actually decides
    the agent has gone. This just makes the common case — closing the tab —
    hand back in a second instead of in thirty-five.
  */
  useEffect(() => {
    const onLeave = () => {
      if (!joined) return;
      navigator.sendBeacon?.(
        `/api/chat/agent/${encodeURIComponent(id)}/leave`,
        new Blob([JSON.stringify({ resumeBot: true })], { type: 'application/json' }),
      );
    };
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, [id, joined]);

  /* --- actions --------------------------------------------------------- */

  const join = async () => {
    // Inside the click, so the AudioContext starts running rather than
    // suspended and the first chime is actually audible.
    unlockAudio();
    setBusy(true);
    try {
      await fetch(`/api/chat/agent/${encodeURIComponent(id)}/join`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      setJoined(true);
      joinedRef.current = true;
      await load();
    } catch {
      setError('Could not join.');
    } finally {
      setBusy(false);
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;

    setBusy(true);
    setDraft('');
    try {
      const res = await fetch(`/api/chat/agent/${encodeURIComponent(id)}/message`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, cursor: cursorRef.current }),
      });
      const data = (await res.json()) as { messages: ChatMessageDTO[]; cursor: number };
      setMessages((prev) => mergeMessages(prev, data.messages || []));
      if (data.cursor > cursorRef.current) cursorRef.current = data.cursor;
    } catch {
      setError('That did not send.');
    } finally {
      setBusy(false);
    }
  };

  const leave = async (resumeBot: boolean) => {
    setBusy(true);
    try {
      await fetch(`/api/chat/agent/${encodeURIComponent(id)}/leave`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeBot }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  /* --- render ---------------------------------------------------------- */

  if (error) {
    return (
      <div className="min-h-dvh grid place-items-center bg-slate-50 dark:bg-ink-950 p-6 text-center">
        <div className="max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-8 shadow-card">
          <Logo size={26} className="mb-5" />
          <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Not available</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    /*
      h-dvh, not min-h-dvh: pinning the height to the viewport is what makes the
      transcript the only thing that scrolls, so the composer never falls below
      the fold on a long conversation.
    */
    <div className="h-dvh overflow-hidden flex flex-col bg-slate-50 dark:bg-ink-950 text-slate-800 dark:text-slate-200 font-sans">
      <header className="shrink-0 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Logo size={24} withIcon />
              <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-white/10 pl-3">
                Live chat
              </span>
            </div>
            <div className="flex items-center gap-2">
              {view && <PresencePill state={visitor} lastSeenAt={visitorLastSeen} />}
              <ThemeToggle />
            </div>
          </div>

          <h1 className="mt-3 font-display text-lg font-bold leading-tight text-slate-900 dark:text-white">
            {view?.visitorName || view?.visitorCompany || 'A visitor'}
            {view?.visitorName && view?.visitorCompany && (
              <span className="font-sans font-normal text-sm text-slate-500 dark:text-slate-400"> · {view.visitorCompany}</span>
            )}
          </h1>

          {/*
            Who, on what, and how else to reach them — without scrolling the
            transcript. Email and phone are real links: this is usually opened on
            a phone, and the fastest resolution is often to stop typing and call.
          */}
          <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {view?.visitorEmail && (
              <Fact label="Email" value={view.visitorEmail} href={`mailto:${view.visitorEmail}`} />
            )}
            {view?.visitorPhone && (
              <Fact
                label="Phone"
                value={view.visitorPhone}
                href={`tel:${view.visitorPhone.replace(/[^\d+]/g, '')}`}
              />
            )}
            {view?.visitorArea && <Fact label="Based in" value={view.visitorArea} />}
            {view?.visitorWebsite && <Fact label="Site" value={view.visitorWebsite} />}
            {view?.startedOn && <Fact label="Page" value={view.startedOn} />}
          </dl>

          {view && !view.visitorEmail && !view.visitorPhone && (
            <p className="mt-2 inline-flex items-center rounded-full border border-amber-200 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              No contact details yet — worth asking
            </p>
          )}
        </div>
      </header>

      {joined && visitor === 'gone' && (
        <p
          role="status"
          className="shrink-0 border-b border-amber-200/70 dark:border-amber-400/20 bg-amber-50/80 dark:bg-amber-500/10 px-4 py-2 text-center text-xs leading-relaxed text-amber-800 dark:text-amber-200"
        >
          {CHAT_AGENT_VISITOR_LEFT_BANNER}
        </p>
      )}

      {context.summary && !joined && (
        <p className="shrink-0 border-b border-navy-100 dark:border-navy-800 bg-navy-50 dark:bg-navy-900/40 px-4 py-3 text-sm leading-relaxed text-navy-900 dark:text-navy-100">
          <span className="mx-auto block max-w-3xl">
            <span className="font-semibold">Summary: </span>
            {context.summary}
          </span>
        </p>
      )}

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {messages.map((m) =>
            m.kind === 'notice' ? (
              <p key={m.id} className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 py-1">
                {m.content}
              </p>
            ) : (
              <div key={m.id} className={m.role === 'VISITOR' ? 'flex justify-start' : 'flex justify-end'}>
                <div className="max-w-[85%]">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ${
                      m.role === 'VISITOR' ? '' : 'text-right'
                    }`}
                  >
                    {m.role === 'VISITOR' ? 'Visitor' : m.role === 'AGENT' ? m.authorLabel || 'You' : 'Assistant'}
                  </p>
                  <div
                    className={[
                      'px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words rounded-2xl',
                      m.role === 'VISITOR'
                        ? 'bg-white dark:bg-ink-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-bl-md shadow-soft'
                        : m.role === 'AGENT'
                          ? 'bg-navy-800 dark:bg-navy-600 text-white rounded-br-md shadow-soft'
                          : 'bg-navy-50 dark:bg-navy-900/40 text-slate-700 dark:text-slate-200 border border-navy-100 dark:border-navy-800 rounded-br-md',
                    ].join(' ')}
                  >
                    <MessageText content={m.content} fromAgent={m.role === 'AGENT'} />
                  </div>
                </div>
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>
      </main>

      <footer className="shrink-0 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {!joined ? (
            <>
              {/*
                Joining is explicit. Mail clients prefetch links, so if opening
                the link announced the agent, a link scanner would do it seconds
                after the email was sent.
              */}
              <button
                type="button"
                onClick={() => void join()}
                disabled={busy}
                className={`w-full ${buttonClass('primary', 'lg')}`}
              >
                {busy ? 'Joining…' : 'Join the conversation'}
              </button>
              <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                The visitor is not told you are here until you join.
              </p>
            </>
          ) : (
            <>
              {/*
                One tap to drop a useful line into the draft. They write into the
                draft rather than sending, so a line can be edited first and a
                mis-tap is not a message the visitor already saw.
              */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {QUICK_REPLIES.map((quick) => (
                  <button
                    key={quick.label}
                    type="button"
                    onClick={() => setDraft((d) => (d ? `${d.trimEnd()} ${quick.text}` : quick.text))}
                    className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-navy-300 dark:hover:border-white/25 hover:text-navy-800 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>

              <form onSubmit={send} className="flex items-end gap-2">
                <label htmlFor="hs-agent-input" className="sr-only">
                  Your reply
                </label>
                <textarea
                  id="hs-agent-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void send(e as unknown as React.FormEvent);
                    }
                  }}
                  rows={2}
                  maxLength={2000}
                  placeholder="Reply…"
                  className={`${inputClass} flex-1 resize-none`}
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || busy}
                  aria-label="Send reply"
                  className="shrink-0 h-11 w-11 grid place-items-center rounded-lg bg-navy-800 dark:bg-navy-600 text-white shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 active:scale-95 transition-all cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-white/10 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs">
                <button
                  type="button"
                  onClick={() => void leave(true)}
                  className="text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white underline-offset-2 hover:underline cursor-pointer"
                >
                  Hand back to the assistant
                </button>
                <button
                  type="button"
                  onClick={() => void leave(false)}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 underline-offset-2 hover:underline cursor-pointer"
                >
                  Close conversation
                </button>
              </div>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}

/** How long ago, in the roughest terms that are still useful. */
function agoLabel(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 90) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

function PresencePill({ state, lastSeenAt }: { state: VisitorState; lastSeenAt?: string }) {
  // A clock of its own: once the visitor has gone nothing else re-renders this,
  // and "left just now" would otherwise freeze on screen.
  const [, tick] = useState(0);
  useEffect(() => {
    if (state !== 'gone') return;
    const t = window.setInterval(() => tick((n) => n + 1), 30_000);
    return () => window.clearInterval(t);
  }, [state]);

  const label =
    state === 'here'
      ? CHAT_AGENT_VISITOR_HERE
      : state === 'away'
        ? CHAT_AGENT_VISITOR_AWAY
        : CHAT_AGENT_VISITOR_GONE;

  const tone =
    state === 'here'
      ? 'border-emerald-200 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : state === 'away'
        ? 'border-amber-200 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400';

  const dot = state === 'here' ? 'bg-emerald-500' : state === 'away' ? 'bg-amber-400' : 'bg-slate-400';

  return (
    <p role="status" className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {state === 'here' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dot}`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label}
      {state === 'gone' && lastSeenAt && ` · ${agoLabel(lastSeenAt)}`}
    </p>
  );
}

function Fact({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <span>
      <dt className="inline text-slate-400 dark:text-slate-500">{label}: </dt>
      <dd className="inline text-slate-700 dark:text-slate-200">
        {href ? (
          <a href={href} className="text-navy-700 dark:text-navy-300 underline-offset-2 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </span>
  );
}
