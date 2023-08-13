/// <reference types="vitest" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: false,
    coverage: {
      all: true,
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/stories/**'],
      provider: 'v8',
    },
  },
});
