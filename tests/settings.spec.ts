import { expect, test } from '@playwright/test';
import { itemInSettingsMenu, itemInSettingsMenuToBeEnabled, itemInSettingsMenuToBeVisible } from './testData/settingsFunctions';
import { closeWelcomeScreen } from './testData/commonFunctions';

test.describe('Settings menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });
  test('Should open Settings menu', async ({ page }) => {
    const settingsTitle = page.locator(
      'xpath=//p[normalize-space(text())="Settings"]',
    );
    const bestReturnButton = page.locator(
      'xpath=//button[normalize-space(text())="Best Return"]',
    );
    const fastestButton = page.locator(
      'xpath=//button[normalize-space(text())="Fastest"]',
    );
    const slowGasPrice = page.locator(
      'xpath=//button[normalize-space(text())="Slow"]',
    );
    const fastGasPrice = page.locator(
      'xpath=//button[normalize-space(text())="Fast"]',
    );
    const customSlippage = page.locator('xpath=//input[@placeholder="Custom"]');
    await page.locator('xpath=//div[@class="MuiBox-root mui-afg6ra"]').click();
    await expect(settingsTitle).toBeVisible();
    await itemInSettingsMenu(page, 'Route priority');
    await itemInSettingsMenuToBeEnabled(page, 'Best Return');
    await expect(bestReturnButton).toBeEnabled();
    await itemInSettingsMenuToBeVisible(page, 'Fastest');
    await fastestButton.click();
    await itemInSettingsMenuToBeVisible(page, 'Reset settings');
    await itemInSettingsMenu(page, 'Gas price');
    await itemInSettingsMenuToBeEnabled(page, 'Slow');
    await itemInSettingsMenuToBeEnabled(page, 'Fast');
    await expect(slowGasPrice).toBeEnabled();
    await expect(fastGasPrice).toBeEnabled();
    await itemInSettingsMenu(page, 'Max. slippage');
    await itemInSettingsMenuToBeVisible(page, '0.5');
    await expect(customSlippage).toBeVisible();
  })
})