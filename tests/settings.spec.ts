import { expect, test } from '@playwright/test';
import {
  itemInSettingsMenu,
  checkItemInSettingsMenu,
} from './testData/settingsFunctions';
import { closeWelcomeScreen } from './testData/landingPageFunctions';

test.describe('Settings menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });
  test('Should open Settings menu', async ({ page }) => {
    const settingsTitle = page.locator(
      'xpath=//p[normalize-space(text())="Settings"]',
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
    await checkItemInSettingsMenu(page, 'Best Return', { enabled: true });
    await checkItemInSettingsMenu(page, 'Fastest', { visible: true });
    await fastestButton.click();
    await checkItemInSettingsMenu(page, 'Reset settings', { visible: true });
    await itemInSettingsMenu(page, 'Gas price');
    await checkItemInSettingsMenu(page, 'Slow', { enabled: true });
    await checkItemInSettingsMenu(page, 'Fast', { enabled: true });
    await expect(slowGasPrice).toBeEnabled();
    await expect(fastGasPrice).toBeEnabled();
    await itemInSettingsMenu(page, 'Max. slippage');
    await checkItemInSettingsMenu(page, 'Auto', { visible: true });
    await expect(customSlippage).toBeVisible();
  });
});
