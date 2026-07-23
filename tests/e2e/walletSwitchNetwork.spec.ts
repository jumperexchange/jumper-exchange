import { expect } from '@playwright/test';

import { connectedTest as test } from './fixtures/connectedWallet';
import { networks } from './wallet/constants/networkConstants';

// End-to-end useSwitchChain → MetaMask provider event → widget re-render path.
test.describe('Switch network from Jumper widget', () => {
  // JUM-924 item #1: widget ≥4.2 moved chain selection into the token page —
  // rewrite this flow via `widget-from-chain-<id>` tiles at the widget bump.
  test.fixme('Switch chain via Jumper triggers MetaMask popup', async ({
    jumperPage,
    wallet,
  }) => {
    await jumperPage.goto('/');
    await jumperPage.waitForLoadState('domcontentloaded');

    // TODO(app): JUM-924 item #1 — dead selector; see fixme note above.
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
  });
});
