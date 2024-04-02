import { ChainId } from '@lifi/sdk';
import type { WidgetConfig } from '@lifi/widget';
import {
  arb_popular_tokens,
  aurora_popular_tokens,
  avax_popular_tokens,
  base_popular_tokens,
  boba_popular_tokens,
  bsc_popular_tokens,
  ethereum_popular_tokens,
  ftm_popular_tokens,
  fuse_popular_tokens,
  glmr_popular_tokens,
  gnosis_popular_tokens,
  linea_popular_tokens,
  matic_popular_tokens,
  metis_popular_tokens,
  op_popular_tokens,
  polzk_popular_tokens,
  zksync_popular_tokens,
} from 'src/const/popularTokens';

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
    popular: [
      ...ethereum_popular_tokens,
      ...arb_popular_tokens,
      ...op_popular_tokens,
      ...matic_popular_tokens,
      ...bsc_popular_tokens,
      ...zksync_popular_tokens,
      ...polzk_popular_tokens,
      ...base_popular_tokens,
      ...avax_popular_tokens,
      ...linea_popular_tokens,
      ...gnosis_popular_tokens,
      ...ftm_popular_tokens,
      ...glmr_popular_tokens,
      ...fuse_popular_tokens,
      ...boba_popular_tokens,
      ...aurora_popular_tokens,
      ...metis_popular_tokens,
    ],
  },
};
