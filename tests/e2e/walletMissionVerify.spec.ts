import { qase } from 'playwright-qase-reporter';

import { expect, connectedTest as test } from './fixtures';

// Cross-LiFi flow: Jumper UI → wagmi useSignMessage → MetaMask popup →
// jumper-frontend posts to LiFi `/tasks_verification`. A failure here can
// originate in Jumper, in the widget team's signing helper, or in LiFi core —
// catching all three is the whole point.
//
// External dependency: hits LiFi's `/tasks_verification` service at the URL in
// `NEXT_PUBLIC_LIFI_BACKEND_URL`. If that service is down, this test fails;
// that is signal, not flake. Do not mock.
test.describe('Mission wallet verification', () => {
  test(
    qase(203, 'Verify wallet on a mission via real signature'),
    async ({ jumperPage, wallet }) => {
      // TODO(app): JUM-924 — add `missions-list` and `mission-verify-button`
      // testids. Until then, the test asserts on heading + button label.
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
