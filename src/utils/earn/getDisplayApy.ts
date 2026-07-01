import { ApyWindowOptions, type ApyWindow } from '@/utils/earn/apyWindow';
import type {
  APYItem,
  EarnOpportunityHistoryItem,
} from '@/types/jumper-backend';

/**
 * Returns the APY item to display based on the selected window.
 * For the 30d window, returns `undefined` when apy30d is unavailable
 * (e.g. Solana/Dialect markets) so callers can render an explicit
 * "Unknown" state instead of a misleading 7d value.
 */
export function getDisplayApy(
  latest: EarnOpportunityHistoryItem | undefined,
  apyWindow: ApyWindow = ApyWindowOptions.SEVEN_DAY,
): APYItem | undefined {
  if (!latest) {
    return undefined;
  }

  if (apyWindow === ApyWindowOptions.THIRTY_DAY) {
    return latest.apy30d ?? undefined;
  }

  return latest.apy;
}
