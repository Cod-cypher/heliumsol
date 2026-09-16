/**
 * Form mode: what the widget becomes when there is no assistant.
 *
 * Reached whenever OPENAI_API_KEY is unset, CHAT_ENABLED is false, the monthly
 * token cap is spent, or the database is unreachable. The point is that an
 * outage looks like a plainer widget rather than a broken one — a visitor who
 * came to ask a question can still leave it, and it still arrives by the same
 * route as every other lead.
 *
 * Posts through submitLead, so it inherits attribution, the visitor/session
 * linkage, the email forward and the file backup without knowing about any of
 * them.
 */

import { useState } from 'react';
import {
  CHAT_FORM_ERROR,
  CHAT_FORM_HEADING,
  CHAT_FORM_SUBMIT,
  CHAT_FORM_SUCCESS,
  CHAT_OFFLINE_NOTICE,
} from '../../content/chat';
import { submitLead } from '../../lib/leads';

interface Props {
  notice?: string;
  onDone: () => void;
}

/** Shape only. The server and a bounced mail are the real validation. */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export default function ChatForm({ notice, onDone }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex-1 grid place-items-center p-6 bg-white dark:bg-ink-900">
        <div role="status" className="text-center max-w-[26ch]">
          <p className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-2">Thanks.</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5">{CHAT_FORM_SUCCESS}</p>
          <button
            type="button"
            onClick={onDone}
            className="px-5 py-2.5 rounded-lg bg-navy-800 dark:bg-navy-600 text-white text-sm font-semibold shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all cursor-pointer disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Your name, please.');
    if (!isValidEmail(email.trim())) return setError('That email address does not look right.');
    if (!website.trim()) return setError('Your website, so we know who we are looking at.');
    if (!message.trim()) return setError('Tell us what you need.');

    setError('');
    setSubmitting(true);
    try {
      await submitLead({
        type: 'chat_widget',
        name: name.trim(),
        email: email.trim(),
        website: website.trim(),
        comments: message.trim(),
      });
      setDone(true);
    } catch {
      setError(CHAT_FORM_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex-1 overflow-y-auto p-4 bg-white dark:bg-ink-900">
      <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white mb-1">{CHAT_FORM_HEADING}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{notice || CHAT_OFFLINE_NOTICE}</p>

      <div className="space-y-3">
        <div>
          <label htmlFor="hs-chat-name" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Name
          </label>
          <input
            id="hs-chat-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            autoComplete="name"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3.5 py-2.5 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="hs-chat-email" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Email
          </label>
          <input
            id="hs-chat-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            autoComplete="email"
            inputMode="email"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3.5 py-2.5 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="hs-chat-website" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Website
          </label>
          <input
            id="hs-chat-website"
            type="text"
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
              setError('');
            }}
            autoComplete="url"
            inputMode="url"
            placeholder="yourcompany.com"
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3.5 py-2.5 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="hs-chat-message" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            What do you need?
          </label>
          <textarea
            id="hs-chat-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError('');
            }}
            rows={4}
            maxLength={2000}
            className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900 px-3.5 py-2.5 text-base sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/20 transition-colors resize-none"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400 leading-relaxed mt-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full px-5 py-3 rounded-lg bg-navy-800 dark:bg-navy-600 text-white text-sm font-semibold shadow-soft hover:bg-navy-900 dark:hover:bg-navy-500 transition-all cursor-pointer disabled:opacity-50"
      >
        {submitting ? 'Sending…' : CHAT_FORM_SUBMIT}
      </button>
    </form>
  );
}
