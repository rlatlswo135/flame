import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export const vitestReactConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
