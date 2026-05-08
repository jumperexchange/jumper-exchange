import { expect, test } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

import { baseMiniApp } from '../../src/app/lib/metadata';

test.describe('Farcaster manifest (.well-known/farcaster.json)', () => {
  test(
    qase(100, 'should load farcaster.json with miniApp settings'),
    async ({ baseURL, request }) => {
      const response = await request.get(
        `${baseURL}/.well-known/farcaster.json`,
      );

      expect(response.status()).toBe(200);

      const data = await response.json();

      expect(data.miniapp).toBeDefined();
      expect(data.miniapp.name).toBe('Jumper Mini App');
      expect(data.miniapp.splashBackgroundColor).toBe(
        baseMiniApp.splashBackgroundColor,
      );
      expect(data.miniapp.iconUrl).toContain(baseMiniApp.iconUrl);
      expect(data.miniapp.splashImageUrl).toContain(baseMiniApp.splashImageUrl);

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
    qase(103, 'farcaster.json URLs should be absolute'),
    async ({ baseURL, request }) => {
      const response = await request.get(
        `${baseURL}/.well-known/farcaster.json`,
      );

      const data = await response.json();

      expect(data.miniapp.homeUrl).toMatch(/^https?:\/\//);
      expect(data.miniapp.iconUrl).toMatch(/^https?:\/\//);
      expect(data.miniapp.splashImageUrl).toMatch(/^https?:\/\//);
    },
  );
});
