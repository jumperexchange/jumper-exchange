import { qase } from 'playwright-qase-reporter';

import { realWalletTest as test } from './fixtures/realWallet';
import { networks } from './wallet/constants/networkConstants';

// Smoke for the wallet driver: catches MetaMask UI drift before app-driven specs do.
test.describe('MetaMask: add custom network', () => {
  test(
    qase(204, 'Add and select a custom network from the wallet UI'),
    async ({ wallet }) => {
      await wallet.addAndSelectNetwork(networks.baseSepolia);
      await wallet.expectNetworkVisible(networks.baseSepolia.networkName);
    },
  );
});
