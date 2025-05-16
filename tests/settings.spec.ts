import { expect, test } from '@playwright/test';
import {
  itemInSettingsMenu,
  checkItemInSettingsMenu,
} from './testData/settingsFunctions';
import { closeWelcomeScreen } from './testData/landingPageFunctions';

/**
 * Selectors for the Settings menu and its components
 * All selectors use XPath for precise text matching
 */
const SELECTORS = {
  // Main menu elements
  settingsButton: 'xpath=//button[@aria-label="Settings"]',
  settingsTitle: 'xpath=//p[normalize-space(text())="Settings"]',
  
  // Route priority options
  fastestButton: 'xpath=//button[normalize-space(text())="Fastest"]',
  
  // Gas price options
  slowGasPrice: 'xpath=//button[normalize-space(text())="Slow"]',
  fastGasPrice: 'xpath=//button[normalize-space(text())="Fast"]',
  
  // Slippage settings
  customSlippage: 'xpath=//input[@placeholder="Custom"]'
} as const;

test.describe('Settings menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('should verify all settings menu functionality', async ({ page }) => {
    // Step 1: Open settings menu and verify title
    await test.step('Open settings menu', async () => {
      await page.locator(SELECTORS.settingsButton).click();
      await expect(page.locator(SELECTORS.settingsTitle)).toBeVisible();
    });

    // Step 2: Verify route priority options
    await test.step('Verify route priority options', async () => {
      await itemInSettingsMenu(page, 'Route priority');
      await checkItemInSettingsMenu(page, 'Best Return', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fastest', { visible: true });
      
      // Select fastest route
      const fastestButton = page.locator(SELECTORS.fastestButton);
      await fastestButton.click();
      await checkItemInSettingsMenu(page, 'Reset settings', { visible: true });
    });

    // Step 3: Verify gas price options
    await test.step('Verify gas price options', async () => {
      await itemInSettingsMenu(page, 'Gas price');
      await checkItemInSettingsMenu(page, 'Slow', { enabled: true });
      await checkItemInSettingsMenu(page, 'Fast', { enabled: true });
      
      // Verify gas price buttons are enabled
      const slowGasPrice = page.locator(SELECTORS.slowGasPrice);
      const fastGasPrice = page.locator(SELECTORS.fastGasPrice);
      await expect(slowGasPrice).toBeEnabled();
      await expect(fastGasPrice).toBeEnabled();
    });

    // Step 4: Verify slippage settings
    await test.step('Verify slippage settings', async () => {
      await itemInSettingsMenu(page, 'Max. slippage');
      await checkItemInSettingsMenu(page, 'Auto', { visible: true });
      await expect(page.locator(SELECTORS.customSlippage)).toBeVisible();
    });
  });
});
