/* eslint-disable no-undef -- browser globals (game) used inside page.evaluate / waitForFunction */
/**
 * Shared Playwright fixtures for the Gongfarmer's Almanac Classes e2e suite.
 *
 * Mirrors the DCC system suite's worker-scoped session-reuse pattern: each
 * worker logs into the live `v14` world ONCE as Gamemaster and reuses the page
 * across every test. See the system repo's docs/dev/TESTING.md.
 */
const { test: base, expect } = require('@playwright/test')

const FOUNDRY_URL = 'http://localhost:30000'
const MODULE_ID = 'dcc-gongfarmers-classes'

/** Log into the running world as Gamemaster and wait for the DCC system + this module to be ready. */
async function login (page) {
  await page.goto(`${FOUNDRY_URL}/join`)
  await page.waitForTimeout(1000)

  const isInGame = await page.locator('.game.system-dcc').isVisible({ timeout: 1000 }).catch(() => false)
  if (!isInGame) {
    const userSelect = page.locator('select[name="userid"]')
    await userSelect.waitFor({ state: 'visible', timeout: 10000 })
    const gmDisabled = await userSelect
      .locator('option', { hasText: 'Gamemaster' })
      .first()
      .evaluate(o => o.disabled)
      .catch(() => false)
    if (gmDisabled) {
      throw new Error(
        'A Gamemaster is already logged into Foundry (the "Gamemaster" join option ' +
        'is disabled). Close the Foundry browser tab logged in as GM and re-run.'
      )
    }
    await page.selectOption('select[name="userid"]', { label: 'Gamemaster' })
    await page.click('button[name="join"]')
    await page.waitForSelector('.game.system-dcc', { timeout: 30000 })
  }

  await page.waitForFunction(() => game?.ready === true && !!game?.user, { timeout: 30000 })

  // This module must be enabled in the world for the suite to mean anything.
  const active = await page.evaluate((id) => game.modules.get(id)?.active === true, MODULE_ID)
  if (!active) {
    throw new Error(
      `Module "${MODULE_ID}" is not enabled in the v14 world. Enable it in ` +
      'Manage Modules (or set core.moduleConfiguration) and relaunch the world, then re-run.'
    )
  }
}

/** Build a worker-scoped session-reuse `test`. */
function createSessionTest () {
  return base.extend({
    sessionPage: [async ({ browser }, use) => {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
      const page = await context.newPage()
      await login(page)
      await use(page)
      await context.close()
    }, { scope: 'worker' }],

    page: async ({ sessionPage }, use) => {
      await use(sessionPage)
    }
  })
}

module.exports = { base, expect, createSessionTest, login, FOUNDRY_URL, MODULE_ID }
