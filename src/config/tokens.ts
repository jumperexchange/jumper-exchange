import type { WidgetTokens } from '@jumperexchange/widget';
import { ondoDenylist } from './generated/ondoDenylist';

export const ARB_NATIVE_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';

export const tokens: WidgetTokens = {
  allow: [],
  deny: ondoDenylist,
};
