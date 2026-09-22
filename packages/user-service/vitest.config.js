import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
    threads: false,
    logHeapUsage: true,
    globalSetup: 'test/unit/global-setup.ts',
    setupFiles: ['test/unit/setup.ts'],
  },
});
