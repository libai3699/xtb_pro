import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'node:path';

const uniPlugin = typeof uni === 'function' ? uni : (uni as unknown as { default: () => unknown }).default;

export default defineConfig({
  plugins: [uniPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
