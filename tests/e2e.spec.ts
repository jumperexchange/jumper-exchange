import { expect, test } from '@playwright/test';
import values from '../tests/testData/values.json';
import {
  closeWelcomeScreen,
  expectBackgroundColorToHaveCss,
  expectMenuToBeVisible,
  itemInMenu,
  itemInSettingsMenu,
  itemInSettingsMenuToBeVisible,
  openMainMenu,
  tabInHeader,
  sectionOnTheBlogPage,
  checkSocialNetworkIcons,
} from './testData/commonFunctions';

test.describe('Jumper full e2e flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('Should navigate to the homepage and change tabs', async ({ page }) => {
    const buyETHButton = page
      .frameLocator('iframe[title="Onramper widget"]')
      .locator('button:has-text("Buy ETH")');

    const featureCard = page.locator(
      'xpath=//div[@class="MuiBox-root mui-1393eub"]',
    );
    await tabInHeader(page, 'Exchange');
    await expect(
      page.locator('[id="widget-header-\\:r0\\:"]').getByText('Exchange'),
    ).toBeVisible();
    await tabInHeader(page, 'Gas');
    await expect(page.locator('#navbar-tabs-1')).toBeVisible();
    await tabInHeader(page, 'Buy');
    await expect(buyETHButton).toBeEnabled();
    await expect(
      page
        .frameLocator('iframe[title="Onramper widget"]')
        .getByText('Buy crypto'),
    ).toBeVisible();
    await expect(featureCard).toBeVisible();
  });
  test('Should open Settings menu', async ({ page }) => {
    const settingsTitle = page.locator(
      'xpath=//p[normalize-space(text())="Settings"]',
    );
    const bestReturnButton = page.locator(
      'xpath=//button[normalize-space(text())="Best Return"]',
    );
    const fastestButton = page.locator(
      'xpath=//button[normalize-space(text())="Fastest"]',
    );
    const slowGasPrice = page.locator(
      'xpath=//button[normalize-space(text())="Slow"]',
    );
    const fastGasPrice = page.locator(
      'xpath=//button[normalize-space(text())="Fast"]',
    );
    const customSlippage = page.locator('xpath=//input[@placeholder="Custom"]');
    await tabInHeader(page, 'Exchange');
    await page.locator('xpath=//div[@class="MuiBox-root mui-afg6ra"]').click();
    await expect(settingsTitle).toBeVisible();
    itemInSettingsMenu(page, 'Route priority');
    await expect(bestReturnButton).toBeEnabled();
    itemInSettingsMenuToBeVisible(page, 'Fastest');
    await fastestButton.click();
    itemInSettingsMenuToBeVisible(page, 'Reset settings');
    itemInSettingsMenu(page, 'Gas price');
    expect(slowGasPrice).toBeEnabled();
    expect(fastGasPrice).toBeEnabled();
    itemInSettingsMenu(page, 'Max. slippage');
    itemInSettingsMenuToBeVisible(page, '0.5');
    await expect(customSlippage).toBeVisible();
  });

  test('Should show again welcome screen when clicking jumper logo', async ({
    page,
  }) => {
    const headerText = 'Find the best route';
    await page.locator('#jumper-logo').click();
    await page.locator('#get-started-button').click();
    expect(headerText).toBe('Find the best route');
  });

  test('Should be able to open menu and click away to close it', async ({
    page,
  }) => {
    await openMainMenu(page);
    await expectMenuToBeVisible(page);
    await expect(page.getByRole('menuitem')).toHaveCount(9);
    await page.locator('body').click();
    await expect(page.getByRole('menu')).not.toBeVisible();
  });

  test('Should be able to navigate to profile and open Explore WoodSwap Mission', async ({
    page,
  }) => {
    let profileUrl = `${await page.url()}profile`;
    const whatIsWoodSwapTitle = page.locator(
      'xpath=//p[normalize-space(text())="Explore WoodSwap"]',
    );
    await openMainMenu(page);
    await expectMenuToBeVisible(page);
    await itemInMenu(page, 'Jumper Profile');
    expect(await page.url()).toBe(profileUrl);
    await page.locator('.profile-page').isVisible();
    await page
      .locator('xpath=//p[normalize-space(text())="Explore WoodSwap"]')
      .click();

    await expect(whatIsWoodSwapTitle).toBeInViewport({ timeout: 15000 });
  });

  test('Should be able to navigate to the Jumper Learn', async ({ page }) => {
    const sectionName = [
      'Announcement',
      'Partner',
      'Bridge',
      'Swap',
      'Tutorial',
      'Knowledge',
    ];
    const socialNetworks = ['LinkedIn', 'Facebook', 'X'];
    const jumperIsLiveOnSolanaArticlet = await page.locator(
      'xpath=//h2[normalize-space(text())="Jumper is Live on Solana!"]',
    );
    const articleTitle = await page.locator(
      'xpath=//h2[normalize-space(text())="The most awaited release is here, Jumper is live on Solana!"]',
    );
    let learnUrl = `${await page.url()}learn`;
    await openMainMenu(page);
    await expectMenuToBeVisible(page);
    await itemInMenu(page, 'Jumper Learn');
    expect(await page.url()).toBe(learnUrl);
    await page.waitForLoadState('load');
    await page.locator('.learn-page').isVisible();
    sectionOnTheBlogPage(page, sectionName);
    await jumperIsLiveOnSolanaArticlet.click();
    await page.waitForLoadState('load');
    await expect(articleTitle).toBeVisible();
    checkSocialNetworkIcons(page, socialNetworks);
  });

  test('Should be able to navigate to LI.FI Scan', async ({ page }) => {
    await openMainMenu(page);
    await expectMenuToBeVisible(page);
    await itemInMenu(page, 'Jumper Scan');
    // const newPage = await page.waitForEvent('popup', { timeout: 15000 });
    expect(page).toHaveURL(values.localJumperScanURL);
  });

  test.skip('Should be able to navigate to Supefest', async ({ page }) => {
    const learnMoreButton = page.locator('#learn-more-button');
    await openMainMenu(page);
    await itemInMenu(page, 'Superfest Festival');
    await expect(learnMoreButton).toBeVisible();
    await expect(page).toHaveURL(values.localSuperfestURL);
  });

  test('Should be able to open quests mission page and switch background color', async ({
    page,
  }) => {
    const jumperProfileBackButton = await page.locator(
      'xpath=//p[normalize-space(text())="JUMPER PROFILE"]',
    );
    await page.goto(values.aerodromeQuestsURL);
    expect(jumperProfileBackButton).toBeVisible();
    await openMainMenu(page);
    await page.locator('#theme-switch-tabs-1').click(); //switch to Dark theme
    expectBackgroundColorToHaveCss(page, 'rgb(18, 15, 41)');
    await page.locator('#theme-switch-tabs-0').click(); //switch to Light theme
    await openMainMenu(page);
    expectBackgroundColorToHaveCss(page, 'rgb(243, 235, 255)');
  });

  test('Should be able to navigate to X', async ({ page, context }) => {
    await openMainMenu(page);
    await expectMenuToBeVisible(page);
    await page.getByRole('link', { name: 'X', exact: true }).click();
    const newPage = await context.waitForEvent('page');
    expect(newPage.url()).toBe(values.xUrl);
  });

  test('Should be able to navigate to Discord', async ({ page, context }) => {
    await openMainMenu(page);
    await expectMenuToBeVisible(page);
    await page.getByRole('link', { name: 'Discord' }).click();
    const newPage = await context.waitForEvent('page');
    expect(newPage.url()).toBe(values.discordURL);
  });

  test('API test - Feature Cards', async ({ request }) => {
    const apiURL = 'https://strapi.jumper.exchange/api/feature-cards';
    const bearerToken =
      'Bearer 31ed0fb5f4147b9e367f98933b49e9fc6a00553cf5d29b6521617aa1503024a6708066c402ba5b9d86189760e5bf0f5d04983b5c1c03e2fc45ec0355ed20aeea19b5e936527cbfce0a9a5026d62035f991d1c6e4805a45d38765fa83eb05c16f455216713c47380d2b7dc29321792febab12892a89701eb9dba2ce5d191d8b30';
    const response = await request.get(apiURL, {
      headers: {
        Authorization: bearerToken,
      },
      params: {
        'populate[BackgroundImageLight]': '*',
        'populate[BackgroundImageDark]': '*',
        'populate[featureCardsExclusions][fields][0]': 'uid',
        'filters[PersonalizedFeatureCard][%24nei]': 'false',
        'filters[minlevel][%24lte]': '4',
        'filters[maxLevel][%24gte]': '4',
      },
    });
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('meta');
    expect(responseBody.meta).toHaveProperty('pagination');
    expect(responseBody.meta.pagination).toMatchObject({
      pageSize: 25,
    });
  });
});
