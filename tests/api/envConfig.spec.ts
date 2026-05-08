import vm from 'node:vm';

import { qase } from 'playwright-qase-reporter';

import { expect, test } from './fixtures';

interface RuntimeEnvWindow {
  _env_?: Record<string, string>;
}

test.describe('API env-config.js', () => {
  test(
    qase(29, 'should only expose NEXT_PUBLIC variables'),
    async ({ baseURL, request }) => {
      const response = await request.get(`${baseURL}/api/env-config.js`);
      expect(response.status()).toBe(200);

      const scriptContent = await response.text();
      expect(scriptContent.length).toBeGreaterThan(0);

      const sandbox: { window: RuntimeEnvWindow } = { window: {} };
      vm.createContext(sandbox);
      vm.runInContext(scriptContent, sandbox);

      const env = sandbox.window._env_;
      expect(env, 'window._env_ should be defined').toBeDefined();
      // eslint-disable-next-line playwright/no-conditional-in-test -- TS-only narrowing; toBeDefined() doesn't propagate types.
      if (!env) {
        return;
      }

      const nonPublicKeys = Object.keys(env).filter(
        (key) => !key.startsWith('NEXT_PUBLIC'),
      );
      expect(
        nonPublicKeys,
        `Non-NEXT_PUBLIC keys exposed: ${nonPublicKeys.join(', ')}`,
      ).toHaveLength(0);
    },
  );
});
