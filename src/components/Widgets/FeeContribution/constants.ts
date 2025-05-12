// Constants for contribution amounts based on transaction volume
export const CONTRIBUTION_AMOUNTS = {
  DEFAULT: [0.5, 1, 2] as number[],
  HIGH_VOLUME: [5, 10, 15] as number[],
  MEDIUM_VOLUME: [2, 10, 15] as number[],
  LOW_VOLUME: [1, 5, 10] as number[],
} as const;

export const VOLUME_THRESHOLDS = {
  HIGH: 100000,
  MEDIUM: 10000,
  LOW: 1000,
} as const;

// Minimum USD amount required to show contribution
export const MIN_CONTRIBUTION_USD = 10;

// Percentage of users that should see the contribution (AB test)
export const CONTRIBUTION_AB_TEST_PERCENTAGE = 0.1;
