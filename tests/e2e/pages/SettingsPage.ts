import { expect } from '@playwright/test';

import type { SettingsCard } from '../data/settingsMenu';
import type { Locator, Page } from '@playwright/test';

export class SettingsPage {
  readonly backArrowButton: Locator;
  readonly bridgesList: Locator;
  readonly bridgesListFirstCheckbox: Locator;
  readonly bridgesListFirstItem: Locator;
  readonly deselectAllButton: Locator;
  readonly selectAllButton: Locator;
  readonly settingsButton: Locator;
  readonly slippageInput: Locator;

  constructor(private readonly page: Page) {
    this.settingsButton = page.getByRole('button', { name: 'Settings' });
    // TODO(app): JUM-924 — no testid on the custom-slippage input; the placeholder is the stablest anchor.
    this.slippageInput = page.getByPlaceholder('0.5');
    this.bridgesList = page.getByTestId('bridges-list');
    this.bridgesListFirstItem = this.bridgesList.getByRole('button').first();
    // MUI v9 dropped auto-testids on icon SVGs; anchor on the row's checkbox role.
    this.bridgesListFirstCheckbox = this.bridgesListFirstItem
      .getByRole('checkbox')
      .first();
    this.backArrowButton = page.getByTestId('widget-back-button');
    this.deselectAllButton = page.getByLabel('Deselect all');
    this.selectAllButton = page.locator('#select-all');
  }

  async clickGasOption(label: string): Promise<void> {
    await this.gasOption(label).click();
  }

  async clickItem(label: string): Promise<void> {
    await this.page.getByText(label, { exact: true }).click();
  }

  async clickListOption(optionTestId: string): Promise<void> {
    await this.page.getByTestId(optionTestId).click();
  }

  async clickReset(label: string): Promise<void> {
    await this.resetButton(label).click();
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

  async expectCardBadge(
    card: SettingsCard,
    color: 'info' | 'warning',
  ): Promise<void> {
    await expect(
      this.page.getByTestId(`widget-${card}-badge-${color}`),
    ).toBeVisible();
  }

  async expectCardValue(card: SettingsCard, text: string): Promise<void> {
    await expect(this.cardValue(card)).toHaveText(text);
  }

  async expectDeselectedAmount(
    card: SettingsCard,
    deselectedAmount: number,
  ): Promise<void> {
    // Poll the derived equality: after goBack() the drawer animates and the
    // fraction may flash stale text before settling.
    await expect
      .poll(async () => {
        const { denominator, numerator } = await this.readFraction(card);
        return denominator - numerator;
      })
      .toBe(deselectedAmount);
  }

  async expectFractionsEqual(card: SettingsCard): Promise<void> {
    await this.expectDeselectedAmount(card, 0);
  }

  async expectGasOptionEnabled(label: string): Promise<void> {
    await expect(this.gasOption(label)).toBeEnabled();
  }

  async expectListOptionSelected(optionTestId: string): Promise<void> {
    // The selected drill-down row renders the check icon as its only svg
    // (MUI v9 icons carry no testid).
    await expect(
      this.page.getByTestId(optionTestId).locator('svg'),
    ).toBeVisible();
  }

  async expectListOptionVisible(optionTestId: string): Promise<void> {
    await expect(this.page.getByTestId(optionTestId)).toBeVisible();
  }

  async expectNoneSelected(card: SettingsCard): Promise<void> {
    await expect
      .poll(async () => (await this.readFraction(card)).numerator)
      .toBe(0);
  }

  async expectResetButtonHidden(label: string): Promise<void> {
    await expect(this.resetButton(label)).toBeHidden();
  }

  async expectResetButtonVisible(label: string): Promise<void> {
    await expect(this.resetButton(label)).toBeVisible();
  }

  async expectSlippageWarning(message: string): Promise<void> {
    // MUI v9 dropped the icon testid; the message text is visible alongside it.
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async fillSlippage(value: string): Promise<void> {
    await this.slippageInput.fill(value);
  }

  async getFirstBridgeName(): Promise<string> {
    const name = await this.bridgesListFirstItem.textContent();
    if (!name) {
      throw new Error('First bridge row rendered without a name');
    }
    return name;
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
    await this.bridgesList.getByText(name, { exact: true }).click();
  }

  private cardValue(card: SettingsCard): Locator {
    return this.page.getByTestId(`widget-${card}-value`);
  }

  // Gas options are inline MUI tabs, not drill-down rows.
  private gasOption(label: string): Locator {
    return this.page.getByRole('tab', { exact: true, name: label });
  }

  private async readFraction(
    card: SettingsCard,
  ): Promise<{ denominator: number; numerator: number }> {
    const locator = this.cardValue(card);
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

  private resetButton(label: string): Locator {
    return this.page.getByRole('button', { exact: true, name: label });
  }
}
