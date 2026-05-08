import { qase } from 'playwright-qase-reporter';

import { baseMiniApp } from '../../src/app/lib/metadata';
import { expect, noWalletTest as test } from './fixtures';

test.describe('Mini App meta tags on page head', () => {
  test(
    qase(101, 'should include miniApp meta tags in page head'),
    async ({ baseURL, page }) => {
      await page.goto(baseURL || '/');

      const fcMiniappMeta = page.locator('meta[name="fc:miniapp"]');
      await expect(fcMiniappMeta).toHaveCount(1);

      const fcMiniappContent = await fcMiniappMeta.getAttribute('content');
      expect(fcMiniappContent).toBeDefined();

      const miniappData = JSON.parse(fcMiniappContent ?? '');
      expect(miniappData.version).toBe('next');
      expect(miniappData.imageUrl).toContain(baseMiniApp.iconUrl);
      expect(miniappData.button).toBeDefined();
      expect(miniappData.button.title).toBe('Launch Jumper');
      expect(miniappData.button.action.type).toBe('launch_miniapp');
      expect(miniappData.button.action.name).toBe('Jumper');
      expect(miniappData.button.action.splashImageUrl).toContain(
        baseMiniApp.splashImageUrl,
      );
      expect(miniappData.button.action.splashBackgroundColor).toBe(
        baseMiniApp.splashBackgroundColor,
      );
    },
  );

  test(
    qase(102, 'should include base:app_id meta tag when settings are loaded'),
    async ({ baseURL, page }) => {
      await page.goto(baseURL || '/');

      const baseAppIdMeta = page.locator('meta[name="base:app_id"]');
      await expect(baseAppIdMeta).toHaveCount(1);

      const appIdContent = baseAppIdMeta;
      expect(appIdContent).toBeDefined();
      await expect(appIdContent).not.toHaveAttribute('content', '');
    },
  );
});
