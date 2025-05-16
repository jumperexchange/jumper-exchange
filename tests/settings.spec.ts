import { expect, test } from '@playwright/test';
import {
  clickItemInSettingsMenu,
  checkItemInSettingsMenu,
  checkSettingInSettingsMenu,
  getNumeratorDenominator,
  checkFractionsEqual,
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
      await clickItemInSettingsMenu(page, 'Route priority');
      await checkItemInSettingsMenu(page, 'Best Return', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fastest', { visible: true });
      
      // Select fastest route
      await clickItemInSettingsMenu(page, 'Fastest');
      await clickItemInSettingsMenu(page, 'Route priority');
      // Verify that the fastest route is selected
      await checkItemInSettingsMenu(page, 'Fastest', { visible: true });
      await expect(page.locator('span.MuiBadge-badge.MuiBadge-colorInfo')).toBeVisible();
    });

    // Step 3: Verify gas price options
    await test.step('Verify gas price options', async () => {
      await clickItemInSettingsMenu(page, 'Gas price');
      await checkItemInSettingsMenu(page, 'Slow', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fast', { enabled: true });
      
      // Verify gas price buttons are enabled
      await checkItemInSettingsMenu(page, 'Slow', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fast', { enabled: true });

      // Select slow gas price
      await clickItemInSettingsMenu(page, 'Slow');
      await clickItemInSettingsMenu(page, 'Gas price');
      // Verify that the slow gas price is selected
      await checkItemInSettingsMenu(page, 'Slow', { visible: true });
    });

    // Step 4: Verify slippage settings
    await test.step('Verify slippage settings', async () => {
      await clickItemInSettingsMenu(page, 'Max. slippage');
      await checkItemInSettingsMenu(page, 'Auto', { visible: true });

      const slippageInput = page.locator('xpath=//input[@placeholder="Custom"]');
      await expect(slippageInput).toBeVisible();
      const slippageValue = '0.05';
      await slippageInput.fill(slippageValue);
      // Verify that the warning icon and text are visible
      await expect(page.getByTestId('WarningRoundedIcon')).toBeVisible();
      await expect(page.getByText('Low slippage tolerance may cause transaction delays or failures.')).toBeVisible();
      // Close max slippage settings
      await clickItemInSettingsMenu(page, 'Max. slippage');
      // Verify that the slippage value is set to the custom value
      await checkSettingInSettingsMenu(page, `${slippageValue}%`, { visible: true });
      await expect(page.locator('span.MuiBadge-badge.MuiBadge-colorWarning')).toBeVisible();
    });

    // Final step: Reset settings
    await test.step('Reset settings', async () => {
      await checkItemInSettingsMenu(page, 'Reset settings', { visible: true });
      // Click reset settings
      await clickItemInSettingsMenu(page, 'Reset settings');
      // Confirm reset
      await page.getByRole('button', { name: 'Reset' }).click();
      // Verify that the reset settings button disappeared after reset
      await checkSettingInSettingsMenu(page, 'Reset settings', { invisible: true });
      // Verify that all values are reset after reset
      await checkSettingInSettingsMenu(page, 'Best Return', { visible: true });
      await checkSettingInSettingsMenu(page, 'Normal', { visible: true });
      await checkSettingInSettingsMenu(page, 'Auto', { visible: true });
      
      // Check that fractions are equal for both Bridges and Exchanges
      await checkFractionsEqual(page, 'Bridges');
      await checkFractionsEqual(page, 'Exchanges');
    });
  });
});
