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

  // Partner themes are Strapi-driven and absent on local/CI baseline. The
  // theme menu always contains 'Dark', 'Light', 'System'; anything else is
  // a partner theme. Returns null when no partner theme is configured.
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

  // Wrap the page-event listener and the trigger click in Promise.all so the
  // listener is registered BEFORE the click can fire — otherwise a fast popup
  // can open before waitForEvent attaches and the helper hangs.
  async openNewTabAndExpectUrl(
    context: BrowserContext,
    url: string,
    trigger: () => Promise<void>,
  ): Promise<void> {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      trigger(),
    ]);
    expect(newPage.url()).toBe(url);
  }

  async switchTheme(theme: Theme): Promise<void> {
    await this.clickMenuItem('Theme');
    await this.clickMenuItem(theme);
    await this.closeOnMobileViewport();
  }

  async toggle(): Promise<void> {
    await this.burgerButton.click();
  }

  // Drawer overlay only intercepts clicks within its bounding box; click 20px
  // above the top edge to dismiss.
  private async closeOnMobileViewport(): Promise<void> {
    const box = await this.menu.boundingBox();
    if (box) {
      await this.page.mouse.click(box.width / 2, box.y - 20);
    }
  }
}
