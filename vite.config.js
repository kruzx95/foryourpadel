import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        tournament: resolve(import.meta.dirname, 'tournament.html'),
      },
    },
  },
});
