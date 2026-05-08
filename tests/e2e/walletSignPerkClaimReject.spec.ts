import { qase } from 'playwright-qase-reporter';

import { expect, connectedTest as test } from './fixtures';
import { ProfilePage } from './pages';

// Negative-path counterpart to walletSignPerkClaim: ensure that rejecting the
// MetaMask signature prompt does NOT call jumper-backend and does NOT leave
// the UI in a stuck or claimed state.
test.describe('Perk claim — reject signature', () => {
  test(
    qase(201, 'Reject the perk claim signature'),
    async ({ jumperPage, wallet }) => {
      // jscpd:ignore-start
      // Sister spec to walletSignPerkClaim — the duplication makes the diff
      // (sign vs reject) immediately visible to a reader.
      await jumperPage.goto('/profile');
      const profilePage = new ProfilePage(jumperPage);

      await profilePage.expectVisible();
      await profilePage.openPerksTab();
      await profilePage.expectPerksCards();
      // jscpd:ignore-end

      let claimEndpointHit = false;
      jumperPage.on('request', (request) => {
        if (
          /\/v1\/perks\/claim$/.test(new URL(request.url()).pathname) &&
          request.method() === 'POST'
        ) {
          claimEndpointHit = true;
        }
      });

      await profilePage.clickFirstPerkClaim();
      await wallet.rejectPopup(wallet.getContext());

      // Give the UI a beat to settle before asserting absence (claim endpoint
      // not hit) — without this, we'd race the rejection handler. Web-first
      // assertions don't help here: we're verifying *no* state change.
      // eslint-disable-next-line playwright/no-wait-for-timeout -- intentional settle for absence assertion
      await jumperPage.waitForTimeout(2000);
      await profilePage.expectPerkClaimErrorOrIdle();
      expect(claimEndpointHit).toBe(false);
    },
  );
});
