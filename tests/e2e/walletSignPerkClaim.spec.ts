import { qase } from 'playwright-qase-reporter';

import { expect, connectedTest as test } from './fixtures';
import { ProfilePage } from './pages';

// Cross-repo flow: Jumper UI → wagmi useSignMessage → MetaMask popup →
// jumper-backend /v1/perks/claim. End-to-end coverage for the signature path
// the mock wallet could not exercise.
//
// Fixture-data dependency: the test wallet must see at least one published,
// unclaimed perk on the connected backend. The connected backend is whichever
// `NEXT_PUBLIC_BACKEND_URL` resolves to at run time (develop by default).
test.describe('Perk claim — sign and submit', () => {
  test(
    qase(200, 'Claim a perk with a real signature'),
    async ({ jumperPage, wallet }) => {
      // jscpd:ignore-start
      // Sister spec to walletSignPerkClaimReject — the duplication makes the
      // diff (sign vs reject) immediately visible to a reader.
      await jumperPage.goto('/profile');
      const profilePage = new ProfilePage(jumperPage);

      await profilePage.expectVisible();
      await profilePage.openPerksTab();
      await profilePage.expectPerksCards();
      // jscpd:ignore-end

      const claimResponsePromise = jumperPage.waitForResponse(
        (response) =>
          /\/v1\/perks\/claim$/.test(new URL(response.url()).pathname) &&
          response.request().method() === 'POST',
      );

      await profilePage.clickFirstPerkClaim();
      await wallet.signPopup(wallet.getContext());

      const claimResponse = await claimResponsePromise;
      expect(claimResponse.status()).toBe(200);

      await profilePage.expectPerkClaimed();
    },
  );
});
