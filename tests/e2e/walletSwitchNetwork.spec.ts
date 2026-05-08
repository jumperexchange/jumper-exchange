import { qase } from 'playwright-qase-reporter';

import { expect, connectedTest as test } from './fixtures';
import { networks } from './wallet/constants/networkConstants';

// Exercises the full wagmi useSwitchChain → MetaMask provider event → widget
// re-render path. The mock wallet treated this as a no-op; this hits the real
// switch flow end-to-end.
test.describe('Switch network from Jumper widget', () => {
  test(
    qase(202, 'Switch chain via Jumper triggers MetaMask popup'),
    async ({ jumperPage, wallet }) => {
      await jumperPage.goto('/');
      await jumperPage.waitForLoadState('domcontentloaded');

      // TODO(app): JUM-924 — confirm/rename the from-chain selector testid;
      // `widget-source-chain` is a guess and doesn't render on prod today.
      const fromChainSelector = jumperPage.getByTestId('widget-source-chain');
      await expect(fromChainSelector).toBeVisible();
      await fromChainSelector.click();

      const target = networks.optimism;
      await jumperPage
        .getByRole('option', { name: target.networkName })
        .first()
        .click();

      await wallet.switchNetworkFromPopup(wallet.getContext());

      // Widget should reflect the new chain back into its UI within the
      // expect timeout once the provider emits chainChanged.
      await expect(fromChainSelector).toContainText(target.networkName);
    },
  );
});
