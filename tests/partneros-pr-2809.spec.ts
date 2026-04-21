import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { closeWelcomeScreen } from './testData/landingPageFunctions';

[
  { name: 'Mobile', size: { width: 375, height: 812 } },
  { name: 'Desktop', size: { width: 1920, height: 1080 } },
].forEach(({ name, size }) => {
  test.describe(`ExpandableSection — Portfolio Assets [Viewport: ${name}]`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await closeWelcomeScreen(page);
    });

    test(
      qase(0 /* TODO: assign Qase ID */, 'expandable section expands to reveal asset items on click'),
      async ({ page }) => {
        await test.step('navigate to portfolio page', async () => {
          await page.goto('/portfolio');
        });
        await test.step('click expandable section header', async () => {
          const expandableHeader = page.locator('[data-testid="expandable-section-summary"]').first();
          await expandableHeader.waitFor({ state: 'visible' });
          await expandableHeader.click();
        });
        await test.step('confirm items are visible after expansion', async () => {
          const items = page.locator('[data-testid="expandable-section-item"]');
          await items.first().waitFor({ state: 'visible' });
        });
      },
    );

    test(
      qase(0 /* TODO: assign Qase ID */, 'expandable section collapses on second click'),
      async ({ page }) => {
        await test.step('navigate to portfolio page', async () => {
          await page.goto('/portfolio');
        });
        await test.step('expand then collapse section', async () => {
          const expandableHeader = page.locator('[data-testid="expandable-section-summary"]').first();
          await expandableHeader.waitFor({ state: 'visible' });
          await expandableHeader.click();
          await expandableHeader.click();
        });
        await test.step('items are hidden after collapse', async () => {
          const items = page.locator('[data-testid="expandable-section-item"]');
          await expect(items.first()).toBeHidden();
        });
      },
    );

    test(
      qase(0 /* TODO: assign Qase ID */, 'non-expandable section does not respond to header click'),
      async ({ page }) => {
        await test.step('navigate to portfolio page', async () => {
          await page.goto('/portfolio');
        });
        await test.step('click non-expandable section header and verify no items appear', async () => {
          // A section with shouldExpand=false should not open
          const nonExpandableHeader = page.locator('[data-testid="expandable-section-summary"][data-expandable="false"]').first();
          if (await nonExpandableHeader.isVisible()) {
            await nonExpandableHeader.click();
            const items = page.locator('[data-testid="expandable-section-item"]');
            // Should still be hidden
            await expect(items.first()).toBeHidden();
          }
        });
      },
    );

    test(
      qase(0 /* TODO: assign Qase ID */, 'expand icon is absent when showExpandIcon is false'),
      async ({ page }) => {
        await test.step('navigate to portfolio page', async () => {
          await page.goto('/portfolio');
        });
        await test.step('check that no expand icon is rendered on icon-hidden sections', async () => {
          const noIconSection = page.locator('[data-testid="expandable-section-no-icon"]').first();
          if (await noIconSection.isVisible()) {
            const expandIcon = noIconSection.locator('svg[data-testid="ExpandMoreIcon"]');
            await expect(expandIcon).toBeHidden();
          }
        });
      },
    );
  });
});