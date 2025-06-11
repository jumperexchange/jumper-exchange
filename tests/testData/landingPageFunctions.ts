import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getElementByText } from './commonFunctions';

export const LANDING_PAGE = {
  GET_STARTED_BUTTON: '#get-started-button',
};

export async function findTheBestRoute(page) {
  await page.getByRole('heading', { name: 'Find the best route' });
}

export async function closeWelcomeScreen(page: Page) {
  return page.locator(LANDING_PAGE.GET_STARTED_BUTTON).click();
}
export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click();
}

export async function tabInHeader(page, tabname1: string, tabname2: string) {
  const gasTab = await page.locator('#tab-key-1');
  const exchangeTab = await page.locator('#tab-key-0');
  await gasTab.click();
  await expect(page.locator(`xpath=//p[text()="${tabname1}"]`)).toBeVisible();
  await exchangeTab.click();
  await expect(page.locator(`xpath=//p[text()=${tabname2}]`)).toBeVisible();
}

export async function checkRoutesVisibility(
  page: Page,
  options: {
    bestReturnShouldBeVisible: boolean;
    checkRelayRoute?: boolean;
  },
) {
  const { bestReturnShouldBeVisible, checkRelayRoute } = options;

  if (bestReturnShouldBeVisible) {
    const bestReturnLabel = await getElementByText(page, 'Best Return');
    await expect(bestReturnLabel).toBeVisible();

    if (checkRelayRoute) {
      const viewportWidth = page.viewportSize()?.width;
      if (viewportWidth !== undefined && viewportWidth < 599) {
        await page
          .locator('button.MuiIconButton-root.MuiIconButton-sizeSmall:has(svg)')
          .click();
      }
      const relayLabel = await getElementByText(page, 'Relay via LI.FI');
      await expect(relayLabel).toBeVisible();
    }
  } else {
    const noRoutesLabel = await getElementByText(page, 'No routes available');
    await expect(noRoutesLabel).toBeVisible();
  }
}

export async function navigateToTab(page, tabKey, expectedText) {
  await page.locator(`#tab-key-${tabKey}`).click();
  await expect(
    page.locator(`xpath=//p[text()="${expectedText}"]`),
  ).toBeVisible();
}

export function buildUlParams(data: {
  amount: string;
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
}): string {
  const params = new URLSearchParams({
    fromAmount: data.amount,
    fromChain: data.fromChain,
    fromToken: data.fromToken,
    toChain: data.toChain,
    toToken: data.toToken,
  });
  return `?${params.toString()}`;
}
