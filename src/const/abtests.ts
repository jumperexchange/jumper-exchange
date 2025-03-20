export const AbTestConfig = {
  enabled: false, // Master flag to enable/disable all AB tests
  tests: {
    widgetSubvariants: {
      enabled: false, // Individual test flag
      name: 'test_widget_subvariants', // Name in posthog
    },
    // Add more tests here as needed
  },
} as const;

export const AbTestCases = {
  TEST_WIDGET_SUBVARIANTS: AbTestConfig.tests.widgetSubvariants.name,
} as const;

export type AbTestName = keyof typeof AbTestCases;
