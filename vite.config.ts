import { fileURLToPath, URL } from 'node:url';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode === 'production' ? false : 'inline',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
}));
