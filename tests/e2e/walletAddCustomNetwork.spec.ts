import { qase } from 'playwright-qase-reporter';

import { realWalletTest as test } from './fixtures';
import { networks } from './wallet/constants/networkConstants';

// Smoke for the wallet driver itself: drive MetaMask's add-custom-network UI
// directly (no Jumper involved). Catches MetaMask UI drift early so the
// app-driven wallet specs aren't the first to notice when MetaMask renames
// a button or moves a screen.
test.describe('MetaMask: add custom network', () => {
  // eslint-disable-next-line playwright/expect-expect -- `addAndSelectNetwork` is a composite wallet driver action that throws on UI drift (button missing, dialog flow changed); successful completion IS the assertion. Adding a separate `expect*` would duplicate the implicit guarantee.
  test(
    qase(204, 'Add and select a custom network from the wallet UI'),
    async ({ wallet }) => {
      await wallet.addAndSelectNetwork(networks.baseSepolia);
    },
  );
});
