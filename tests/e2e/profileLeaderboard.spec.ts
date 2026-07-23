import { expect } from '@playwright/test';

import { connectedTest as test } from './fixtures/connectedWallet';
import { MainMenuPage } from './pages/MainMenuPage';
import { ProfilePage } from './pages/ProfilePage';

test.describe('Profile and Leaderboard navigation with wallet', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await new MainMenuPage(jumperPage).open();
  });

  test('Should open the Jumper Profile page and then open the leaderboard page', async ({
    jumperPage,
  }) => {
    const mainMenu = new MainMenuPage(jumperPage);
    const profilePage = new ProfilePage(jumperPage);
    const leaderboardPageTitle = jumperPage.getByText('Leaderboard', {
      exact: true,
    });
    await profilePage.clickPassPrompt();
    await mainMenu.openLeaderboard();
    await expect(leaderboardPageTitle).toBeVisible();
  });
});
