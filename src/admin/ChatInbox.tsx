/**
 * Every conversation the chat widget has had.
 *
 * Two jobs. The urgent one is joining a live conversation without waiting for
 * an email — sign in, filter to "Wants a person", open the live console. The
 * slower one is reading transcripts, which is the only way to know whether the
 * assistant is staying within its rules.
 */

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, ExternalLink, Link2Off, MessageSquare, RefreshCw } from 'lucide-react';
import type { ChatMessageDTO } from '../../shared/chatTypes';
import MessageText from '../components/chat/MessageText';
import { Banner, Button, Card, Eyebrow, Heading, buttonClass } from '../portal/ui';

interface ChatRow {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  status: string;
  startedOn: string | null;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorCompany: string | null;
  handoffReason: string | null;
  qualified: boolean;
  leadId: string | null;
  turnCount: number;
}

const FILTERS = [
  { id: 'HANDOFF_PENDING', label: 'Wants a person' },
  { id: 'LIVE', label: 'Live' },
  { id: 'ACTIVE', label: 'Open' },
  { id: 'ALL', label: 'All' },
] as const;

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  HANDOFF_PENDING: {
    label: 'Wants a person',
    className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-400/30',
  },
  LIVE: {
    label: 'Live',
    className: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/30',
  },
  ACTIVE: {
    label: 'Open',
    className: 'bg-navy-50 dark:bg-navy-900/50 text-navy-700 dark:text-navy-200 border-navy-100 dark:border-navy-800',
  },
  CLOSED: {
    label: 'Closed',
    className: 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10',
  },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.CLOSED;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${style.className}`}>
      {style.label}
    </span>
  );
}

const humanize = (value: string) => value.toLowerCase().replace(/_/g, ' ');

export default function ChatInbox() {
  const [filter, setFilter] = useState<string>('HANDOFF_PENDING');
  const [rows, setRows] = useState<ChatRow[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setRows(null);
    try {
      const res = await fetch(`/api/admin/chats?status=${encodeURIComponent(filter)}`, {
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { conversations: ChatRow[] };
      setRows(data.conversations);
      setError('');
    } catch {
      setError('Could not load conversations.');
      setRows([]);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  if (openId) {
    return <Transcript id={openId} onBack={() => setOpenId(null)} />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Chat</Eyebrow>
          <Heading level={2} className="mt-2">
            Conversations
          </Heading>
        </div>
        <Button tone="outline" size="sm" onClick={() => void load()}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      <div
        className="mt-6 mb-5 inline-flex flex-wrap gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 p-1 shadow-soft"
        role="tablist"
        aria-label="Filter conversations"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={[
              'rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              filter === f.id
                ? 'bg-navy-800 dark:bg-navy-600 text-white shadow-soft'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4">
          <Banner tone="error">{error}</Banner>
        </div>
      )}

      {rows === null ? (
        <div className="space-y-2" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[74px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <Card className="py-12 text-center">
          <MessageSquare className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-600" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No conversations here.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => setOpenId(row.id)}
                className="group w-full text-left rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-5 py-4 shadow-soft transition-all hover:border-navy-200 dark:hover:border-white/20 hover:shadow-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500"
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {row.visitorCompany || row.visitorName || row.visitorEmail || 'A visitor'}
                      </span>
                      <StatusBadge status={row.status} />
                      {row.leadId && (
                        <span className="inline-flex items-center rounded-full border border-navy-100 dark:border-navy-800 bg-navy-50 dark:bg-navy-900/50 px-2 py-0.5 text-[11px] font-semibold text-navy-700 dark:text-navy-200">
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>{new Date(row.lastMessageAt).toLocaleString()}</span>
                      {row.startedOn && <span>{row.startedOn}</span>}
                      <span>{row.turnCount} replies</span>
                      {row.handoffReason && <span>{humanize(row.handoffReason)}</span>}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-navy-600 dark:group-hover:text-navy-300 transition-colors" aria-hidden="true" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   One conversation
------------------------------------------------------------------------- */

function Transcript({ id, onBack }: { id: string; onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessageDTO[] | null>(null);
  const [status, setStatus] = useState('');
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/admin/chats/${encodeURIComponent(id)}`, {
          credentials: 'same-origin',
        });
        const data = (await res.json()) as {
          conversation: { status: string };
          messages: ChatMessageDTO[];
        };
        setMessages(data.messages);
        setStatus(data.conversation.status);
      } catch {
        setMessages([]);
      }
    })();
  }, [id]);

  const revoke = async () => {
    await fetch(`/api/admin/chats/${encodeURIComponent(id)}/revoke`, {
      method: 'POST',
      credentials: 'same-origin',
    });
    setRevoked(true);
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-white transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        All conversations
      </button>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/*
          An admin session authorises agent replies on its own, so this is the
          no-email path into a live conversation.
        */}
        <a href={`/chat/agent/${encodeURIComponent(id)}`} className={buttonClass('primary', 'md')}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Open live console
        </a>
        <Button tone="outline" onClick={() => void revoke()} disabled={revoked}>
          <Link2Off className="h-4 w-4" aria-hidden="true" />
          {revoked ? 'Links revoked' : 'Revoke join links'}
        </Button>
        {status && <StatusBadge status={status} />}
      </div>

      {messages === null ? (
        <div className="h-40 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 animate-pulse" />
      ) : (
        <Card className="p-5 sm:p-6">
          <div className="space-y-3">
            {messages.map((m) =>
              m.kind === 'notice' ? (
                <p key={m.id} className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500 py-1">
                  {m.content}
                </p>
              ) : (
                <div key={m.id} className={m.role === 'VISITOR' ? 'flex justify-start' : 'flex justify-end'}>
                  <div className="max-w-[80%]">
                    <p className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 ${m.role === 'VISITOR' ? '' : 'text-right'}`}>
                      {m.role === 'VISITOR' ? 'Visitor' : m.role === 'AGENT' ? m.authorLabel || 'Team' : 'Assistant'}
                    </p>
                    <div
                      className={[
                        'px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words rounded-2xl',
                        m.role === 'VISITOR'
                          ? 'bg-slate-100 dark:bg-ink-800 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-white/10 rounded-bl-md'
                          : m.role === 'AGENT'
                            ? 'bg-navy-800 dark:bg-navy-600 text-white rounded-br-md'
                            : 'bg-navy-50 dark:bg-navy-900/40 text-slate-700 dark:text-slate-200 border border-navy-100 dark:border-navy-800 rounded-br-md',
                      ].join(' ')}
                    >
                      <MessageText content={m.content} fromAgent={m.role === 'AGENT'} />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
