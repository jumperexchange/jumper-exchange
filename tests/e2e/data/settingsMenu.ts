export const SETTINGS_MENU = {
  BRIDGES: {
    LABEL: 'Bridges',
  },
  EXCHANGES: {
    LABEL: 'Exchanges',
  },
  GAS_PRICE: {
    FAST: 'Fast',
    LABEL: 'Gas price',
    NORMAL: 'Normal',
    SLOW: 'Slow',
  },
  RESET: {
    BUTTON: 'Reset settings',
    DIALOG_CONFIRM_BUTTON: 'Reset',
  },
  ROUTE_PRIORITY: {
    BEST_RETURN: 'Best Return',
    FASTEST: 'Fastest',
    LABEL: 'Route priority',
  },
  SLIPPAGE: {
    AUTO: 'Auto',
    CUSTOM: 'Custom',
    LABEL: 'Max. slippage',
    PRESETS: ['0.5%', '1%'],
    WARNING_MESSAGE:
      'Low slippage tolerance may cause transaction delays or failures.',
  },
  TITLE: 'Settings',
} as const;
