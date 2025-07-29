import { test, expect } from '@playwright/test';

test.describe('API env-config.js', () => {
  test('should only expose NEXT_PUBLIC variables', async ({
    baseURL,
    page,
  }) => {
    // Go to a blank page to avoid side effects
    await page.goto('about:blank');
    // Inject the env-config.js script
    await page.addScriptTag({ url: `${baseURL}/api/env-config.js` });
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
  });
});
