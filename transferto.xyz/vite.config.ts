import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: { port: 3000 },
  build: {
    rollupOptions: {
      external: ['@web3-react/walletconnect'],
    },
    outDir: './build',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  resolve: {
    alias: [{ find: /^~/, replacement: '' }],
  },
})
