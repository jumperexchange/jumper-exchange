import { expect, test } from '@playwright/test';
import {
  checkSocialNetworkIcons,
  checkTheNumberOfMenuItems,
  expectBackgroundColorToHaveCss,
  openOrCloseMainMenu,
  openLeaderboardPage,
  sectionOnTheBlogPage,
} from './testData/menuFunctions';
import {
  getElementByText,
  triggerButtonClick,
} from './testData/commonFunctions';
import values from '../tests/testData/values.json' assert { type: 'json' };
import {
  closeWelcomeScreen,
  itemInMenu,
  itemInNavigation,
} from './testData/landingPageFunctions';

test.describe('Main Menu flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('Should be able to open menu and close it', async ({ page }) => {
    openOrCloseMainMenu(page);
    await checkTheNumberOfMenuItems(page, 6);
    await page.locator('body').click();
    await expect(page.getByRole('menu')).not.toBeVisible();
  });

  test.skip('Should be able to navigate to profile and open first Mission', async ({
    page,
  }) => {
    const profileUrl = `${await page.url()}profile`;
    const missionTitle = page.locator(
      'xpath=//div[@class="MuiBox-root mui-9cpca"]',
    );
    await triggerButtonClick(page, 'Level');
    expect(await page.url()).toBe(profileUrl);
    await page.locator('.profile-page').isVisible();
    await page
      .locator('xpath=(//div[@class="MuiBox-root mui-1t1c9pj"])[1]')
      .click();

    await expect(missionTitle).toBeVisible();
  });

  test.skip('Should open the Jumper Profile page and then open the leaderboard page', async ({
    page,
  }) => {
    const whereDoYouRank = await getElementByText(page, 'Where do you rank?');
    const completedMissions = await getElementByText(
      page,
      'Completed Missions',
    );
    const connectWalletButtonOnLeaderboardPage = await page.locator(
      '#leaderboard-entry-connect-button',
    );
    await triggerButtonClick(page, 'Level');
    await page.locator('.profile-page').isVisible();
    await expect(completedMissions).not.toHaveCSS('cursor', 'pointer');
    await openLeaderboardPage(page);
    await expect(whereDoYouRank).toBeVisible();
    await expect(connectWalletButtonOnLeaderboardPage).toBeVisible();
  });

  test('Should be able to navigate to the Jumper Learn', async ({ page }) => {
    const sectionName = [
      'Announcements',
      'Partnerships',
      'Tutorial',
      'Knowledge',
    ];
    const socialNetworks = ['LinkedIn', 'Facebook', 'X'];
    const blogArticle = await page.locator(
      'xpath=(//div[@class="MuiCardContent-root mui-6l9nau-MuiCardContent-root"])[1]',
    );
    const articleTitle = await page.locator(
      'xpath=(//h1[contains(@class,"MuiTypography-root MuiTypography-h1")])[1]',
    );

    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Learn');
    await expect(page).toHaveURL(values.localLearnURL);
    await page.waitForLoadState('load');
    await page.locator('.learn-page').isVisible();
    sectionOnTheBlogPage(page, sectionName);
    await blogArticle.click();
    await page.waitForLoadState('load');
    await expect(articleTitle).toBeVisible();
    checkSocialNetworkIcons(page, socialNetworks);
  });

  test('Should be able to navigate to LI.FI Scan', async ({ page }) => {
    const searchBar = await page.locator(
      'xpath=//div[@class="MuiBox-root mui-1nhlr6a"]',
    );
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Scan');
    await expect(page).toHaveURL(values.localJumperScanURL);
    await expect(searchBar).toBeVisible();
  });

  test('Should open Resources section inside menu', async ({ page }) => {
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Resources');
    await checkTheNumberOfMenuItems(page, 2);
  });

  test('Should open Language section inside menu', async ({ page }) => {
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Language');
    await checkTheNumberOfMenuItems(page, 14);
  });

  test.skip('Should be able to open quests mission page and switch background color', async ({
    page,
  }) => {
    const jumperProfileBackButton = await getElementByText(page, 'Missions');

    await page.goto(values.aerodromeQuestsURL);
    expect(jumperProfileBackButton).toBeVisible();
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Theme');
    await itemInMenu(page, 'Light');
    await itemInMenu(page, 'Dark');
    expectBackgroundColorToHaveCss(page, 'rgb(18, 15, 41)');
    await itemInMenu(page, 'Light');
    await openOrCloseMainMenu(page);
    expectBackgroundColorToHaveCss(page, 'rgb(243, 235, 255)');
  });

  test('Should be able to navigate to X', async ({ page, context }) => {
    await openOrCloseMainMenu(page);
    await itemInNavigation(page, 'X social link');
    const newPage = await context.waitForEvent('page');
    expect(newPage.url()).toBe(values.xUrl);
  });

  test('Should be able to navigate to Discord', async ({ page, context }) => {
    await openOrCloseMainMenu(page);
    await itemInNavigation(page, 'Discord social link');
    const newPage = await context.waitForEvent('page');
    expect(newPage.url()).toBe(values.discordURL);
  });

  test('Should be able to navigate to Telegram', async ({ page, context }) => {
    await openOrCloseMainMenu(page);
    await itemInNavigation(page, 'Telegram social link');
    const newPage = await context.waitForEvent('page');
    expect(newPage.url()).toBe(values.telegramURL);
  });

  test('Should be able to navigate to Link3', async ({ page, context }) => {
    await openOrCloseMainMenu(page);
    await itemInNavigation(page, 'Link3 social link');
    const newPage = await context.waitForEvent('page');
    expect(newPage.url()).toBe(values.link3URL);
  });

  test('Should be able to click on the Support button', async ({ page }) => {
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Support');
    const iFrameLocator = page.frameLocator(
      'iframe[title="Discord chat embed"]',
    );
    const openDiscordAppInIframe =
      await iFrameLocator.getByText('Open Discord App');
    await expect(openDiscordAppInIframe).toBeVisible();
  });
});
