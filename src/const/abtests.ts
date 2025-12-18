export enum AB_TEST_NAME {
  TEST_WIDGET_SUBVARIANTS = 'TEST_WIDGET_SUBVARIANTS',
  A_B_TEST_PRICE_IMPACT_DISPLAY = 'a-b-test-price-impact-display',
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
  // Add more tests here as needed
} as const;

// Global switch for all tests
export const isAbTestingEnabled = true;

export type AbTestName = keyof typeof AbTests;

// For backward compatibility with AbTestConfig usage
export const AbTestConfig = {
  enabled: isAbTestingEnabled,
  tests: AbTests,
} as const;

export enum GlobalFeatureFlags {}
