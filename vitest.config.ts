import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['evals/agent/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
});
