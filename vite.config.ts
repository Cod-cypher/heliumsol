import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({isSsrBuild}) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Client output goes in dist/client, the ONLY directory the server
      // exposes. dist/server.cjs (the backend bundle) and dist/ssr sit beside
      // it so they can never be downloaded. The --ssr build passes its own
      // --outDir and ignores this.
      outDir: 'dist/client',
      emptyOutDir: true,
      rollupOptions: isSsrBuild
        ? {}
        : {
            output: {
              // Stable third-party code in its own chunks, so it stays cached
              // across deploys.
              manualChunks: {
                react: ['react', 'react-dom'],
                motion: ['motion'],
                icons: ['lucide-react'],
              },
            },
          },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
