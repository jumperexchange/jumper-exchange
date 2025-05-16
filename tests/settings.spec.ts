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

  test('should verify all settings menu functionality', async ({ page }) => {
    // Step 1: Open settings menu and verify title
    await test.step('Open settings menu', async () => {
      await page.getByRole('button', { name: 'Settings' }).click();
      await expect(page.getByText('Settings')).toBeVisible();
    });

    // Step 2: Verify route priority options
    await test.step('Verify route priority options', async () => {
      await itemInSettingsMenu(page, 'Route priority');
      await checkItemInSettingsMenu(page, 'Best Return', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fastest', { visible: true });
      
      // Select fastest route
      await itemInSettingsMenu(page, 'Fastest');
      await checkItemInSettingsMenu(page, 'Reset settings', { visible: true });
    });

    // Step 3: Verify gas price options
    await test.step('Verify gas price options', async () => {
      await itemInSettingsMenu(page, 'Gas price');
      await checkItemInSettingsMenu(page, 'Slow', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fast', { enabled: true });
      
      // Verify gas price buttons are enabled
      await checkItemInSettingsMenu(page, 'Slow', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fast', { enabled: true });
    });

    // Step 4: Verify slippage settings
    await test.step('Verify slippage settings', async () => {
      await itemInSettingsMenu(page, 'Max. slippage');
      await checkItemInSettingsMenu(page, 'Auto', { visible: true });
      await expect(page.locator('xpath=//input[@placeholder="Custom"]')).toBeVisible();
    });
  });
});
