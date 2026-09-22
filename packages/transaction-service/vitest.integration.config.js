import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    threads: false,
    logHeapUsage: true,
    globalSetup: 'test/integration/lib/db-setup.ts',
    include: ['test/integration/**/*.test.ts'],
    exclude: ['test/unit/**/*'],
    setupFiles: ['test/integration/lib/setup.ts'],
    testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/config.*.js'],
  },
});
