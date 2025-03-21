// Single source of truth for all A/B tests
export const AbTests = {
  TEST_WIDGET_SUBVARIANTS: {
    name: 'test_widget_subvariants', // Name in posthog
    enabled: false,
  },
  NEW_TEST: {
    name: 'new_test',
    enabled: false,
  },
  // Add more tests here as needed
} as const;

// Global switch for all tests
export const isAbTestingEnabled = false;

export type AbTestName = keyof typeof AbTests;

// For backward compatibility with AbTestConfig usage
export const AbTestConfig = {
  enabled: isAbTestingEnabled,
  tests: AbTests,
} as const;
