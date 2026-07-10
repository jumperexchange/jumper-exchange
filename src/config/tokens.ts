import type { WidgetTokens } from '@lifi/widget';
import { ondoDenylist } from './generated/ondoDenylist';

export const ARB_NATIVE_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';

export const tokens: WidgetTokens = {
  allow: [],
  deny: ondoDenylist,
  // Robinhood Chain (4663) meme tokens marked as verified to suppress the
  // unverified-token warning in the widget token list.
  verified: [
    { chainId: 4663, address: '0xD7321801CAae694090694Ff55A9323139F043B88' }, // JUGGERNAUT
    { chainId: 4663, address: '0x8e62F281f282686fCa6dCB39288069a93fC23F1c' }, // HOODRAT
    { chainId: 4663, address: '0x3F298f2b7306Bf9a9e7177Ca461C58c4c2FDfa4c' }, // STONKS
    { chainId: 4663, address: '0xf2915d1e3C1B0c769d0c756Ec43F1c1f6c99cD03' }, // ARROW
  ],
};
