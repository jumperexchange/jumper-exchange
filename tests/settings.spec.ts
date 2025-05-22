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

// Settings menu constants
const SETTINGS_MENU = {
  TITLE: 'Settings',
  ROUTE_PRIORITY: {
    LABEL: 'Route priority',
    BEST_RETURN: 'Best Return',
    FASTEST: 'Fastest'
  },
  GAS_PRICE: {
    LABEL: 'Gas price',
    SLOW: 'Slow',
    FAST: 'Fast',
    NORMAL: 'Normal'
  },
  SLIPPAGE: {
    LABEL: 'Max. slippage',
    AUTO: 'Auto',
    WARNING_MESSAGE: 'Low slippage tolerance may cause transaction delays or failures.'
  },
  BRIDGES: {
    LABEL: 'Bridges'
  },
  EXCHANGES: {
    LABEL: 'Exchanges'
  },
  RESET: {
    BUTTON: 'Reset settings',
    DIALOG_CONFIRM_BUTTON: 'Reset'
  }
};

test.describe('Settings menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('should verify all settings menu functionality', async ({ page }) => {
    // Step 1: Open settings menu and verify title
    await test.step('Open settings menu', async () => {
      await page.getByRole('button', { name: SETTINGS_MENU.TITLE }).click();
      await expect(page.getByText(SETTINGS_MENU.TITLE)).toBeVisible();
    });

    // Step 2: Verify route priority options
    await test.step('Verify route priority options', async () => {
      await clickItemInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.LABEL);
      await checkItemInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.BEST_RETURN, { enabled: true });
      await checkItemInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.FASTEST, { visible: true });
      
      // Select fastest route
      await clickItemInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.FASTEST);
      await clickItemInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.LABEL);
      // Verify that the fastest route is selected
      await checkItemInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.FASTEST, { visible: true });
      await expect(page.locator('span.MuiBadge-badge.MuiBadge-colorInfo')).toBeVisible();
    });

    // Step 3: Verify gas price options
    await test.step('Verify gas price options', async () => {
      await clickItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.LABEL);
      await checkItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.SLOW, { enabled: true });
      await checkItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.FAST, { enabled: true });
      
      // Verify gas price buttons are enabled
      await checkItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.SLOW, { enabled: true });
      await checkItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.FAST, { enabled: true });

      // Select slow gas price
      await clickItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.SLOW);
      await clickItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.LABEL);
      // Verify that the slow gas price is selected
      await checkItemInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.SLOW, { visible: true });
    });

    // Step 4: Verify slippage settings
    await test.step('Verify slippage settings', async () => {
      await clickItemInSettingsMenu(page, SETTINGS_MENU.SLIPPAGE.LABEL);
      await checkItemInSettingsMenu(page, SETTINGS_MENU.SLIPPAGE.AUTO, { visible: true });

      const slippageInput = page.locator('xpath=//input[@placeholder="Custom"]');
      await expect(slippageInput).toBeVisible();
      const slippageValue = '0.05';
      await slippageInput.fill(slippageValue);
      // Verify that the warning icon and text are visible
      await expect(page.getByTestId('WarningRoundedIcon')).toBeVisible();
      await expect(page.getByText(SETTINGS_MENU.SLIPPAGE.WARNING_MESSAGE)).toBeVisible();
      // Close max slippage settings
      await clickItemInSettingsMenu(page, SETTINGS_MENU.SLIPPAGE.LABEL);
      // Verify that the slippage value is set to the custom value
      await checkSettingInSettingsMenu(page, `${slippageValue}%`, { visible: true });
      await expect(page.locator('span.MuiBadge-badge.MuiBadge-colorWarning')).toBeVisible();
    });

    // Step 5: Verify Bridge Settings - Deselect and select 1 bridge
    await test.step('Verify Bridge Settings - Deselect and select 1 bridge', async () => {
      await clickItemInSettingsMenu(page, SETTINGS_MENU.BRIDGES.LABEL);
      await expect(page.getByText(SETTINGS_MENU.BRIDGES.LABEL, { exact: true })).toBeVisible();
      const bridgeListItem = page.getByTestId('CheckIcon');
      const bridgeName = await bridgeListItem.locator('..').locator('span').first().textContent() as string;
      
      // Deselect 1 bridge
      await bridgeListItem.first().click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that 1 bridge was deselected
      await checkDeselectedAmount(page, SETTINGS_MENU.BRIDGES.LABEL, 1);
      // Select previously deselected bridge
      await clickItemInSettingsMenu(page, SETTINGS_MENU.BRIDGES.LABEL);
      await page.getByText(bridgeName).click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that all bridges are selected
      await checkFractionsEqual(page, SETTINGS_MENU.BRIDGES.LABEL);
    });

    // Step 6: Verify Exchange Settings - Deselect and select all exchanges
    await test.step('Verify Exchange Settings - Deselect and select all exchanges', async () => {
      await clickItemInSettingsMenu(page, SETTINGS_MENU.EXCHANGES.LABEL);
      await expect(page.getByText(SETTINGS_MENU.EXCHANGES.LABEL, { exact: true })).toBeVisible();
      const deselectAllButton = page.getByTestId('CheckBoxOutlinedIcon');
      await deselectAllButton.click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that 1 exchange was deselected
      await checkNoneSelected(page, SETTINGS_MENU.EXCHANGES.LABEL);
      // Select all exchanges
      await clickItemInSettingsMenu(page, SETTINGS_MENU.EXCHANGES.LABEL);
      const selectAllButton = page.getByTestId('IndeterminateCheckBoxOutlinedIcon');
      await selectAllButton.click();
      // Return to Settings Menu
      await page.getByTestId('ArrowBackIcon').first().click();
      // Verify that all exchanges are selected
      await checkFractionsEqual(page, SETTINGS_MENU.EXCHANGES.LABEL);
    });

    // Final step: Reset settings
    await test.step('Reset settings', async () => {
      await checkItemInSettingsMenu(page, SETTINGS_MENU.RESET.BUTTON, { visible: true });
      // Click reset settings
      await clickItemInSettingsMenu(page, SETTINGS_MENU.RESET.BUTTON);
      // Confirm reset
      await page.getByRole('button', { name: SETTINGS_MENU.RESET.DIALOG_CONFIRM_BUTTON }).click();
      // Verify that the reset settings button disappeared after reset
      await checkSettingInSettingsMenu(page, SETTINGS_MENU.RESET.BUTTON, { invisible: true });
      // Verify that all values are reset after reset
      await checkSettingInSettingsMenu(page, SETTINGS_MENU.ROUTE_PRIORITY.BEST_RETURN, { visible: true });
      await checkSettingInSettingsMenu(page, SETTINGS_MENU.GAS_PRICE.NORMAL, { visible: true });
      await checkSettingInSettingsMenu(page, SETTINGS_MENU.SLIPPAGE.AUTO, { visible: true });
      
      // Check that fractions are equal for both Bridges and Exchanges
      await checkFractionsEqual(page, SETTINGS_MENU.BRIDGES.LABEL);
      await checkFractionsEqual(page, SETTINGS_MENU.EXCHANGES.LABEL);
    });
  });
});
