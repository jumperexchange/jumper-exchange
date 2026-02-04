import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { baseMiniApp } from '../src/app/lib/metadata';

test.describe('Mini App Settings Integration', () => {
  test(
    qase(100, 'should load farcaster.json with miniApp settings'),
    async ({ baseURL, page }) => {
      const response = await page.request.get(
        `${baseURL}/.well-known/farcaster.json`,
      );

      expect(response.status()).toBe(200);

      const data = await response.json();

      // Verify miniApp object exists
      expect(data.miniapp).toBeDefined();

      // Verify required miniApp fields from utils/miniApp.ts
      expect(data.miniapp.name).toBe('Jumper Mini App');
      expect(data.miniapp.splashBackgroundColor).toBe(
        baseMiniApp.splashBackgroundColor,
      );
      expect(data.miniapp.iconUrl).toContain(baseMiniApp.iconUrl);
      expect(data.miniapp.splashImageUrl).toContain(baseMiniApp.splashImageUrl);

      // Verify other required miniApp manifest fields
      expect(data.miniapp.version).toBe('1');
      expect(data.miniapp.homeUrl).toBeDefined();
      expect(data.miniapp.primaryCategory).toBe('finance');
      expect(data.miniapp.tags).toContain('jumper');
      expect(data.accountAssociation).toBeDefined();
      expect(data.accountAssociation.header).toBeDefined();
      expect(data.accountAssociation.payload).toBeDefined();
      expect(data.accountAssociation.signature).toBeDefined();
    },
  );

  test(
    qase(101, 'should include miniApp meta tags in page head'),
    async ({ baseURL, page }) => {
      await page.goto(baseURL || '/');

      // Check for fc:miniapp meta tag
      const fcMiniappMeta = page.locator('meta[name="fc:miniapp"]');
      await expect(fcMiniappMeta).toHaveCount(1);

      const fcMiniappContent = await fcMiniappMeta.getAttribute('content');
      expect(fcMiniappContent).toBeDefined();

      // Parse and verify the fc:miniapp JSON content
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

      // Check for base:app_id meta tag
      const baseAppIdMeta = page.locator('meta[name="base:app_id"]');
      await expect(baseAppIdMeta).toHaveCount(1);

      const appIdContent = await baseAppIdMeta.getAttribute('content');
      // appId should be present (may not be empty string for the chosen environment)
      expect(appIdContent).toBeDefined();
      expect(appIdContent).not.toBe('');
    },
  );

  test(
    qase(103, 'farcaster.json URLs should be absolute'),
    async ({ baseURL, page }) => {
      const response = await page.request.get(
        `${baseURL}/.well-known/farcaster.json`,
      );

      const data = await response.json();

      // Verify URLs are absolute (start with http)
      expect(data.miniapp.homeUrl).toMatch(/^https?:\/\//);
      expect(data.miniapp.iconUrl).toMatch(/^https?:\/\//);
      expect(data.miniapp.splashImageUrl).toMatch(/^https?:\/\//);
    },
  );
});
