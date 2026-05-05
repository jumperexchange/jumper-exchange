export enum AB_TEST_NAME {
  TEST_WIDGET_SUBVARIANTS = 'TEST_WIDGET_SUBVARIANTS',
  A_B_TEST_PRICE_IMPACT_DISPLAY = 'a-b-test-price-impact-display',
  A_B_TEST_TRADE_DISPLAY = 'a-b-test-trade-display',
  A_B_TEST_FEE_CONTRIBUTION_DISPLAY = 'a-b-test-fee-contribution-display',
}

// Single source of truth for all A/B tests
export const AbTests = {
  [AB_TEST_NAME.TEST_WIDGET_SUBVARIANTS]: {
    name: 'test_widget_subvariants', // Name in posthog
    enabled: false,
  },
  [AB_TEST_NAME.A_B_TEST_PRICE_IMPACT_DISPLAY]: {
    name: 'a-b-test-price-impact-display',
    enabled: true,
  },
  [AB_TEST_NAME.A_B_TEST_TRADE_DISPLAY]: {
    name: 'a-b-test-trade-display',
    enabled: true,
  },
  [AB_TEST_NAME.A_B_TEST_FEE_CONTRIBUTION_DISPLAY]: {
    name: 'a-b-test-fee-contribution-display',
    enabled: true,
  },
  // Add more tests here as needed
} as const;

// Global switch for all tests
export const isAbTestingEnabled = true;

export type AbTestName = keyof typeof AbTests;
export type AbTestFeatureKey =
  `$feature/${(typeof AbTests)[keyof typeof AbTests]['name']}`;
export type AbTestVariants = Partial<
  Record<(typeof AbTests)[keyof typeof AbTests]['name'], string | boolean>
>;

// For backward compatibility with AbTestConfig usage
export const AbTestConfig = {
  enabled: isAbTestingEnabled,
  tests: AbTests,
} as const;

export enum GlobalFeatureFlags {}
