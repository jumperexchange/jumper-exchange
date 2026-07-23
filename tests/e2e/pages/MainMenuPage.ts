import { expect } from '@playwright/test';

import type { BrowserContext, Locator, Page } from '@playwright/test';

export enum Theme {
  Dark = 'Dark',
  Light = 'Light',
}

export class MainMenuPage {
  readonly backgroundRoot: Locator;
  readonly burgerButton: Locator;
  readonly headerExchangeTab: Locator;
  readonly headerMissionTab: Locator;
  readonly leaderboardButton: Locator;
  readonly menu: Locator;
  readonly menuItems: Locator;

  constructor(private readonly page: Page) {
    this.burgerButton = page.locator('#main-burger-menu-button');
    this.menu = page.getByRole('menu');
    this.menuItems = page.getByRole('menuitem');
    this.leaderboardButton = page.getByTestId('leaderboard-button');
    this.headerMissionTab = page.getByTestId('navbar-missions-button');
    this.headerExchangeTab = page.getByTestId('navbar-exchange-button');
    this.backgroundRoot = page.locator('#background-root');
  }

  async clickMenuItem(option: string): Promise<void> {
    await this.page.getByRole('menuitem', { name: option }).click();
  }

  async expectBackgroundColor(rgb: string): Promise<void> {
    await expect(this.backgroundRoot).toHaveCSS('background-color', rgb);
  }

  async expectHeaderTabs(): Promise<void> {
    await expect(this.headerMissionTab).toBeVisible();
    await expect(this.headerExchangeTab).toBeVisible();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.menuItems).toHaveCount(count);
  }

  async expectSocialIcons(networks: string[]): Promise<void> {
    for (const network of networks) {
      await expect(
        this.page.getByRole('button', { name: `Share article on ${network}` }),
      ).toBeEnabled();
    }
  }

  // Partner themes are Strapi-driven; static menu items are 'Dark'/'Light'/'System'.
  async findPartnerTheme(): Promise<null | string> {
    const allMenuItems = await this.menuItems.allTextContents();
    const partnerTheme = allMenuItems.find(
      (item) =>
        !['Dark', 'Light', 'System'].includes(item) && item.trim() !== '',
    );
    return partnerTheme ?? null;
  }

  async open(): Promise<void> {
    await this.burgerButton.click();
    await expect(this.menu).toBeVisible();
  }

  async openLeaderboard(): Promise<void> {
    await this.leaderboardButton.click();
  }

  // Promise.all so the page-event listener attaches BEFORE the click fires.
  async openNewTabAndExpectUrl(
    context: BrowserContext,
    url: string,
    trigger: () => Promise<void>,
  ): Promise<void> {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      trigger(),
    ]);
    try {
      // Don't block on the external tab finishing load — t.me / x.com / discord etc. are slow or
      // unreachable from CI, which hung the Telegram case for the whole test timeout. Wait briefly,
      // then assert the URL Jumper opened (toHaveURL polls page.url(), set on navigation). JUM-1116.
      await newPage
        .waitForLoadState('domcontentloaded', { timeout: 5_000 })
        .catch(() => {});
      await expect(newPage).toHaveURL(url);
    } finally {
      // Close the popup explicitly so its in-flight requests don't keep
      // running and pressuring the next test's network/CPU budget.
      await newPage.close();
    }
  }

  async switchTheme(theme: Theme): Promise<void> {
    await this.clickMenuItem('Theme');
    await this.clickMenuItem(theme);
    await this.closeOnMobileViewport();
  }

  async toggle(): Promise<void> {
    await this.burgerButton.click();
  }

  // Drawer overlay only intercepts within its bbox; click 20px above the top edge to dismiss.
  private async closeOnMobileViewport(): Promise<void> {
    const box = await this.menu.boundingBox();
    if (box) {
      await this.page.mouse.click(box.width / 2, box.y - 20);
    }
  }
}
