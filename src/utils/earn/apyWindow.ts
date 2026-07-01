export const ApyWindowOptions = {
  SEVEN_DAY: '7d',
  THIRTY_DAY: '30d',
} as const;

export type ApyWindow = '7d' | '30d';
