import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

interface ItemAssertion {
  enabled?: boolean;
  invisible?: boolean;
  visible?: boolean;
}

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
    this.slippageInput = page.getByPlaceholder('Custom');
    this.bridgesList = page.getByTestId('bridges-list');
    this.bridgesListFirstItem = this.bridgesList.getByRole('button').first();
    // MUI v9 dropped auto data-testid on icon SVGs (PR #2814 bumped material
    // to ^9.0.0). Use the checkbox role on the bridge row instead.
    this.bridgesListFirstCheckbox = this.bridgesListFirstItem
      .getByRole('checkbox')
      .first();
    // TODO(app): JUM-924 — add `settings-drawer-back-button` testid; we anchor
    // on the IconButton at the start of the settings header for now.
    this.backArrowButton = page
      .locator('button.MuiIconButton-edgeStart')
      .first();
    this.deselectAllButton = page.getByLabel('Deselect all');
    this.selectAllButton = page.locator('#select-all');
    // TODO(app): JUM-924 — replace MUI badge classes with
    // `settings-badge-info` / `settings-badge-warning` testids; these classes
    // are an MUI internal contract that breaks on major bumps.
    this.badgeInfo = page.locator('span.MuiBadge-badge.MuiBadge-colorInfo');
    this.badgeWarning = page.locator(
      'span.MuiBadge-badge.MuiBadge-colorWarning',
    );
  }

  async clickItem(label: string): Promise<void> {
    await this.page.getByText(label, { exact: true }).click();
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

  // Returns the display name so the caller can re-select it by name later.
  async deselectFirstBridge(): Promise<string> {
    const bridgeName = (await this.bridgesListFirstItem.textContent()) ?? '';
    await this.bridgesListFirstCheckbox.click();
    return bridgeName;
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
    // The warning message text and its preceding icon always render together
    // in the slippage panel; asserting the message is sufficient and survives
    // the MUI v9 testid removal on the icon itself.
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectWarningBadgeVisible(): Promise<void> {
    await expect(this.badgeWarning).toBeVisible();
  }

  async fillSlippage(value: string): Promise<void> {
    await expect(this.slippageInput).toBeVisible();
    await this.slippageInput.fill(value);
  }

  async goBack(): Promise<void> {
    await this.backArrowButton.click();
  }

  async open(title: string): Promise<void> {
    await this.settingsButton.click();
    await expect(this.page.getByText(title)).toBeVisible();
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
    // WHY: settings labels appear in both buttons (clickable items) and
    // paragraphs (read-only state). Playwright's getByText matches both, so
    // we filter by tag explicitly via xpath to assert one without the other.
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
    // TODO(app): JUM-924 — expose per-category fraction testids (e.g.
    // `settings-bridges-fraction`) so we can drop this text-walk + xpath.
    // The "/" character is the only stable text marker today.
    return this.page
      .getByText(category)
      .locator('..')
      .locator('..')
      .locator('xpath=.//*[contains(text(), "/")]');
  }

  private async readFraction(
    category: string,
  ): Promise<{ denominator: number; numerator: number }> {
    const text = (await this.fractionLocator(category).textContent()) ?? '';
    const [num, den] = text.split('/');
    if (!num || !den) {
      throw new Error(`Invalid fraction format: ${text}`);
    }
    const numerator = Number(num);
    const denominator = Number(den);
    if (denominator === 0) {
      throw new Error('Denominator cannot be 0');
    }
    return { denominator, numerator };
  }
}
