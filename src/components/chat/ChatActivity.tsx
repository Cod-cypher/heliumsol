/**
 * Visible progress for what the chat is doing.
 *
 * ChatActivitySteps sits in the transcript while a message is in flight and
 * walks through the steps ("Finding an available team member", "Notifying the
 * team", …). The reply arrives in one response, so the steps advance on a timer
 * and the last one keeps spinning until it lands — they describe the work that
 * is really happening, in the order it happens, without claiming to know
 * exactly when each part finishes.
 *
 * ChatStatusBar sits above the composer and reports two states only: a team
 * member has joined, or the team could not be reached.
 */

import { useEffect, useState } from 'react';
import { Check, Loader2, Mail, Phone } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from '../../routes';
import type { ChatActivity } from './ChatProvider';

const STEPS: Record<ChatActivity, { label: string; at: number }[]> = {
  reply: [
    { label: 'Reading your message', at: 0 },
    { label: 'Checking what HeliumSol can do', at: 1200 },
    { label: 'Writing a reply', at: 3200 },
  ],
  handoff: [
    { label: 'Finding an available team member', at: 0 },
    { label: 'Notifying the team', at: 1400 },
    { label: 'Sharing this conversation with them', at: 3000 },
  ],
  live: [{ label: 'Sending to the team', at: 0 }],
};

export function ChatActivitySteps({ activity, agentLabel }: { activity: ChatActivity; agentLabel?: string }) {
  const steps = STEPS[activity];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setCurrent(0);
    const timers = steps.slice(1).map((step, i) => window.setTimeout(() => setCurrent(i + 1), step.at));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [activity, steps]);

  const label = (text: string) =>
    activity === 'live' && agentLabel ? text.replace('the team', agentLabel) : text;

  return (
    <div className="flex justify-start">
      <div
        className="rounded-2xl rounded-bl-md border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-ink-800 px-3.5 py-3 min-w-[230px] max-w-[85%]"
        role="status"
        aria-live="polite"
      >
        <ol className="space-y-2">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li
                key={step.label}
                className={[
                  'flex items-center gap-2.5 text-[13px] leading-tight transition-opacity duration-300',
                  i > current ? 'opacity-40' : 'opacity-100',
                ].join(' ')}
                aria-hidden={i > current}
              >
                <span
                  className={[
                    'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full',
                    done
                      ? 'bg-navy-800 dark:bg-navy-500 text-white'
                      : active
                        ? 'text-navy-700 dark:text-navy-300'
                        : 'border border-slate-300 dark:border-white/20',
                  ].join(' ')}
                >
                  {done ? (
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                </span>
                <span
                  className={
                    active
                      ? 'font-medium text-slate-800 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {label(step.label)}
                  {active && <span className="sr-only">, in progress</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function ChatStatusBar({
  status,
  agentLabel,
  handoffOutcome,
}: {
  status?: string;
  agentLabel?: string;
  handoffOutcome: 'notified' | 'unavailable' | 'cooldown' | null;
}) {
  if (status === 'LIVE') {
    return (
      <Bar tone="live">
        <Dot className="bg-emerald-500" ping />
        <span>
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {agentLabel || 'A team member'}
          </span>{' '}
          has joined the chat
        </span>
      </Bar>
    );
  }

  if (handoffOutcome === 'unavailable') {
    return (
      <Bar tone="warn">
        <span className="flex-1">
          <span className="block font-semibold text-slate-800 dark:text-slate-100">
            We couldn't reach the team just now
          </span>
          <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-1.5 text-navy-700 dark:text-navy-300 hover:underline">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="inline-flex items-center gap-1.5 text-navy-700 dark:text-navy-300 hover:underline">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </span>
        </span>
      </Bar>
    );
  }

  return null;
}

function Bar({ tone, children }: { tone: 'live' | 'warn'; children: React.ReactNode }) {
  const tones = {
    live: 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-200/70 dark:border-emerald-400/20',
    warn: 'bg-amber-50/80 dark:bg-amber-500/10 border-amber-200/70 dark:border-amber-400/20',
  };
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-2.5 border-t px-4 py-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 ${tones[tone]}`}
    >
      {children}
    </div>
  );
}

function Dot({ className, ping = false }: { className: string; ping?: boolean }) {
  return (
    <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
      {ping && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${className}`} />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${className}`} />
    </span>
  );
}
