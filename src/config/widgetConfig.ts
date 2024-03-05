import { ChainId } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';

export const widgetConfig: Partial<WidgetConfig> = {
  tokens: {
    allow: [
      // {
      //   // Wrapped SOL
      //   chainId: ChainId.SOL,
      //   address: 'So11111111111111111111111111111111111111112',
      // },
      {
        // USDC
        chainId: ChainId.SOL,
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      },
      // {
      //   // USDT
      //   chainId: ChainId.SOL,
      //   address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      // },
    ],
  },
};
