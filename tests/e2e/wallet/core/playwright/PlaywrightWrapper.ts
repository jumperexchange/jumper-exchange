import { EXPLICIT_PREFIXES } from '../../constants/selectorConstants';
import {
  DEFAULT_TIMEOUT,
  LONG_TIMEOUT,
} from '../../constants/timeoutConstants';

import type { Locator, Page } from '@playwright/test';

export default class PlaywrightWrapper {
  public readonly DEFAULT_TIMEOUT: number = DEFAULT_TIMEOUT;
  public readonly LONG_TIMEOUT: number = LONG_TIMEOUT;

  constructor(protected readonly page: Page) {}

  // --------------------------
  // Helper Methods
  // --------------------------

  /**
   * Clicks on an element specified by the selector.
   * @param {string} selector - The selector of the element to click.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @returns {Promise<void>}
   */
  public async click(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    console.log(
      `Clicking "${selector}"` + (index === null ? '' : ` (index ${index})`),
    );
    try {
      const element = this.getElement(selector, index);
      await element.click({ timeout });
    } catch (error: any) {
      throw new Error(
        `Failed to click "${selector}"` +
          (index === null ? '' : ` (index ${index})`) +
          ` within ${timeout}ms.\n${error.message}`,
      );
    }
  }

  /**
   * Counts the number of elements matching the selector.
   * @param {string} selector - The selector of the elements.
   * @returns {Promise<number>} - The count of matching elements.
   */
  public async countElements(selector: string): Promise<number> {
    const count = await this.getElement(selector).count();
    console.log(`Found ${count} element(s) for selector "${selector}"`);
    return count;
  }

  /**
   * Fills an input or textarea field with the provided value.
   * @param {string} selector - Input selector
   * @param {string} value - Value to fill
   * @param {number|null} [index=null] - Optional index if multiple elements match
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Timeout for the action
   * @param {boolean} [maskValue=false] - Whether to mask the value in logs (use fillSecret for wallet secrets)
   * @param {boolean} [strict=true] - Throw if the action fails
   * @returns {Promise<void>}
   */
  public async fill(
    selector: string,
    value: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    maskValue: boolean = false,
    strict: boolean = true,
  ): Promise<void> {
    const loggedValue = maskValue ? '*'.repeat(value?.length ?? 0) : value;
    console.log(
      `Filling input "${selector}"` +
        (index === null ? '' : ` (index ${index})`) +
        ` with value "${loggedValue}"`,
    );
    try {
      const element = this.getElement(selector, index);
      await element.fill(value, { timeout });
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Could not fill input "${selector}" within ${timeout}ms.\n${error.message}`,
        );
      }
    }
  }

  // Wallet secrets (seed phrase, password) must not leak into CI logs.
  public async fillSecret(
    selector: string,
    value: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = true,
  ): Promise<void> {
    return this.fill(selector, value, index, timeout, true, strict);
  }

  /**
   * Clicks on an element using Playwright's `force` option.
   * Intended for known UI overlays where the target is still the correct action surface.
   * @param {string} selector - The selector of the element to click.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be attached.
   * @returns {Promise<void>}
   */
  public async forceClick(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    console.log(
      `Force clicking "${selector}"` +
        (index === null ? '' : ` (index ${index})`),
    );
    try {
      const element = this.getElement(selector, index);
      await element.click({ force: true, timeout });
    } catch (error: any) {
      throw new Error(
        `Failed to force click "${selector}"` +
          (index === null ? '' : ` (index ${index})`) +
          ` within ${timeout}ms.\n${error.message}`,
      );
    }
  }

  /**
   * Force scrolls to the target element (even if Playwright's scrollIntoViewIfNeeded struggles).
   * @param selector - The selector of the element to scroll to
   * @param index - index of the element. Default is 0 so that
   * if there are multiple elements, we will scroll to the first.
   * @param timeout
   */
  public async forceScrollToElement(
    selector: string,
    index: number = 0,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    console.log(`Force scrolling to "${selector}" (index ${index})`);
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    await element.evaluate((el: HTMLElement) =>
      el.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      }),
    );
  }

  public async getAllTexts(
    selector: string,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<string[]> {
    console.log(`Getting all texts from "${selector}"`);
    const elements = this.getElement(selector);
    await elements.first().waitFor({ state: 'attached', timeout });
    const texts = await elements.allTextContents();
    return texts.map((t) => t.trim());
  }

  // --------------------------
  // Element Interaction Methods
  // --------------------------

  /**
   * Unified method to get an element based on the selector type.
   * @param {string} selector - The selector to find the element.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @returns Locator - The element locator.
   * @throws {Error} - If the selector is invalid.
   */
  public getElement(selector: string, index: null | number = null): Locator {
    if (typeof selector !== 'string') {
      throw new TypeError(`Invalid selector: ${selector}`);
    }
    let locator = this.isCssSelector(selector)
      ? this.page.locator(selector)
      : this.page.getByTestId(selector);
    if (index !== null && index !== undefined) {
      if (!Number.isInteger(index) || index < 0) {
        throw new Error(`Invalid index: ${index}`);
      }
      locator = locator.nth(index);
    }
    return locator;
  }

  /**
   * Gets the inner HTML of an element.
   * @param {string} selector - The selector of the element.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.LONG_TIMEOUT] - Optional timeout to wait for the element to be attached.
   * @returns {Promise<string>} - The inner HTML of the element.
   */
  public async getInnerHtml(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
  ): Promise<string> {
    console.log(
      `Getting inner HTML for "${selector}"` +
        (index === null ? '' : ` (index ${index})`),
    );
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    return await element.innerHTML();
  }

  /**
   * Gets text from an input field with retry logic.
   * @param {string} selector - The selector of the input element.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @returns {Promise<string>} - The value of the input field.
   */
  public async getInnerText(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
  ): Promise<string> {
    console.log(
      `Getting inner text for "${selector}"` +
        (index === null ? '' : ` (index ${index})`),
    );
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    return await element.innerText();
  }

  /**
   * Locates a nested element within a parent element by their testIds or actual locators.
   * @param parentSelector The locator for the parent element.
   * @param childSelector The locator for the child element.
   * @param parentIndex The nth instance of the parent element.
   * @param childIndex The nth instance of the child element.
   * @returns Locator - The locator for the child element.
   */
  public getNestedElement(
    parentSelector: string,
    childSelector: string,
    parentIndex: null | number = 0,
    childIndex: null | number = 0,
  ): Locator {
    const parent = this.getElement(parentSelector, parentIndex);
    // childSelector supports testid alias or css
    const child = this.isCssSelector(childSelector)
      ? parent.locator(childSelector)
      : parent.getByTestId(childSelector);
    return childIndex === null || childIndex === undefined
      ? child
      : child.nth(childIndex);
  }

  /**
   * Helper method to get the selector based on the type.
   * @param selector
   * @returns {string}
   */
  public getSelector(selector: string): string {
    return this.isCssSelector(selector)
      ? selector
      : `${EXPLICIT_PREFIXES.DATA_TESTID}${selector}`;
  }

  /**
   * Gets text content of elements.
   * @param {string} selector - The selector of the element(s) to get text from.
   * @param {number|null} [index=0] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @returns {Promise<string>} - Text content of the element(s).
   */
  public async getText(
    selector: string,
    index: null | number = 0,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<string> {
    console.log(`Getting text from "${selector}" (index ${index})`);
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    return ((await element.textContent()) ?? '').trim();
  }

  /**
   * Gets text from an input field.
   * @param {string} selector - The selector of the input element.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @returns {Promise<string>} - The value of the input field.
   */
  public async getTextFromInputField(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<string> {
    console.log(
      `Getting value from input field "${selector}"` +
        (index === null ? '' : ` (index ${index})`),
    );
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    return await element.inputValue();
  }

  /**
   * Gets text from an input field with retry logic.
   * @param {string} selector - The selector of the input element.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @returns {Promise<string>} - The value of the input field.
   */
  public async getTextFromInputFieldWithRetry(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<string> {
    return await this.waitForInputFieldValue(selector, index, timeout);
  }

  /**
   * Gets all text contents of elements matching the selector.
   * @param {string} selector - The selector of the elements to get text from.
   * @param index
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the first element to be attached.
   * @returns {Promise<string[]>} - An array of trimmed text contents.
   */
  public async getTextWithRetry(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
  ): Promise<string> {
    console.log(
      `Waiting for non-empty text in "${selector}"` +
        (index === null ? '' : ` (index ${index})`),
    );
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    await this.page.waitForFunction(
      (el: any) => (el.textContent ?? '').trim().length > 0,
      await this.requireElementHandle(element),
      { timeout },
    );
    const text = (await element.textContent()) ?? '';
    console.log(
      `Retrieved text from "${selector}" (length ${text.trim().length})`,
    );
    return text;
  }

  /**
   * Checks if the :before pseudo-element exists and is "visible" for an element.
   * @param {string} selector - Element selector (testId alias or CSS)
   * @param {number|null} [index=null] - Optional nth element index
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Timeout to wait for the element
   * @param {boolean} [strict=false] - Throw if the state can't be determined
   * @returns {Promise<boolean>} - True if ::before exists and is visible, false otherwise
   */
  public async hasBeforePseudoElement(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking ::before pseudo-element for selector "${selector}"`);
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'attached', timeout });
      const pseudo = await element.evaluate((el: HTMLElement) => {
        const styles = window.getComputedStyle(el, '::before');
        const toNum = (v: string) => {
          const n = parseFloat(v);
          return Number.isFinite(n) ? n : 0;
        };
        return {
          content: styles.getPropertyValue('content'), // key signal
          display: styles.getPropertyValue('display'),
          height: toNum(styles.getPropertyValue('height')),
          opacity: toNum(styles.getPropertyValue('opacity')),
          visibility: styles.getPropertyValue('visibility'),
          width: toNum(styles.getPropertyValue('width')),
        };
      });
      const hasContent =
        pseudo.content &&
        pseudo.content !== 'none' &&
        pseudo.content !== 'normal';
      const visible =
        pseudo.display !== 'none' &&
        pseudo.visibility !== 'hidden' &&
        pseudo.opacity > 0 &&
        (pseudo.width > 0 || pseudo.height > 0);
      return Boolean(hasContent && visible);
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Could not determine ::before state for "${selector}" within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Checks whether a button is enabled.
   * @param {string} selector - Button selector
   * @param {number|null} index - Optional index if multiple elements match
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Time to wait for the button to be attached
   * @param {boolean} [strict=false] - Whether to throw if the button cannot be evaluated
   * @returns {Promise<boolean>} - True if enabled, false otherwise
   */
  public async isButtonEnabled(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if button with selector "${selector}" is enabled`);
    try {
      const button = this.getElement(selector, index);
      await button.waitFor({ state: 'attached', timeout });
      return await button.isEnabled();
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Button "${selector}" was not attached or not readable within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Determines whether a selector should be treated as an explicit Playwright selector.
   *
   * Selector resolution rules:
   *
   * 1) DEFAULT (recommended)
   * Any selector that does NOT start with a known Playwright prefix
   * is treated as a `data-testid` alias.
   *
   * Examples:
   *   click('submitButton');
   *   → [data-testid="submitButton"]
   *
   *   fill('amountInput', '10');
   *   → [data-testid="amountInput"]
   *
   * 2) EXPLICIT PLAYWRIGHT SELECTORS (passed as-is)
   * If the selector starts with one of the supported prefixes below,
   * it is used directly without modification.
   *
   * Supported prefixes:
   *   css=
   *   xpath=
   *   text=
   *   role=
   *   id=
   *   data-testid=
   *   data-test-id=
   *   data-test=
   *   nth=
   *   _react=
   *
   * Examples:
   *   click('id=submitButton');
   *   click('data-testid=deploy-contracts');
   *   click('data-test=connect-wallet');
   *   click('text=Connect');
   *   click('role=button[name="Confirm"]');
   *   click('css=.btn.primary');
   *   click('xpath=//button[@type="submit"]');
   *
   * 3) XPATH SHORTCUTS
   * Selectors starting with '//' or '..' are treated as XPath selectors.
   *
   * Examples:
   *   click('//div[@role="dialog"]');
   *   click('../following-sibling::button');
   *
   * ❗ IMPORTANT:
   * Raw CSS selectors MUST NOT be used directly.
   * The following is INVALID and will throw an error:
   *
   *   '#submitButton' ❌
   *   '.btn.primary' ❌
   *   '[data-test="foo"]' ❌
   *
   * Always use explicit prefixes (id=, data-test=, css=, etc.)
   * or rely on the default data-testid behavior.
   *
   * @param {string} selector
   * @returns {boolean} True if the selector is an explicit Playwright selector
   */
  public isCssSelector(selector: string): boolean {
    if (typeof selector !== 'string') {
      return false;
    }

    // Guard against raw CSS selectors
    const isRawCss =
      selector.startsWith('#') ||
      selector.startsWith('.') ||
      selector.startsWith('[');

    if (isRawCss) {
      throw new Error(
        `Invalid selector "${selector}".\n` +
          `Do not use raw CSS selectors.\n` +
          `Use explicit prefixes (id=, data-test=, css=, etc.) ` +
          `or pass a data-testid alias.`,
      );
    }

    return this.isExplicitSelector(selector);
  }

  /**
   * Checks if an element is disabled.
   * @param {string} selector - The selector of the element to check.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @param strict
   * @returns {Promise<boolean>} - True if the element is disabled, false otherwise.
   */
  public async isDisabled(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if button with selector "${selector}" is disabled`);
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'visible', timeout });
      return await element.isDisabled();
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Element "${selector}" was not disabled within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Checks whether an element has a specific CSS class.
   * @param {string} selector - Element selector
   * @param {string} className - Class name to check for
   * @param {number|null} index - Optional index if multiple elements match
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Time to wait for the element to be attached
   * @param {boolean} [strict=false] - Whether to throw on failure
   * @returns {Promise<boolean>}
   */
  public async isElementActive(
    selector: string,
    className: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if element "${selector}" has class "${className}"`);
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'attached', timeout });
      const classAttr = await element.getAttribute('class');
      return (
        typeof classAttr === 'string' &&
        classAttr.split(/\s+/).includes(className)
      );
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Could not determine active state for "${selector}" within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Checks if an element is editable.
   * @param {string} selector - The selector of the element to check.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @param strict
   * @returns {Promise<boolean>} - True if the element is editable, false otherwise.
   */
  public async isElementEditable(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if element with selector "${selector}" is editable`);
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'visible', timeout });
      return await element.isEditable();
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Element "${selector}" was not editable within ${timeout}ms. ${error.message}`,
        );
      }
      return false;
    }
  }

  // --------------------------
  // Element State Methods
  // --------------------------

  /**
   * Checks if an element is visible.
   * @param {string} selector - The selector of the element to check.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @param strict
   * @returns {Promise<boolean>} - True if the element is visible, false otherwise.
   */
  public async isElementVisible(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if element with selector: ${selector} is visible`);
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'visible', timeout });
      return await element.isVisible();
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Element "${selector}" was not visible within ${timeout}ms. ${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Returns true if the selector is an explicit Playwright selector.
   * Uses EXPLICIT_PREFIXES from selectorConstants.
   * @param {string} selector
   * @returns {boolean}
   */
  public isExplicitSelector(selector: string): boolean {
    return (
      Object.values(EXPLICIT_PREFIXES).some((prefix) =>
        selector.startsWith(prefix),
      ) ||
      selector.startsWith('//') || // XPath
      selector.startsWith('..') // Relative XPath
    );
  }

  /**
   * Checks whether an input/textarea field is filled (non-empty).
   * @param {string} selector - Input or textarea selector
   * @param {number|null} index - Optional index if multiple elements match
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Time to wait for the element
   * @param {boolean} [strict=false] - Throw if the state cannot be determined
   * @returns {Promise<boolean>}
   */
  public async isInputFieldFilled(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if input field "${selector}" is filled`);
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'attached', timeout });
      const tagName = await element.evaluate((el: HTMLElement) =>
        el.tagName.toLowerCase(),
      );
      if (!['input', 'textarea'].includes(tagName)) {
        throw new Error(`Element is <${tagName}>, not an input or textarea`);
      }
      const value = await element.inputValue();
      return value.trim().length > 0;
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Could not determine input filled state for "${selector}" within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Checks whether the switch with the specified testId is toggled on or off.
   * @param selector - Switch root selector or checkbox selector
   * @param index
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be actionable.
   * @param strict
   * @returns {Promise<boolean>} - Returns true if the switch is toggled on, false otherwise.
   */
  public async isSwitchToggledOn(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
    strict: boolean = false,
  ): Promise<boolean> {
    console.log(`Checking if switch with selector: ${selector} is toggled on`);
    try {
      const root = this.getElement(selector, index);
      // Check if the element itself is already a checkbox
      const isCheckbox = await root.evaluate(
        (el: HTMLElement) =>
          (el as HTMLInputElement).tagName === 'INPUT' &&
          (el as HTMLInputElement).type === 'checkbox',
      );
      const checkbox = isCheckbox
        ? root
        : root.locator('input[type="checkbox"]');
      await checkbox.waitFor({ state: 'attached', timeout });
      return await checkbox.isChecked();
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Switch "${selector}" was not attached or not readable within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Presses the space key.
   * @returns {Promise<void>}
   */
  public async pressSpace(): Promise<void> {
    console.log('Pressing Space key');
    await this.page.keyboard.press('Space');
  }

  /**
   * Scrolls the element into view.
   * @param {string} selector - The selector of the element to scroll into view.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be attached.
   * @returns {Promise<void>}
   */
  public async scrollIntoView(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    console.log(
      `Scrolling "${selector}" into view` +
        (index === null ? '' : ` (index ${index})`),
    );
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    await element.scrollIntoViewIfNeeded({ timeout });
  }

  /**
   * Selects an option from a <select> element by option index.
   * @param {string} selector - The selector of the <select> element.
   * @param {number} optionIndex - The index of the <option> to select.
   * @param {number|null} [elementIndex=null] - Optional index if multiple <select> elements match.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Timeout for the action.
   * @returns {Promise<void>}
   */
  public async selectOptionByIndex(
    selector: string,
    optionIndex: number,
    elementIndex: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    console.log(
      `Selecting option index ${optionIndex} from <select> "${selector}"` +
        (elementIndex === null ? '' : ` (element index ${elementIndex})`),
    );
    const selectElement = this.getElement(selector, elementIndex);
    await selectElement.selectOption(
      { index: optionIndex },
      { timeout: timeout },
    );
  }

  /**
   * Selects an option from a <select> element by its value.
   * @param {string} selector - The selector of the <select> element
   * @param {string} value - The value of the option to select
   * @param {number|null} index - Optional index if multiple <select> elements match
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Timeout for the action
   * @returns {Promise<void>}
   */
  public async selectOptionByValue(
    selector: string,
    value: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    console.log(
      `Selecting option with value "${value}" from <select> "${selector}"`,
    );
    const selectElement = this.getElement(selector, index);
    await selectElement.selectOption({ value }, { timeout });
  }

  // --------------------------
  // Element Content Methods
  // --------------------------

  /**
   * Sets a checkbox/switch to a desired state (deterministic).
   * Works for a wrapper element containing an input[type=checkbox] OR the input itself.
   */
  public async setSwitch(
    selector: string,
    shouldBeOn: boolean,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    const root = this.getElement(selector, index);
    // If selector already points to the input, use it; otherwise find it inside
    const checkbox = (await root.evaluate(
      (el: HTMLElement) =>
        (el as HTMLInputElement).tagName === 'INPUT' &&
        (el as HTMLInputElement).type === 'checkbox',
    ))
      ? root
      : root.locator('input[type="checkbox"]');
    await checkbox.waitFor({ state: 'attached', timeout });
    try {
      await checkbox.setChecked(shouldBeOn, { timeout });
    } catch (e: any) {
      // Fallback 1: normal click (no force) + verify
      await checkbox.click({ timeout });
      const isChecked = await checkbox.isChecked();
      if (isChecked !== shouldBeOn) {
        // Fallback 2: last resort - click wrapper (sometimes label/wrapper has the handler)
        await root.click({ timeout });
        const isChecked2 = await checkbox.isChecked();
        if (isChecked2 !== shouldBeOn) {
          throw new Error(
            `Failed to set switch "${selector}" to ${shouldBeOn ? 'ON' : 'OFF'}.\nOriginal error: ${e.message}`,
          );
        }
      }
    }
  }

  /**
   * Toggles a checkbox styled as a switch by targeting the specific input element.
   * @param {string} selector - The selector of the switch element.
   * @param {number|null} [index=null] - Optional index to select a specific switch when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be actionable.
   * @returns {Promise<void>}
   */
  public async toggleSwitch(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<void> {
    const root = this.getElement(selector, index);
    const checkbox = root.locator('input[type="checkbox"]');
    await checkbox.waitFor({ state: 'attached', timeout });
    const current = await checkbox.isChecked();
    await this.setSwitch(selector, !current, index, timeout);
  }

  /**
   * Uploads a file via input[type=file] or file chooser.
   * @param {string} selector - The selector of the element to trigger the file upload.
   * @param {string|string[]} filePaths - The path(s) to the file(s) to upload.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.LONG_TIMEOUT] - Optional timeout for the upload.
   * @param {boolean} [strict=true] - Whether to throw an error if the upload fails.
   * @returns {Promise<void>}
   */
  public async uploadFile(
    selector: string,
    filePaths: string | string[],
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
    strict: boolean = true,
  ): Promise<void> {
    const filesLabel = Array.isArray(filePaths)
      ? filePaths.join(', ')
      : filePaths;
    console.log(
      `Uploading file(s) "${filesLabel}" via "${selector}"` +
        (index === null ? '' : ` (index ${index})`),
    );

    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'attached', timeout });
      const isInputFile = await element.evaluate(
        (el: HTMLElement) =>
          (el as HTMLInputElement).tagName === 'INPUT' &&
          (el as HTMLInputElement).type === 'file',
      );

      if (isInputFile) {
        await element.setInputFiles(filePaths, { timeout });
        console.log(`Files set via input[type=file] for "${selector}"`);
        return;
      }

      const fileChooserPromise = this.page.waitForEvent('filechooser', {
        timeout,
      });
      await element.click({ timeout });
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(filePaths);
      console.log(`Files set via file chooser for "${selector}"`);
    } catch (error: any) {
      console.debug(
        `Failed to upload file(s) via "${selector}". Reason: ${error.message}`,
      );
      if (strict) {
        throw new Error(
          `Could not upload file(s) via "${selector}" within ${timeout}ms.\n${error.message}`,
        );
      }
    }
  }

  /**
   * Waits for at least one element to appear, then counts all matching elements.
   * @param {string} selector - The selector of the elements.
   * @param {number} [timeout=this.LONG_TIMEOUT] - Optional timeout to wait for the first element.
   * @returns {Promise<number>} - The count of matching elements.
   */
  public async waitForAndCountElements(
    selector: string,
    timeout: number = LONG_TIMEOUT,
  ): Promise<number> {
    console.log(`Waiting for elements "${selector}" to appear before counting`);
    const elements = this.getElement(selector);
    await elements.first().waitFor({ state: 'attached', timeout });
    const count = await this.countElements(selector);
    console.log(
      `Found ${count} element(s) for selector "${selector}" after wait`,
    );
    return count;
  }

  /**
   * Waits for an element to be present in the DOM.
   * @param {string} selector - The selector of the element to wait for.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.LONG_TIMEOUT] - Optional timeout to wait for the element to be present.
   * @param {boolean} [strict=true] - Whether to throw an error if the element doesn't become present.
   * @returns {Promise<boolean>}
   */
  public async waitForElementPresentInDOM(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
    strict: boolean = true,
  ): Promise<boolean> {
    console.log(
      `Waiting for "${selector}" to be present in DOM` +
        (index === null ? '' : ` (index ${index})`),
    );

    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'attached', timeout });
      console.log(`"${selector}" is attached`);
      return true;
    } catch (error: any) {
      console.debug(
        `"${selector}" was not attached within ${timeout}ms. Reason: ${error.message}`,
      );
      if (strict) {
        throw new Error(
          `Element "${selector}" was not attached within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Waits for an element to appear, then disappear.
   * Useful for spinners/toasts that must show briefly.
   *
   * @param {string} selector
   * @param {number|null} [index=null]
   * @param {number} [appearTimeout=this.DEFAULT_TIMEOUT]
   * @param {number} [disappearTimeout=this.LONG_TIMEOUT]
   * @param {'detached'|'hidden'} [disappearState='detached']
   * @param {boolean} [strict=true]
   * @returns {Promise<boolean>}
   */
  public async waitForElementToAppearThenDisappear(
    selector: string,
    index: null | number = null,
    appearTimeout: number = DEFAULT_TIMEOUT,
    disappearTimeout: number = LONG_TIMEOUT,
    disappearState: 'detached' | 'hidden' = 'detached',
    strict: boolean = true,
  ): Promise<boolean> {
    console.log(
      `Waiting for "${selector}" to appear then disappear (disappear state: ${disappearState})` +
        (index === null ? '' : ` (index ${index})`),
    );

    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'attached', timeout: appearTimeout });
      await element.waitFor({
        state: disappearState,
        timeout: disappearTimeout,
      });
      console.log(`"${selector}" appeared then disappeared`);
      return true;
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Element "${selector}" did not appear then disappear (appear ${appearTimeout}ms, disappear ${disappearTimeout}ms).\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Waits for an element with a specified selector to become visible within the DOM.
   * @param {string} selector - The selector of the element to wait for.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.LONG_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @param {boolean} [strict=true] - Whether to throw an error if the element doesn't become visible.
   * @returns {Promise<boolean>}
   */
  public async waitForElementToBeVisible(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
    strict: boolean = true,
  ): Promise<boolean> {
    console.log(
      `Waiting for "${selector}" to be visible` +
        (index === null ? '' : ` (index ${index})`),
    );
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state: 'visible', timeout });
      console.log(`"${selector}" is visible`);
      return true;
    } catch (error: any) {
      console.debug(
        `"${selector}" did not become visible within ${timeout}ms. Reason: ${error.message}`,
      );
      if (strict) {
        throw new Error(
          `Element "${selector}" did not become visible within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Waits for an element to disappear.
   * Useful when the element may already exist, or may never appear at all.
   *
   * @param {string} selector
   * @param {number|null} [index=null]
   * @param {number} [timeout=this.LONG_TIMEOUT]
   * @param {'detached'|'hidden'} [state='detached']
   * @param {boolean} [strict=true]
   * @returns {Promise<boolean>}
   */
  public async waitForElementToDisappear(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
    state: 'detached' | 'hidden' = 'detached',
    strict: boolean = true,
  ): Promise<boolean> {
    console.log(
      `Waiting for "${selector}" to disappear (state: ${state})` +
        (index === null ? '' : ` (index ${index})`),
    );
    try {
      const element = this.getElement(selector, index);
      await element.waitFor({ state, timeout });
      console.log(`"${selector}" disappeared`);
      return true;
    } catch (error: any) {
      if (strict) {
        throw new Error(
          `Element "${selector}" did not disappear within ${timeout}ms.\n${error.message}`,
        );
      }
      return false;
    }
  }

  /**
   * Waits until an input/textarea/select has a non-empty value and returns it.
   * Throws if it doesn't happen within timeout.
   * @param {string} selector - The selector of the input field.
   * @param {number|null} [index=null] - Optional index to select a specific input field when multiple are present.
   * @param {number} [timeout=this.LONG_TIMEOUT] - Optional timeout to wait for the input field to be filled.
   * @returns {Promise<string>} - The value of the input field once it is filled.
   * @throws {Error} - If the input field is not filled within the timeout period.
   */
  public async waitForInputFieldToBeFilled(
    selector: string,
    index: null | number = null,
    timeout: number = LONG_TIMEOUT,
  ): Promise<string> {
    console.log(
      `Waiting for input field "${selector}" to be filled` +
        (index === null ? '' : ` (index ${index})`),
    );

    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });

    // Validate element type once (avoid doing it every loop)
    const tagName = await element.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase(),
    );
    if (!['input', 'select', 'textarea'].includes(tagName)) {
      throw new Error(
        `Element "${selector}" is <${tagName}>, not input/textarea/select`,
      );
    }

    // Poll in the browser context until value is non-empty
    await this.page.waitForFunction(
      (el: any) => {
        const v = (
          (el as unknown as HTMLInputElement | HTMLSelectElement).value ?? ''
        )
          .toString()
          .trim();
        return v.length > 0;
      },
      await this.requireElementHandle(element),
      { timeout },
    );

    const value =
      tagName === 'select'
        ? await element.evaluate((el) => (el as HTMLSelectElement).value)
        : await element.inputValue();

    console.log(
      `Input field "${selector}" is filled (value length ${value?.length ?? 0})`,
    );
    return value;
  }

  // --------------------------
  // Utility Methods
  // --------------------------

  /**
   * Waits until an input/textarea field has a non-empty value and returns it.
   * @param {string} selector - The selector of the input element.
   * @param {number|null} [index=null] - Optional index to select a specific element when multiple are present.
   * @param {number} [timeout=this.DEFAULT_TIMEOUT] - Optional timeout to wait for the element to be visible.
   * @returns {Promise<string>} - The value of the input field.
   */
  public async waitForInputFieldValue(
    selector: string,
    index: null | number = null,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<string> {
    console.log(`Waiting for input field "${selector}" to be filled`);
    const element = this.getElement(selector, index);
    await element.waitFor({ state: 'attached', timeout });
    await this.page.waitForFunction(
      (el: any) =>
        (el as unknown as HTMLInputElement).value &&
        (el as unknown as HTMLInputElement).value.trim().length > 0,
      await this.requireElementHandle(element),
      { timeout },
    );
    const value = await element.inputValue();
    console.log(`Input field "${selector}" value retrieved`);
    return value;
  }

  // --------------------------
  // User Input / Action Methods
  // --------------------------

  /**
   * Resolves a Locator to its ElementHandle or throws when the element no longer exists.
   */
  private async requireElementHandle(locator: Locator) {
    const handle = await locator.elementHandle();
    if (!handle) {
      throw new Error('Expected element to have a handle, but it was null.');
    }
    return handle;
  }
}
