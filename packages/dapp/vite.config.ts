import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Jumper.Exchange',
        short_name: 'Jumper.Exchange',
        description: 'Multi-Chain Bridging & Swapping (powered by LI.FI)',
        theme_color: '#653BA3',
        // icons: [
        //   {
        //     src: 'favicon.png',
        //     sizes: '192x192',
        //     type: 'image/png',
        //   },
        //   {
        //     src: 'favicon.png',
        //     sizes: '512x512',
        //     type: 'image/png',
        //   },
        // ],
        // shortcuts: [
        //   {
        //     name: 'Swap/Bridge',
        //     short_name: 'swap/bridge',
        //     description: 'Swap/bridge via Jumper',
        //     url: '/?source=pwa',
        //   },
        //   {
        //     name: 'Gas',
        //     short_name: 'Gas',
        //     description: 'Gas via Jumper',
        //     url: '/gas?source=pwa',
        //   },
        //   {
        //     name: 'Buy',
        //     short_name: 'Buy',
        //     description: 'Buy on Jumper',
        //     url: '/buy?source=pwa',
        //   },
        // ],
      },
      // registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
    }),
  ],
  esbuild: {
    target: 'esnext',
  },
  build: {
    rollupOptions: {
      plugins: [
        // throwing build errors, commenting out for now
        // nodePolyfills({
        //   include: null,
        // }),
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
