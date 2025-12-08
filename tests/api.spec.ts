import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test.describe('API env-config.js', () => {
  test(
    qase(29, 'should only expose NEXT_PUBLIC variables'),
    async ({ baseURL, page }) => {
      // Navigate to the base URL first
      await page.goto(baseURL || 'http://localhost:3000');

      // Fetch the script content
      const scriptUrl = `${baseURL}/api/env-config.js`;
      const response = await page.request.get(scriptUrl);
      expect(response.status()).toBe(200);

      const scriptContent = await response.text();
      expect(scriptContent).toBeDefined();

      // Inject the script content into the page
      await page.addScriptTag({ content: scriptContent });

      // Evaluate window._env_ in the browser context
      const env = await page.evaluate(() => (window as any)._env_);
      expect(env, 'window._env_ should be defined').toBeDefined();
      const keys = Object.keys(env);
      // Check that all keys start with NEXT_PUBLIC
      const nonPublicKeys = keys.filter((k) => !k.startsWith('NEXT_PUBLIC'));
      expect(
        nonPublicKeys,
        `Non-NEXT_PUBLIC keys exposed: ${nonPublicKeys.join(', ')}`,
      ).toHaveLength(0);
    },
  );
});
