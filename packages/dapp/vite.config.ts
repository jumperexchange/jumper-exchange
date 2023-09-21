import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: './',
  // resolve: {
  //   alias: {
  //     assets: path.resolve(__dirname, './src/assets'),
  //     components: path.resolve(__dirname, './src/components'),
  //     config: path.resolve(__dirname, './src/config'),
  //     const: path.resolve(__dirname, './src/const'),
  //     stores: path.resolve(__dirname, './src/stores'),
  //     hooks: path.resolve(__dirname, './src/hooks'),
  //     providers: path.resolve(__dirname, './src/providers'),
  //     types: path.resolve(__dirname, './src/types'),
  //     i18n: path.resolve(__dirname, './src/stores'),
  //   },
  // },
  plugins: [react(), tsconfigPaths()],
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
