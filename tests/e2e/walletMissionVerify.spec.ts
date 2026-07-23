import { expect } from '@playwright/test';

import { connectedTest as test } from './fixtures/connectedWallet';

// Real signature path: Jumper → wagmi → MetaMask → LiFi /tasks_verification.
// External dependency on NEXT_PUBLIC_LIFI_BACKEND_URL — service down = test fails. Signal, not flake.
test.describe('Mission wallet verification', () => {
  // Blocked on funded QA wallet — requires an active mission with a verifiable user.
  test.fixme('Verify wallet on a mission via real signature', async ({
    jumperPage,
    wallet,
  }) => {
    await jumperPage.goto('/missions');
    await jumperPage.waitForLoadState('domcontentloaded');
    await expect(jumperPage.getByTestId('missions-list')).toBeVisible();

    // Verify buttons render on the mission detail page, not the list.
    await jumperPage.locator('[data-testid^="mission-card-"]').first().click();
    await expect(jumperPage.getByTestId('mission-details')).toBeVisible();

    const verifyWalletButton = jumperPage
      .getByTestId('mission-verify-button')
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
  });
});
