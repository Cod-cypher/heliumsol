// Production entry point for heliumsol.com, run under PM2 as "heliumsol"
// (see ecosystem.config.cjs). nginx proxies heliumsol.com to 127.0.0.1:3003.
//
// The real server is server.ts, bundled by `npm run build` into
// dist/server.cjs next to the pre-rendered site in dist/client. This file only
// exists so the PM2 process keeps a stable script path across deploys, and so
// `node server.cjs` always runs in production mode.
//
// Deployed from the repo by deploy.sh — edit here and push, not on the server.

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('./dist/server.cjs');
