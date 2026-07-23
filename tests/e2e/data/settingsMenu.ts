// Card keys mirror the widget's BadgedValue testId bases:
// `widget-<card>-value` / `widget-<card>-badge-{info,warning}`.
export type SettingsCard =
  | 'bridges'
  | 'exchanges'
  | 'gas-price'
  | 'route-priority'
  | 'slippage';

export const SETTINGS_MENU = {
  BRIDGES: {
    CARD: 'bridges',
    LABEL: 'Bridges',
  },
  EXCHANGES: {
    CARD: 'exchanges',
    LABEL: 'Exchanges',
  },
  GAS_PRICE: {
    CARD: 'gas-price',
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
    // Option rows are keyed by RouteSort value — "Best Return" is CHEAPEST.
    BEST_RETURN: {
      LABEL: 'Best Return',
      OPTION_ID: 'widget-route-priority-option-cheapest',
    },
    CARD: 'route-priority',
    FASTEST: {
      LABEL: 'Fastest',
      OPTION_ID: 'widget-route-priority-option-fastest',
    },
    LABEL: 'Route priority',
  },
  SLIPPAGE: {
    AUTO: { LABEL: 'Auto', OPTION_ID: 'widget-slippage-option-auto' },
    CARD: 'slippage',
    CUSTOM: { LABEL: 'Custom', OPTION_ID: 'widget-slippage-option-custom' },
    LABEL: 'Max. slippage',
    PRESET_OPTION_IDS: [
      'widget-slippage-option-0.5',
      'widget-slippage-option-1',
    ],
    WARNING_MESSAGE:
      'Low slippage tolerance may cause transaction delays or failures.',
  },
  TITLE: 'Settings',
} as const;
