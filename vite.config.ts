import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import { FontaineTransform } from 'fontaine';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    FontaineTransform.vite({
      fallbacks: [
        'Arial',
        'Noto Sans',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica Neue',
        'sans-serif',
      ],
      resolvePath: (id) => new URL('.' + id, import.meta.url),
    }),
    react(),
    tsconfigPaths(),
  ],
  esbuild: {
    target: 'esnext',
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills({
          include: null,
        }),
      ],
    },
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
