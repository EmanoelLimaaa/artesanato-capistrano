import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.js'],
    include: ['src/tests/unit/**/*.test.{js,jsx,ts,tsx}'],
    css: false,
    coverage: {
      // Provider nativo do Vitest, mais estável neste projeto em Windows.
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      all: true,
      reportsDirectory: './coverage',
      include: ['src/lib/**/*.js'],
      exclude: ['src/lib/**/index.js', 'src/tests/**'],
    },
  },
  build: {
    target: 'esnext',
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
})


