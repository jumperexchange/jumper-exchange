import { qase } from 'playwright-qase-reporter';

import { realWalletTest as test } from './fixtures';
import { networks } from './wallet/constants/networkConstants';

// Smoke for the wallet driver: catches MetaMask UI drift before app-driven specs do.
test.describe('MetaMask: add custom network', () => {
  // eslint-disable-next-line playwright/expect-expect -- `addAndSelectNetwork` is a composite wallet driver action that throws on UI drift (button missing, dialog flow changed); successful completion IS the assertion. Adding a separate `expect*` would duplicate the implicit guarantee.
  test(
    qase(204, 'Add and select a custom network from the wallet UI'),
    async ({ wallet }) => {
      await wallet.addAndSelectNetwork(networks.baseSepolia);
    },
  );
});
