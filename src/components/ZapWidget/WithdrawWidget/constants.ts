export const WITHDRAW_FLOW_STATES = {
  IDLE: 'idle',
  SWITCHING_CHAIN: 'switching_chain',
  WAITING_FOR_TRANSACTION: 'waiting_for_transaction',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const WITHDRAW_SHEET_STATES = {
  HIDDEN: 'hidden',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export const BOTTOM_SHEET_TOP_OFFSET = 16;
export const MODAL_BOTTOM_SHEET_MIN_HEIGHT = 424;
export const ANIMATION_DURATION_SECONDS = 0.3;
export const CONTAINER_ID = 'withdraw-widget-box';

export const USD_DECIMALS = 2;
