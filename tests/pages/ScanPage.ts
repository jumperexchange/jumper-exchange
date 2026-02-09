import { expect, type Page } from '@playwright/test';

export async function clickOnTransactionEntry(page: Page, index: number) {
  // Wait for the transaction list to be loaded (not showing skeleton)
  // First wait for the "Latest transfers" heading to be visible
  await expect(
    page.getByRole('heading', { name: 'Latest transfers' }),
  ).toBeVisible();

  // Wait for transaction links to be visible
  await expect(page.locator('a[href^="/scan/tx/"]').first()).toBeVisible();

  // Click on the transaction link at the specified index
  await page.locator('a[href^="/scan/tx/"]').nth(index).click();
}

export async function clickOnFirstTransaction(page: Page) {
  await clickOnTransactionEntry(page, 0);
}

export async function expectToBeOnTransactionPage(page: Page) {
  // Wait for navigation to complete
  await page.waitForURL(/\/tx\//);
  await expect(page).toHaveURL(/\/tx\//);
  await expect(page.getByRole('heading', { name: 'Transfer' })).toBeVisible();
}
