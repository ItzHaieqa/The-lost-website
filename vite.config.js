import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        archive: resolve(__dirname, 'archive.html'),
        logs: resolve(__dirname, 'logs.html'),
        cameraFeed: resolve(__dirname, 'camera-feed.html'),
        doNotOpen: resolve(__dirname, 'do-not-open.html'),
      },
    },
  },
});
