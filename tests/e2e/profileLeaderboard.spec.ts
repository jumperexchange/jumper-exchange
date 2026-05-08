import { qase } from 'playwright-qase-reporter';

import { JUMPER_BUTTONS } from './data';
import { expect, connectedTest as test } from './fixtures';
import { MainMenuPage } from './pages';

test.describe('Profile and Leaderboard navigation with wallet', () => {
  test.beforeEach(async ({ jumperPage }) => {
    await new MainMenuPage(jumperPage).open();
  });

  test(
    qase(
      10,
      'Should open the Jumper Profile page and then open the leaderboard page',
    ),
    async ({ jumperPage }) => {
      const mainMenu = new MainMenuPage(jumperPage);
      const leaderboardPageTitle = jumperPage.getByText('Leaderboard', {
        exact: true,
      });
      await jumperPage
        .getByRole('button', { name: JUMPER_BUTTONS.PASS })
        .click();
      await mainMenu.openLeaderboard();
      await expect(leaderboardPageTitle).toBeVisible();
    },
  );
});
