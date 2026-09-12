import { test } from '@playwright/test'

test('capture kanban board screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://localhost:5173/')
  await page.waitForSelector('.kanban-card')

  // Capture default board
  await page.screenshot({
    path: '/Users/vrav/.gemini/antigravity-ide/brain/730c0fbd-a861-40b2-a9f0-87f14d48729e/kanban_board_main.png',
    fullPage: false,
  })

  // Open modal and capture modal view
  await page.locator('[data-testid="btn-add-card-bottom-col-todo"]').click()
  await page.waitForSelector('[data-testid="add-card-modal"]')
  await page.locator('[data-testid="input-card-title"]').fill('Implement CI/CD pipeline')
  await page.locator('[data-testid="input-card-details"]').fill('Automate build and deployment workflows')

  await page.screenshot({
    path: '/Users/vrav/.gemini/antigravity-ide/brain/730c0fbd-a861-40b2-a9f0-87f14d48729e/kanban_board_modal.png',
    fullPage: false,
  })
})
