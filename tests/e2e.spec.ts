import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';

function closeWelcomeScreen(page: Page) {
  return page.locator('.widget-wrapper').first().click();
}

test('should navigate to the homepage and change tabs', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.getByRole('tab', { name: 'Exchange' }).click();
  await expect(
    page.locator('[id="widget-header-\\:r0\\:"]').getByText('Exchange'),
  ).toBeVisible();
  await page.getByRole('tab', { name: 'Gas' }).click();
  await expect(
    page.locator('[id="widget-header-\\:r4\\:"]').getByText('Gas'),
  ).toBeVisible();
  await page.getByRole('tab', { name: 'Buy' }).click();
  await expect(
    page
      .frameLocator('iframe[title="Onramper widget"]')
      .getByText('Buy crypto')
      .getByText('Buy crypto'),
  ).toBeVisible();
});

test('should handle welcome screen', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  page.getByRole('heading', { name: 'Find the best route' });
  await page.locator('.widget-wrapper').first().click();
  await expect(
    page.getByRole('heading', { name: 'Find the best route' }),
  ).not.toBeVisible();
});

test('should show again welcome screen when clicking jumper logo', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/');
  page.getByRole('heading', { name: 'Find the best route' });
  await page.locator('.widget-wrapper').first().click();
  await expect(
    page.getByRole('heading', { name: 'Find the best route' }),
  ).not.toBeVisible();
  await page.locator('#jumper-logo').click();
  await expect(
    page.getByRole('heading', { name: 'Find the best route' }),
  ).toBeVisible();
});

test('should be able to open menu and click away to close it', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.locator('body').click();
  await expect(page.getByRole('menu')).not.toBeVisible();
});

test('should be able to navigate to profile', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Jumper Profile' }).click();
  await page.waitForLoadState('networkidle');

  expect(page.url()).toBe('http://localhost:3000/profile/');
  await page.waitForLoadState('load');
  await page.locator('.profile-page').isVisible();
});

test('should be able to navigate to jumper learn', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Jumper Learn' }).click();
  await page.waitForLoadState('networkidle');

  expect(page.url()).toBe('http://localhost:3000/learn/');
  await page.waitForLoadState('load');
  await page.locator('.learn-page').isVisible();
});

test('should be able to navigate to lifi explorer', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'LI.FI Explorer' }).click();
  const newPage = await page.waitForEvent('popup');
  expect(newPage.url()).toBe(
    'https://explorer.li.fi/?utm_source=jumper&utm_campaign=jumper_to_explorer&utm_medium=menu',
  );
});

test('should be able to navigate to X', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'X', exact: true }).click();
  const newPage = await page.waitForEvent('popup');
  expect(newPage.url()).toBe('https://x.com/JumperExchange');
});
test('should be able to navigate to Discord', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await closeWelcomeScreen(page);

  await page.locator('#main-burger-menu-button').click();
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Discord' }).click();
  const newPage = await page.waitForEvent('popup');
  expect(newPage.url()).toBe('https://discord.com/invite/lifi');
});
