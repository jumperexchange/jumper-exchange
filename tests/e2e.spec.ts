import { expect, test } from '@playwright/test';
import values from '../tests/testData/values.json' assert { type: 'json' };
import {
  closeWelcomeScreen,
} from './testData/commonFunctions';

test.describe('Jumper full e2e flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await closeWelcomeScreen(page);
  });

  test('Should navigate to the homepage and change tabs', async ({ page }) => {
    await page.locator('#tab-key-1').click();
    await expect(page.locator('xpath=//p[text()="Gas"]')).toBeVisible();
    await page.locator('#tab-key-0').click();
    await expect(page.locator('xpath=//p[text()="Exchange"]')).toBeVisible();
  });

  test('Should show again welcome screen when clicking jumper logo', async ({
    page,
  }) => {
    const headerText = 'Find the best route';
    await page.locator('#jumper-logo').click();
    await page.locator('#get-started-button').click();
    expect(headerText).toBe('Find the best route');
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
