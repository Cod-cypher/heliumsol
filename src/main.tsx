import { StrictMode, Suspense, lazy } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initTracker } from './lib/tracker';

const AdminApp = lazy(() => import('./admin/AdminApp'));
const AgentConsole = lazy(() => import('./chat/AgentConsole'));

const path = window.location.pathname;
const isAdmin = path === '/admin' || path.startsWith('/admin/');
const agentContext = window.__CHAT_AGENT__;

// First-party analytics for the marketing site only. The agent console is
// reached through a URL whose path contains a bearer token, and PageView.path
// would write that token into the database — so this check is load-bearing
// for security, not only for funnel hygiene.
if (!isAdmin && !agentContext && !path.startsWith('/chat/')) {
  initTracker();
}

function Loading() {
  return <div className="min-h-screen bg-slate-50 dark:bg-ink-950" aria-busy="true" />;
}

const tree = (
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<Loading />}>
        <AdminApp />
      </Suspense>
    ) : agentContext ? (
      <Suspense fallback={<Loading />}>
        <AgentConsole context={agentContext} />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);

const container = document.getElementById('root')!;

// Production pages are pre-rendered, so the markup is already there and is
// hydrated. The dev server and the app shell have none, so they mount.
if (container.dataset.prerendered === 'true') {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
