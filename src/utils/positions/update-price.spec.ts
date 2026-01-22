import type { DefiPosition } from '@/utils/positions/type-guards';
import { describe, expect, it, vi } from 'vitest';
import { updatePositionPrice } from './update-price';

// Generated from http://localhost:3001/v1/portfolio/positions?evm=0xb29601eB52a052042FB6c68C69a442BD0AE90082 on 2025-12-10
const ASSET_FIXTURE: DefiPosition = {
  source: 'chain',
  name: 'Aave V3',
  assetUsd: 0.115107514249528,
  debtUsd: 0,
  netUsd: 0.115107514249528,
  address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
  chain: {
    chainId: 43114,
    chainKey: 'avax',
  },
  type: 'Lending',
  protocol: {
    name: 'Aave V3',
    logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
    url: 'https://app.aave.com',
  },
  supplyTokens: [
    {
      chainType: 'EVM',
      amount: '114628',
      amountUSD: 0.114628,
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      logo: 'https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png',
      address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
      chain: {
        chainId: 43114,
        chainKey: 'avax',
      },
      priceUSD: 1,
    },
  ],
  borrowTokens: [],
  assetTokens: [],
  collateralTokens: [],
  rewardTokens: [
    {
      chainType: 'EVM',
      amount: '14353125728879',
      amountUSD: 0.00020395791660737,
      name: 'Wrapped AVAX',
      symbol: 'WAVAX',
      decimals: 18,
      logo: 'https://static.debank.com/image/avax_token/logo_url/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7/753d82f0137617110f8dec56309b4065.png',
      address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
      chain: {
        chainId: 43114,
        chainKey: 'avax',
      },
      priceUSD: 14.21,
    },
    {
      chainType: 'EVM',
      amount: '19391719417341',
      amountUSD: 0.000275556332920414,
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
      logo: 'https://static.debank.com/image/project/logo_url/avax_wavax/e195cdd89f44bf3d0c65d38ce2c6c662.png',
      address: 'avax',
      chain: {
        chainId: 43114,
        chainKey: 'avax',
      },
      priceUSD: 14.21,
    },
  ],
};

describe('updatePrice', () => {
  it('should update the priceUSD and netUSD price of the position when a token price changes', async () => {
    const getTokenPrice = vi.fn().mockImplementation((token) => {
      if (
        token.address === '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' ||
        token.address === 'avax'
      ) {
        return Promise.resolve(14.21 * 2.0);
      }

      return Promise.resolve(2);
    });

    const updated = await updatePositionPrice(ASSET_FIXTURE, getTokenPrice);

    expect(updated.supplyTokens[0].priceUSD).toBeCloseTo(1 * 2.0);
    expect(updated.rewardTokens[0].priceUSD).toBeCloseTo(14.21 * 2.0);
    expect(updated.rewardTokens[1].priceUSD).toBeCloseTo(14.21 * 2.0);
    expect(updated.netUsd).toBeCloseTo(0.115107514249528 * 2.0);
    expect(updated.assetUsd).toBeCloseTo(0.115107514249528 * 2.0);
  });
});
