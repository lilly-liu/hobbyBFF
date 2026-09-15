import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'pnpm start --port 3100', url: 'http://localhost:3100', reuseExistingServer: !process.env.CI },
})
