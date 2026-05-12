import { qase } from 'playwright-qase-reporter';

import { expect, connectedTest as test } from './fixtures';
import { networks } from './wallet/constants/networkConstants';

// End-to-end useSwitchChain → MetaMask provider event → widget re-render path.
test.describe('Switch network from Jumper widget', () => {
  test(
    qase(202, 'Switch chain via Jumper triggers MetaMask popup'),
    async ({ jumperPage, wallet }) => {
      // JUM-924 item #1: `widget-source-chain` testid doesn't render on prod today.
      // Re-enable once the FE adds a stable testid for the from-chain selector.
      test.fixme();
      await jumperPage.goto('/');
      await jumperPage.waitForLoadState('domcontentloaded');

      // TODO(app): JUM-924 — `widget-source-chain` is a guess; doesn't render on prod today.
      const fromChainSelector = jumperPage.getByTestId('widget-source-chain');
      await expect(fromChainSelector).toBeVisible();
      await fromChainSelector.click();

      const target = networks.optimism;
      await jumperPage
        .getByRole('option', { name: target.networkName })
        .first()
        .click();

      await wallet.switchNetworkFromPopup(wallet.getContext());

      await expect(fromChainSelector).toContainText(target.networkName);
    },
  );
});
