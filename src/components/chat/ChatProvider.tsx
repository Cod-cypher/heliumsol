/**
 * The chat conversation, shared by every chat surface on the page.
 *
 * Two surfaces show it: the floating widget (ChatWidget) and the inline chat in
 * the homepage's AI assistant section (StageAIChatbot). They must be one
 * conversation, not two — a visitor who types into the homepage section and
 * then opens the corner widget expects to see the same thread — so the session,
 * the transcript, polling, resume and sending all live here, once.
 *
 * Adapted from the optimizeindex widget. Two things about it are load-bearing:
 *
 * 1. Nothing renders until after mount (`ready`). The site is pre-rendered, so
 *    first-pass output must be identical on the server and the client.
 *
 * 2. The resume is kicked off in the same effect that sets `ready`, and
 *    ensureStarted() waits on it. Otherwise a returning visitor who clicks
 *    immediately gets a brand-new conversation on top of the one being restored.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ChatMessageDTO, ChatMode } from '../../../shared/chatTypes';
import { asksForHuman } from '../../../shared/chatIntent';
import { CHAT_SEND_FAILED } from '../../content/chat';
import { trackEvent } from '../../lib/tracker';
import { playIncoming, setTabBadge, unlockAudio } from '../../lib/chatNotify';
import {
  beaconAway,
  clearPersisted,
  closeChat,
  mergeMessages,
  optimisticId,
  pollChat,
  pollInterval,
  readPersisted,
  resumeChat,
  sendChatMessage,
  startChat,
  writePersisted,
} from '../../lib/chat';

export interface ChatSession {
  id: string;
  token: string;
  mode: ChatMode;
  status: string;
  notice?: string;
  agentLabel?: string;
}

/**
 * What the widget shows while a send is in flight.
 *
 * "reply"   the assistant is answering
 * "handoff" the message asked for a person: finding and notifying the team
 * "live"    a team member is in the chat; the message is just being delivered
 */
export type ChatActivity = 'reply' | 'handoff' | 'live';

/** Dispatch on window to open the floating chat widget from anywhere. */
export const OPEN_CHAT_EVENT = 'hs:open-chat';

/** Optional text is placed in the composer, ready for the visitor to send. */
export function openChatWidget(prefill?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { prefill } }));
}

interface ChatContextValue {
  /** False on the server and the first client render. */
  ready: boolean;
  session: ChatSession | null;
  messages: ChatMessageDTO[];
  starting: boolean;
  awaitingReply: boolean;
  sending: boolean;
  sendError: string;
  /** Set while a message is in flight, so the UI can show the steps. */
  activity: ChatActivity | null;
  /** The outcome of the latest request for a person, if there was one. */
  handoffOutcome: 'notified' | 'unavailable' | 'cooldown' | null;
  /** Floating panel state. */
  open: boolean;
  unread: number;
  prefill: string;
  openPanel: (prefill?: string) => void;
  closePanel: () => void;
  /** Starts (or resumes) the conversation if there is none yet. */
  ensureStarted: () => Promise<ChatSession | null>;
  /** Sends a visitor message, starting the conversation first if needed. */
  sendText: (text: string) => Promise<boolean>;
  clearSendError: () => void;
  reset: () => void;
  /** An inline chat is on screen, so replies there are not "unread". */
  setInlineVisible: (visible: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}

export default function ChatProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [unread, setUnread] = useState(0);
  const [starting, setStarting] = useState(false);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [activity, setActivity] = useState<ChatActivity | null>(null);
  const [handoffOutcome, setHandoffOutcome] = useState<'notified' | 'unavailable' | 'cooldown' | null>(null);
  const [inlineVisible, setInlineVisible] = useState(false);

  /** Poll cursor. A ref, so a new message does not restart the poll timer. */
  const cursorRef = useRef(0);
  const errorStreak = useRef(0);
  /** Synchronous mirrors, for code that reads them after an await. */
  const sessionRef = useRef<ChatSession | null>(null);
  const openRef = useRef(false);
  const startingRef = useRef<Promise<ChatSession | null> | null>(null);
  /** The in-flight resume, so starting a chat can wait for it. */
  const resumeRef = useRef<Promise<void> | null>(null);

  const applySession = useCallback((next: ChatSession | null) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const watching = open || inlineVisible;

  /** The single way a message enters the conversation. */
  const ingest = useCallback(
    (incoming: ChatMessageDTO[], nextCursor: number) => {
      if (incoming.length === 0) return;

      setMessages((prev) => mergeMessages(prev, incoming));
      if (nextCursor > cursorRef.current) cursorRef.current = nextCursor;

      const inbound = incoming.filter((m) => m.role !== 'VISITOR');
      if (inbound.length === 0) return;

      setAwaitingReply(false);
      playIncoming();

      const unseen = !watching || document.visibilityState === 'hidden';
      if (unseen) setUnread((n) => n + inbound.length);
    },
    [watching],
  );

  /* --- mount and resume ------------------------------------------------ */

  useEffect(() => {
    setReady(true);

    const stored = readPersisted();
    if (!stored) return;

    let cancelled = false;
    resumeRef.current = (async () => {
      try {
        const data = await resumeChat(stored.id, stored.token, stored.wasOpen);
        if (cancelled) return;

        if (data.resumed !== 'ok') {
          // Only "expired" means the conversation is really gone. Anything else
          // is transient; the next page load retries.
          if (data.resumed === 'expired') clearPersisted();
          return;
        }

        applySession({
          id: stored.id,
          token: data.visitorToken || stored.token,
          mode: data.mode,
          status: data.status,
          ...(data.notice ? { notice: data.notice } : {}),
        });
        setMessages(data.messages);
        cursorRef.current = data.cursor;

        // Only ever opens, never closes: the visitor may have opened it meanwhile.
        if (stored.wasOpen) setOpen(true);

        if (data.welcomedBack && !stored.wasOpen && !openRef.current) {
          setUnread(1);
          playIncoming();
        }
      } catch {
        // Network or 5xx. Not a verdict on the conversation, so keep it stored.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applySession]);

  /* --- polling --------------------------------------------------------- */

  useEffect(() => {
    if (!session || session.mode === 'form' || session.status === 'CLOSED') return;

    let timer: number | undefined;
    let cancelled = false;

    const tick = async () => {
      try {
        const active = watching && document.visibilityState === 'visible';
        const data = await pollChat(session.id, session.token, cursorRef.current, active);
        if (cancelled) return;
        errorStreak.current = 0;

        ingest(data.messages, data.cursor);

        if (data.status !== session.status || data.agentLabel !== session.agentLabel) {
          setSession((s) => (s ? { ...s, status: data.status, agentLabel: data.agentLabel } : s));
        }
      } catch {
        if (!cancelled) errorStreak.current += 1;
      } finally {
        if (!cancelled) {
          const next = pollInterval({
            status: session.status,
            panelOpen: watching,
            awaitingReply,
            errorStreak: errorStreak.current,
          });
          if (next !== null) timer = window.setTimeout(tick, next);
        }
      }
    };

    const delay = pollInterval({
      status: session.status,
      panelOpen: watching,
      awaitingReply,
      errorStreak: errorStreak.current,
    });
    if (delay !== null) timer = window.setTimeout(tick, delay);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer);
        void tick();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Back from the bfcache: pagehide told the server they left, so re-mark them.
    const onPageShow = () => {
      window.clearTimeout(timer);
      void tick();
    };
    window.addEventListener('pageshow', onPageShow);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, [session, watching, awaitingReply, ingest]);

  // Tell the server on the way out, so the agent console stops showing a reader.
  useEffect(() => {
    if (!session?.id || !session.token) return;
    const onLeave = () => beaconAway(session.id, session.token);
    window.addEventListener('pagehide', onLeave);
    return () => window.removeEventListener('pagehide', onLeave);
  }, [session]);

  useEffect(() => {
    setTabBadge(unread);
    return () => setTabBadge(0);
  }, [unread]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && watching) setUnread(0);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [watching]);

  useEffect(() => {
    if (inlineVisible) setUnread(0);
  }, [inlineVisible]);

  /* --- persistence ----------------------------------------------------- */

  useEffect(() => {
    if (!session || !session.id) return;
    writePersisted({
      id: session.id,
      token: session.token,
      cursor: cursorRef.current,
      lastSeenAt: Date.now(),
      wasOpen: open,
    });
  }, [session, open]);

  /* --- actions --------------------------------------------------------- */

  const ensureStarted = useCallback(async (): Promise<ChatSession | null> => {
    // Must run inside the click: browsers only start audio from a user gesture.
    unlockAudio();

    if (sessionRef.current) return sessionRef.current;
    if (startingRef.current) return startingRef.current;

    startingRef.current = (async () => {
      setStarting(true);
      try {
        if (resumeRef.current) {
          await resumeRef.current;
          if (sessionRef.current) return sessionRef.current;
        }

        const data = await startChat();
        const next: ChatSession = {
          id: data.conversationId,
          token: data.visitorToken,
          mode: data.mode,
          status: data.status,
          notice: data.notice,
        };
        applySession(next);
        setMessages(data.messages);
        cursorRef.current = data.cursor;
        trackEvent('chat_open', data.mode);
        return next;
      } catch {
        // Falls back to the contact form, which posts to /api/leads.
        const fallback: ChatSession = { id: '', token: '', mode: 'form', status: 'ACTIVE' };
        applySession(fallback);
        return fallback;
      } finally {
        setStarting(false);
        startingRef.current = null;
      }
    })();

    return startingRef.current;
  }, [applySession]);

  const openPanel = useCallback(
    (text?: string) => {
      setPrefill(text ?? '');
      openRef.current = true;
      setOpen(true);
      setUnread(0);
      void ensureStarted();
    },
    [ensureStarted],
  );

  const closePanel = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      openPanel((e as CustomEvent<{ prefill?: string }>).detail?.prefill);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpenRequest);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpenRequest);
  }, [openPanel]);

  const sendText = useCallback(
    async (raw: string): Promise<boolean> => {
      const text = raw.trim();
      if (!text || sending) return false;

      setSendError('');
      const current = await ensureStarted();
      if (!current?.id || current.mode === 'form') return false;

      setSending(true);
      setAwaitingReply(true);
      // A repeat request while the team is already notified is refused by the
      // cooldown, so it shows the ordinary reply steps rather than claiming to
      // notify anyone again.
      setActivity(
        current.status === 'LIVE'
          ? 'live'
          : asksForHuman(text) && sessionRef.current?.status !== 'HANDOFF_PENDING'
            ? 'handoff'
            : 'reply',
      );

      // Show it immediately; the server's echo replaces this optimistic copy.
      ingest(
        [
          {
            id: optimisticId(),
            seq: Number.MAX_SAFE_INTEGER,
            role: 'VISITOR',
            content: text,
            kind: 'message',
            createdAt: new Date().toISOString(),
          },
        ],
        0,
      );

      try {
        const data = await sendChatMessage(current.id, current.token, text, cursorRef.current);
        if (data.refused) {
          setSendError(data.refused);
        } else {
          ingest(data.messages, data.cursor);
          setSession((s) => (s ? { ...s, status: data.status, agentLabel: data.agentLabel } : s));
          if (data.handoff) setHandoffOutcome(data.handoff);
        }
        trackEvent('chat_message', current.status);
        return true;
      } catch {
        setSendError(CHAT_SEND_FAILED);
        return false;
      } finally {
        setSending(false);
        setAwaitingReply(false);
        setActivity(null);
      }
    },
    [sending, ensureStarted, ingest],
  );

  /** Abandons the conversation (closing it server-side) and starts a clean one. */
  const reset = useCallback(() => {
    const current = sessionRef.current;
    if (current?.id && current.token) void closeChat(current.id, current.token);
    clearPersisted();
    resumeRef.current = null;

    setMessages([]);
    setUnread(0);
    setAwaitingReply(false);
    setSendError('');
    setHandoffOutcome(null);
    cursorRef.current = 0;
    errorStreak.current = 0;
    applySession(null);
    void ensureStarted();
  }, [applySession, ensureStarted]);

  const value = useMemo<ChatContextValue>(
    () => ({
      ready,
      session,
      messages,
      starting,
      awaitingReply,
      sending,
      sendError,
      activity,
      handoffOutcome,
      open,
      unread,
      prefill,
      openPanel,
      closePanel,
      ensureStarted,
      sendText,
      clearSendError: () => setSendError(''),
      reset,
      setInlineVisible,
    }),
    [
      ready,
      session,
      messages,
      starting,
      awaitingReply,
      sending,
      sendError,
      activity,
      handoffOutcome,
      open,
      unread,
      prefill,
      openPanel,
      closePanel,
      ensureStarted,
      sendText,
      reset,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
