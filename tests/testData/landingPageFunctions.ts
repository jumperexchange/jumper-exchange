import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getElementByText } from './commonFunctions';
/** Time for MUI Slide exit animation in WelcomeOverlayLayout (slideTimeout) */
const WELCOME_SLIDE_TIMEOUT_MS = 2000;
/** Extra time for slow CI: wait for button to appear and for overlay to close */
const WELCOME_VISIBLE_TIMEOUT_MS = 30_000;
const WELCOME_CLOSE_TIMEOUT_MS = WELCOME_SLIDE_TIMEOUT_MS + 15_000;

/** Selector for the welcome overlay container (overlayClassName in App.tsx) */
const WELCOME_OVERLAY_SELECTOR = '.welcome-screen-container';

export async function closeWelcomeScreen(page: Page) {
  const getStartedButton = page.getByTestId('get-started-button');
  await expect(getStartedButton).toBeVisible({
    timeout: WELCOME_VISIBLE_TIMEOUT_MS,
  });
  await getStartedButton.scrollIntoViewIfNeeded();
  await getStartedButton.click();
  await expect(page.locator(WELCOME_OVERLAY_SELECTOR)).not.toBeVisible({
    timeout: WELCOME_CLOSE_TIMEOUT_MS,
  });
}
export async function itemInMenu(page, option: string) {
  await page.getByRole('menuitem', { name: option }).click();
}

export async function itemInNavigation(page, option: string) {
  await page.getByRole('link', { name: option }).click();
}

export async function clickOnJumperLogo(page: Page) {
  await page.locator('#jumper-logo').click();
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
    const bestReturnLabel = page.getByText('Best Return').first(); //added first() to handle cases where multiple "Best Return" labels exist - LF-16508
    await expect(bestReturnLabel).toBeVisible();

    if (checkRelayRoute) {
      const viewportWidth = page.viewportSize()?.width;
      if (viewportWidth !== undefined && viewportWidth < 599) {
        await page
          .locator('button.MuiIconButton-root.MuiIconButton-sizeSmall:has(svg)')
          .click();
      }
      const relayLabel = page
        .getByText('Relay via LI.FI')
        .filter({ visible: true })
        .first()
        .or(page.getByAltText('Relay').filter({ visible: true }).first());
      await expect(relayLabel).toBeVisible();
    }
  } else {
    const noRoutesLabel = await getElementByText(page, 'No routes available');
    await expect(noRoutesLabel).toBeVisible();
  }
}

export async function navigateToTab(page, tabKey, expectedText) {
  await page.waitForLoadState('domcontentloaded');
  await page.getByTestId(`tab-key-${tabKey}`).click();
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
