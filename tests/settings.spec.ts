import { expect, test } from '@playwright/test';
import {
  clickItemInSettingsMenu,
  checkItemInSettingsMenu,
  checkSettingInSettingsMenu,
  checkFractionsEqual,
  checkDeselectedAmount,
  checkNoneSelected,
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

    // Step 5: Verify Bridge Settings - Deselect and select 1 bridge
    await test.step('Verify Bridge Settings - Deselect and select 1 bridge', async () => {
      await clickItemInSettingsMenu(page, 'Bridges');
      await expect(page.getByText('Bridges', { exact: true })).toBeVisible();
      const bridgeListItem = page.getByTestId('CheckIcon');
      const bridgeName = await bridgeListItem.locator('..').locator('span').first().textContent() as string;
      
      // Deselect 1 bridge
      await bridgeListItem.first().click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that 1 bridge was deselected
      await checkDeselectedAmount(page, 'Bridges', 1);
      // Select previously deselected bridge
      await clickItemInSettingsMenu(page, 'Bridges');
      await page.getByText(bridgeName).click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that all bridges are selected
      await checkFractionsEqual(page, 'Bridges');
    });

    // Step 6: Verify Exchange Settings - Deselect and select all exchanges
    await test.step('Verify Exchange Settings - Deselect and select all exchanges', async () => {
      await clickItemInSettingsMenu(page, 'Exchanges');
      await expect(page.getByText('Exchanges', { exact: true })).toBeVisible();
      const deselectAllButton = page.getByTestId('CheckBoxOutlinedIcon');
      await deselectAllButton.click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that 1 exchange was deselected
      await checkNoneSelected(page, 'Exchanges');
      // Select all exchanges
      await clickItemInSettingsMenu(page, 'Exchanges');
      const selectAllButton = page.getByTestId('IndeterminateCheckBoxOutlinedIcon');
      await selectAllButton.click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that all exchanges are selected
      await checkFractionsEqual(page, 'Exchanges');
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
