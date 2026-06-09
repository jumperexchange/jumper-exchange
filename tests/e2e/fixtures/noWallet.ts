import { test as base } from '@playwright/test';

import { attachCloudflareAccessHeaders } from '../utils/cloudflareAccess';

export const noWalletTest = base.extend({
  context: async ({ context }, use) => {
    await attachCloudflareAccessHeaders(context);
    await use(context);
  },
});

export { expect } from '@playwright/test';
