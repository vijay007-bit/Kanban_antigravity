import { test, expect } from '@playwright/test'

test.describe('Kanban Board MVP', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads single board with 5 fixed columns and initial dummy tasks', async ({ page }) => {
    await expect(page.locator('h1.brand-title')).toHaveText('Kanban Flow')

    const columns = page.locator('.column-card')
    await expect(columns).toHaveCount(5)

    const expectedTitles = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done']
    for (let i = 0; i < expectedTitles.length; i++) {
      await expect(columns.nth(i).locator('.column-title-text')).toHaveText(expectedTitles[i])
    }

    const cards = page.locator('.kanban-card')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('allows renaming a column', async ({ page }) => {
    const firstColumnTitle = page.locator('[data-testid="column-title-col-backlog"]')
    await expect(firstColumnTitle).toHaveText('Backlog')

    // Click to start editing
    await firstColumnTitle.click()

    const titleInput = page.locator('[data-testid="column-title-input-col-backlog"]')
    await expect(titleInput).toBeVisible()
    await titleInput.fill('Sprint Intake')
    await titleInput.press('Enter')

    await expect(page.locator('[data-testid="column-title-col-backlog"]')).toHaveText('Sprint Intake')
  })

  test('adds a new card to a column via the modal', async ({ page }) => {
    const todoColumn = page.locator('[data-testid="column-col-todo"]')
    const countBadge = todoColumn.locator('[data-testid="column-count-col-todo"]')
    const initialCount = parseInt((await countBadge.textContent()) || '0', 10)

    // Open add card modal
    await page.locator('[data-testid="btn-add-card-bottom-col-todo"]').click()
    const modal = page.locator('[data-testid="add-card-modal"]')
    await expect(modal).toBeVisible()

    // Fill form
    await page.locator('[data-testid="input-card-title"]').fill('Integration Test Card')
    await page.locator('[data-testid="input-card-details"]').fill('Testing end-to-end card creation flow')
    await page.locator('[data-testid="btn-submit-card"]').click()

    // Modal closes and card is added
    await expect(modal).not.toBeVisible()
    await expect(todoColumn.locator('text=Integration Test Card')).toBeVisible()
    await expect(todoColumn.locator('text=Testing end-to-end card creation flow')).toBeVisible()
    await expect(countBadge).toHaveText(String(initialCount + 1))
  })

  test('deletes an existing card', async ({ page }) => {
    const firstCard = page.locator('.kanban-card').first()
    const cardTitle = await firstCard.locator('.card-title').textContent()

    const deleteBtn = firstCard.locator('.btn-delete-card')
    await deleteBtn.click()

    if (cardTitle) {
      await expect(page.locator(`.kanban-card:has-text("${cardTitle}")`)).not.toBeVisible()
    }
  })

  test('supports moving cards across columns without layout overflow', async ({ page }) => {
    const sourceCard = page.locator('[data-testid="column-col-backlog"] .kanban-card').first()
    await expect(sourceCard).toBeVisible()
    const cardTitle = await sourceCard.locator('.card-title').textContent()

    // Focus card and move from Backlog to To Do
    await sourceCard.focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Space')

    // Verify card is now in To Do column
    const todoColumn = page.locator('[data-testid="column-col-todo"]')
    if (cardTitle) {
      const movedCard = todoColumn.locator(`.kanban-card:has-text("${cardTitle}")`)
      await expect(movedCard).toBeVisible()

      // Verify bounds fit within container without horizontal viewport overflow
      const cardBox = await movedCard.boundingBox()
      const columnBox = await todoColumn.boundingBox()
      expect(cardBox).not.toBeNull()
      expect(columnBox).not.toBeNull()
      if (cardBox && columnBox) {
        expect(cardBox.x).toBeGreaterThanOrEqual(columnBox.x - 2)
        expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(columnBox.x + columnBox.width + 4)
      }
    }
  })

  test('supports reordering cards within a column via keyboard sensor', async ({ page }) => {
    const doneColumn = page.locator('[data-testid="column-col-done"]')
    const doneCards = doneColumn.locator('.kanban-card')
    await expect(doneCards).toHaveCount(2)

    const secondCardTitle = await doneCards.nth(1).locator('.card-title').textContent()

    // Focus first card and move down within column
    await doneCards.nth(0).focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Space')

    // Verify order swapped
    const reorderedFirst = await doneColumn.locator('.kanban-card').nth(0).locator('.card-title').textContent()
    expect(reorderedFirst).toBe(secondCardTitle)
  })

  test('enforces zero emoji rule in visible UI', async ({ page }) => {
    const bodyText = await page.innerText('body')
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u
    expect(emojiRegex.test(bodyText)).toBe(false)
  })
})
