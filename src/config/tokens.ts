import { type BaseToken } from '@lifi/sdk';
import type { AllowDeny } from '@lifi/widget';
import { ondoDenylist } from './generated/ondoDenylist';

export const ARB_NATIVE_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';

export const tokens: AllowDeny<BaseToken> = {
  allow: [],
  deny: ondoDenylist,
};
