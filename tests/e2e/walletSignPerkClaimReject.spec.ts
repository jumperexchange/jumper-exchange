import { expect } from '@playwright/test';

import { connectedTest as test } from './fixtures/connectedWallet';
import { ProfilePage } from './pages/ProfilePage';

import type { Request } from '@playwright/test';

// Negative-path counterpart to walletSignPerkClaim — rejection must not POST claim or stick the UI.
test.describe('Perk claim — reject signature', () => {
  // Blocked on funded QA wallet — sister spec to walletSignPerkClaim; same prerequisite.
  test.fixme('Reject the perk claim signature', async ({
    jumperPage,
    wallet,
  }) => {
    // jscpd:ignore-start — sister spec to walletSignPerkClaim; diff (sign vs reject) is the point.
    await jumperPage.goto('/profile');
    const profilePage = new ProfilePage(jumperPage);

    await profilePage.expectVisible();
    await profilePage.openPerksTab();
    await profilePage.expectPerksCards();
    // jscpd:ignore-end

    let claimEndpointHit = false;
    const onRequest = (request: Request): void => {
      /* eslint-disable playwright/no-conditional-in-test -- listener filter, not a test assertion */
      if (
        new URL(request.url()).pathname.endsWith('/v1/perks/claim') &&
        request.method() === 'POST'
      ) {
        claimEndpointHit = true;
      }
      /* eslint-enable playwright/no-conditional-in-test */
    };
    jumperPage.on('request', onRequest);

    await profilePage.clickFirstPerkClaim();
    await wallet.rejectPopup(wallet.getContext());

    // Settle for the absence assertion; web-first can't help (verifying *no* state change).
    // eslint-disable-next-line playwright/no-wait-for-timeout -- intentional settle for absence assertion
    await jumperPage.waitForTimeout(2000);
    await profilePage.expectPerkClaimErrorOrIdle();
    expect(claimEndpointHit).toBe(false);
    jumperPage.off('request', onRequest);
  });
});
