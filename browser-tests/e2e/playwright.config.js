// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * Playwright config for the Gongfarmer's Almanac Classes module e2e suite.
 *
 * These specs drive a live Foundry V14 instance running the `v14` world with
 * this module enabled. Start Foundry first (Foundry must already be running —
 * there is no webServer):
 *
 *   npx @foundryvtt/foundryvtt-cli configure set installPath ~/Applications/foundry-14
 *   npx @foundryvtt/foundryvtt-cli configure set dataPath /Users/timlwhite/FoundryVTT-Next
 *   npx @foundryvtt/foundryvtt-cli launch --world=v14
 *
 * Then, from this directory: `npm test`.
 */
module.exports = defineConfig({
  testDir: './',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'html' : [['list', { printSteps: true }]],
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:30000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
