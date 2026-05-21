import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

import { connectedTest as test } from './fixtures/connectedWallet';

// Real signature path: Jumper → wagmi → MetaMask → LiFi /tasks_verification.
// External dependency on NEXT_PUBLIC_LIFI_BACKEND_URL — service down = test fails. Signal, not flake.
test.describe('Mission wallet verification', () => {
  // Blocked on funded QA wallet — requires an active mission with a verifiable user.
  test.fixme(
    qase(203, 'Verify wallet on a mission via real signature'),
    async ({ jumperPage, wallet }) => {
      // TODO(app): JUM-924 — add `missions-list` + `mission-verify-button` testids.
      await jumperPage.goto('/missions');
      await jumperPage.waitForLoadState('domcontentloaded');

      const verifyWalletButton = jumperPage
        .getByRole('button', { name: 'Verify wallet' })
        .first();
      await expect(verifyWalletButton).toBeVisible();
      await verifyWalletButton.click();

      const verificationResponsePromise = jumperPage.waitForResponse(
        (response) =>
          /\/tasks_verification(\?|$)/.test(response.url()) &&
          response.request().method() === 'POST',
      );

      await wallet.signPopup(wallet.getContext());
      const verificationResponse = await verificationResponsePromise;
      expect(verificationResponse.status()).toBe(200);

      await expect(
        jumperPage.getByText('Wallet verified', { exact: false }).first(),
      ).toBeVisible();
    },
  );
});
