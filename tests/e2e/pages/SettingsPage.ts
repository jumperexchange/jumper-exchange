import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

interface ItemAssertion {
  enabled?: boolean;
  invisible?: boolean;
  visible?: boolean;
}

const escapeForRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class SettingsPage {
  readonly backArrowButton: Locator;
  readonly badgeInfo: Locator;
  readonly badgeWarning: Locator;
  readonly bridgesList: Locator;
  readonly bridgesListFirstCheckbox: Locator;
  readonly bridgesListFirstItem: Locator;
  readonly deselectAllButton: Locator;
  readonly selectAllButton: Locator;
  readonly settingsButton: Locator;
  readonly slippageInput: Locator;

  constructor(private readonly page: Page) {
    this.settingsButton = page.getByRole('button', { name: 'Settings' });
    this.slippageInput = page.getByPlaceholder('0.5');
    this.bridgesList = page.getByTestId('bridges-list');
    this.bridgesListFirstItem = this.bridgesList.getByRole('button').first();
    // MUI v9 dropped auto-testids on icon SVGs; anchor on the row's checkbox role.
    this.bridgesListFirstCheckbox = this.bridgesListFirstItem
      .getByRole('checkbox')
      .first();
    // TODO(app): JUM-924 — swap to `widget-back-button` at the widget bump.
    this.backArrowButton = page
      .locator('button.MuiIconButton-edgeStart')
      .first();
    this.deselectAllButton = page.getByLabel('Deselect all');
    this.selectAllButton = page.locator('#select-all');
    // TODO(app): JUM-924 — swap to `widget-*-badge-{info,warning}` at the widget bump.
    this.badgeInfo = page.locator('span.MuiBadge-badge.MuiBadge-colorInfo');
    this.badgeWarning = page.locator(
      'span.MuiBadge-badge.MuiBadge-colorWarning',
    );
  }

  async clickItem(label: string): Promise<void> {
    await this.page.getByText(label, { exact: true }).click();
  }

  async clickListOption(title: string): Promise<void> {
    await this.listOption(title).click();
  }

  async clickReset(label: string): Promise<void> {
    await this.clickItem(label);
  }

  async confirmReset(confirmButtonLabel: string): Promise<void> {
    await this.page.getByRole('button', { name: confirmButtonLabel }).click();
  }

  async deselectAll(): Promise<void> {
    await this.deselectAllButton.click();
  }

  async deselectFirstBridge(): Promise<void> {
    await this.bridgesListFirstCheckbox.click();
  }

  async expectDeselectedAmount(
    category: string,
    deselectedAmount: number,
  ): Promise<void> {
    const { denominator, numerator } = await this.readFraction(category);
    expect(numerator).toBe(denominator - deselectedAmount);
  }

  async expectFractionsEqual(category: string): Promise<void> {
    await this.expectDeselectedAmount(category, 0);
  }

  async expectInfoBadgeVisible(): Promise<void> {
    await expect(this.badgeInfo).toBeVisible();
  }

  async expectItem(label: string, options: ItemAssertion = {}): Promise<void> {
    await this.expectByElementType(label, 'button', options);
  }

  async expectListOptionSelected(title: string): Promise<void> {
    // The selected drill-down row renders the check icon as its only svg
    // (MUI v9 icons carry no testid).
    await expect(this.listOption(title).locator('svg')).toBeVisible();
  }

  async expectListOptionVisible(title: string): Promise<void> {
    await expect(this.listOption(title)).toBeVisible();
  }

  async expectNoneSelected(category: string): Promise<void> {
    const { numerator } = await this.readFraction(category);
    expect(numerator).toBe(0);
  }

  async expectSetting(
    label: string,
    options: ItemAssertion = {},
  ): Promise<void> {
    await this.expectByElementType(label, 'p', options);
  }

  async expectSlippageWarning(message: string): Promise<void> {
    // MUI v9 dropped the icon testid; the message text is visible alongside it.
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectWarningBadgeVisible(): Promise<void> {
    await expect(this.badgeWarning).toBeVisible();
  }

  async fillSlippage(value: string): Promise<void> {
    await this.slippageInput.fill(value);
  }

  async getFirstBridgeName(): Promise<string> {
    return (await this.bridgesListFirstItem.textContent()) ?? '';
  }

  async goBack(): Promise<void> {
    await this.backArrowButton.click();
  }

  async open(title: string): Promise<void> {
    await this.settingsButton.click();
    await this.page.getByText(title).waitFor({ state: 'visible' });
  }

  async selectAll(): Promise<void> {
    await this.selectAllButton.click();
  }

  async selectBridgeByName(name: string): Promise<void> {
    await this.page.getByText(name).click();
  }

  private async expectByElementType(
    label: string,
    elementType: 'button' | 'p',
    options: ItemAssertion,
  ): Promise<void> {
    // TODO(app): JUM-924 — swap to `widget-*-value` / `widget-*-option-*` ids at the widget bump.
    const item = this.page.locator(
      `xpath=//${elementType}[normalize-space(text())="${label}"]`,
    );
    if (options.visible) {
      await expect(item).toBeVisible();
    }
    if (options.enabled) {
      await expect(item).toBeEnabled();
    }
    if (options.invisible) {
      await expect(item).toBeHidden();
    }
  }

  private fractionLocator(category: string): Locator {
    // TODO(app): JUM-924 — swap to `widget-{bridges,exchanges}-value` at the widget bump.
    return this.page
      .getByText(category)
      .locator('..')
      .locator('..')
      .locator('xpath=.//*[contains(text(), "/")]');
  }

  // Drill-down option rows are ListItemButton divs with role="button"; the
  // accessible name starts with the row title (secondary description text is
  // appended for some rows).
  private listOption(title: string): Locator {
    return this.page.getByRole('button', {
      name: new RegExp(`^${escapeForRegex(title)}`),
    });
  }

  private async readFraction(
    category: string,
  ): Promise<{ denominator: number; numerator: number }> {
    // Poll until the fraction text settles to `N/M`. After `goBack()`, the
    // settings drawer animates and may flash empty/stale text.
    const locator = this.fractionLocator(category);
    await expect(locator).toHaveText(/^\s*\d+\/\d+\s*$/);
    const text = (await locator.textContent()) ?? '';
    const [num, den] = text.split('/');
    const numerator = Number(num);
    const denominator = Number(den);
    if (denominator === 0) {
      throw new Error('Denominator cannot be 0');
    }
    return { denominator, numerator };
  }
}
