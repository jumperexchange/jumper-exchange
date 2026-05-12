import { qase } from 'playwright-qase-reporter';

import { expect, connectedTest as test } from './fixtures';
import { ProfilePage } from './pages';

// Negative-path counterpart to walletSignPerkClaim — rejection must not POST claim or stick the UI.
test.describe('Perk claim — reject signature', () => {
  // Blocked on funded QA wallet — sister spec to walletSignPerkClaim; same prerequisite.
  test.fixme(
    qase(201, 'Reject the perk claim signature'),
    async ({ jumperPage, wallet }) => {
      // jscpd:ignore-start — sister spec to walletSignPerkClaim; diff (sign vs reject) is the point.
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

      // Settle for the absence assertion; web-first can't help (verifying *no* state change).
      // eslint-disable-next-line playwright/no-wait-for-timeout -- intentional settle for absence assertion
      await jumperPage.waitForTimeout(2000);
      await profilePage.expectPerkClaimErrorOrIdle();
      expect(claimEndpointHit).toBe(false);
    },
  );
});
