import { defineConfig, devices } from '@playwright/test';

const useCompose = process.env.PW_USE_COMPOSE === '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results' }],
  ],
  use: {
    baseURL: process.env.PW_BASE_URL || 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: useCompose
    ? undefined
    : {
        command: 'npm run dev -- --host 127.0.0.1 --port 5173',
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: 'pc',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'tablet',
      use: {
        ...devices['iPad (gen 7)'],
        viewport: { width: 834, height: 1112 },
      },
      testMatch: /.*happy-path\.spec\.ts/,
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
      testMatch: /.*happy-path\.spec\.ts/,
    },
  ],
});
