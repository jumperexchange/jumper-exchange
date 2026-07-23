import { expect } from '@playwright/test';

import { connectedTest as test } from './fixtures/connectedWallet';
import { ProfilePage } from './pages/ProfilePage';

// Real signature path: Jumper → wagmi → MetaMask → jumper-backend /v1/perks/claim.
// Requires the test wallet to have an unclaimed published perk on the connected backend.
test.describe('Perk claim — sign and submit', () => {
  // Blocked on funded QA wallet — requires an unclaimed published perk for the connected wallet.
  test.fixme('Claim a perk with a real signature', async ({
    jumperPage,
    wallet,
  }) => {
    // jscpd:ignore-start — sister spec to walletSignPerkClaimReject; diff (sign vs reject) is the point.
    await jumperPage.goto('/profile');
    const profilePage = new ProfilePage(jumperPage);

    await profilePage.expectVisible();
    await profilePage.openPerksTab();
    await profilePage.expectPerksCards();
    // jscpd:ignore-end

    const claimResponsePromise = jumperPage.waitForResponse(
      (response) =>
        new URL(response.url()).pathname.endsWith('/v1/perks/claim') &&
        response.request().method() === 'POST',
    );

    await profilePage.clickFirstPerkClaim();
    await wallet.signPopup(wallet.getContext());

    const claimResponse = await claimResponsePromise;
    expect(claimResponse.status()).toBe(200);

    await profilePage.expectPerkClaimed();
  });
});
