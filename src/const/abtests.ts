export enum AB_TEST_NAME {
  TEST_WIDGET_SUBVARIANTS = 'TEST_WIDGET_SUBVARIANTS',
  A_B_TEST_PRICE_IMPACT_DISPLAY = 'a-b-test-price-impact-display',
  A_B_TEST_TRADE_DISPLAY = 'a-b-test-trade-display',
  A_B_TEST_FEE_CONTRIBUTION_DISPLAY = 'a-b-test-fee-contribution-display',
  DUST_CONVERSION = 'dust-conversion',
  REQUEST_REDEEM_FLOW = 'request-redeem-flow',
  PRIVATE_SWAPS = 'private-swaps',
  LIMIT_ORDERS = 'limit-orders',
  THEME_PARTNER_DEFAULT = 'theme-partner-default',
  PORTFOLIO_PNL_CHART = 'portfolio-pnl-chart',
  PORTFOLIO_TRANSACTIONS = 'portfolio-transactions',
  NOTIFICATIONS = 'notifications',
  WIDGET_ADVANCED = 'widget-advanced',
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
  [AB_TEST_NAME.DUST_CONVERSION]: {
    name: 'dust-conversion',
    enabled: true,
  },
  [AB_TEST_NAME.REQUEST_REDEEM_FLOW]: {
    name: 'request-redeem-flow',
    enabled: true,
  },
  [AB_TEST_NAME.PRIVATE_SWAPS]: {
    name: 'private-swaps',
    enabled: true,
  },
  [AB_TEST_NAME.LIMIT_ORDERS]: {
    name: 'limit-orders',
    enabled: true,
  },
  [AB_TEST_NAME.THEME_PARTNER_DEFAULT]: {
    name: 'theme-partner-default',
    enabled: true,
  },
  [AB_TEST_NAME.PORTFOLIO_PNL_CHART]: {
    name: 'portfolio-pnl-chart',
    enabled: true,
  },
  [AB_TEST_NAME.PORTFOLIO_TRANSACTIONS]: {
    name: 'portfolio-transactions',
    enabled: true,
  },
  [AB_TEST_NAME.NOTIFICATIONS]: {
    name: 'notifications',
    enabled: true,
  },
  [AB_TEST_NAME.WIDGET_ADVANCED]: {
    name: 'widget-advanced',
    enabled: true,
  },
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
