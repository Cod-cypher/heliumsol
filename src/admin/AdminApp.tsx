/**
 * Admin app root — authentication gate and shell.
 *
 * Lazy-loaded from src/main.tsx, so none of this reaches the marketing
 * bundle. The only screen behind the login is the chat inbox. Styled with the
 * site's own navy system (src/portal/ui.tsx), including dark mode.
 */

import { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { Banner, Button, Card, Eyebrow, Heading, PortalLoader, inputClass, labelClass } from '../portal/ui';
import { setUnauthorizedHandler } from './api';
import ChatInbox from './ChatInbox';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

type AuthState =
  | { status: 'checking' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: AdminUser };

export default function AdminApp() {
  const [auth, setAuth] = useState<AuthState>({ status: 'checking' });

  // The session cookie is httpOnly, so the client cannot read it — asking the
  // server who we are is the only way to know whether we are signed in.
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me', { credentials: 'same-origin' });
      if (!res.ok) {
        setAuth({ status: 'signed-out' });
        return;
      }
      const data = await res.json();
      setAuth({ status: 'signed-in', user: data.user });
    } catch {
      setAuth({ status: 'signed-out' });
    }
  }, []);

  useEffect(() => {
    document.title = 'Admin | HeliumSol';
    void refresh();
  }, [refresh]);

  // A session that expires while a tab sits open returns to the login screen.
  useEffect(() => {
    setUnauthorizedHandler(() => setAuth({ status: 'signed-out' }));
  }, []);

  if (auth.status === 'checking') {
    return <PortalLoader label="Checking your session" />;
  }

  if (auth.status === 'signed-out') {
    return <LoginPage onSignedIn={(user) => setAuth({ status: 'signed-in', user })} />;
  }

  return <AdminShell user={auth.user} onSignedOut={() => setAuth({ status: 'signed-out' })} />;
}

/* -------------------------------------------------------------------------
   Login
------------------------------------------------------------------------- */

function LoginPage({ onSignedIn }: { onSignedIn: (user: AdminUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Over plain HTTP the browser discards the Secure session cookie, so login
  // "succeeds" and then nothing happens. Say so up front.
  const insecure =
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    !['localhost', '127.0.0.1'].includes(window.location.hostname);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        onSignedIn(data.user);
        return;
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const mins = Math.ceil((data.retryAfterSec ?? 900) / 60);
        setError(`Too many attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`);
      } else if (res.status === 503) {
        setError('Cannot reach the database right now. Try again in a moment.');
      } else {
        // Matches the server, which does not distinguish an unknown account
        // from a wrong password.
        setError('That email and password do not match an account.');
      }
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-white dark:bg-ink-950 flex items-center justify-center px-5 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-lines bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_40%,transparent_100%)]"
      />
      <div className="relative w-full max-w-[400px]">
        <Card className="p-7 sm:p-8 shadow-card">
          <div className="mb-7">
            <Logo size={28} />
          </div>
          <Eyebrow pulse>Admin</Eyebrow>
          <Heading level={2} className="mt-2 mb-6">
            Sign in
          </Heading>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className={labelClass}>
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className={labelClass}>
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {insecure && (
              <Banner tone="warn">
                This page is being served over HTTP. The session cookie is marked Secure, so login
                will not stick until HTTPS is enabled.
              </Banner>
            )}

            {error && <Banner tone="error">{error}</Banner>}

            <Button type="submit" size="lg" disabled={busy} className="w-full">
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
          Accounts are created on the server with{' '}
          <code className="font-mono text-slate-700 dark:text-slate-200">npm run admin</code>. There
          is no sign-up and no password reset by email.
        </p>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------
   Shell
------------------------------------------------------------------------- */

function AdminShell({ user, onSignedOut }: { user: AdminUser; onSignedOut: () => void }) {
  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
    onSignedOut();
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-ink-950 text-slate-800 dark:text-slate-200 font-sans">
      <header className="sticky top-0 z-30 px-4 py-3 md:px-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-ink-900/80 px-5 py-3 shadow-soft backdrop-blur-xl">
          <a href="/admin" className="flex items-center gap-3">
            <Logo size={26} />
            <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-white/10 pl-3">
              Chats
            </span>
          </a>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 mr-1">
              {user.name || user.email}
            </span>
            <ThemeToggle />
            <Button tone="outline" size="sm" onClick={() => void signOut()}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 md:px-8 py-8 md:py-10">
        <ChatInbox />
      </main>
    </div>
  );
}
