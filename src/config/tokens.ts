import type { WidgetTokens } from '@jumperexchange/widget';
import { ondoDenylist } from './generated/ondoDenylist';

export const ARB_NATIVE_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';

/** Native ETH sentinel used by LI.FI / @jumperexchange/widget */
export const ETH_NATIVE = '0x0000000000000000000000000000000000000000';

/** Circle USDC on Ethereum */
export const ETH_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

/** Circle USDC mint on Solana */
export const SOL_USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export const tokens: WidgetTokens = {
  allow: [],
  deny: ondoDenylist,
};
