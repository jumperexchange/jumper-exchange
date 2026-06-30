import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { BaseToken } from '@/types/tokens';
import { datafeed } from '@/lib/tradingview/datafeed';
import { composeTokenKey } from '@/utils/tokenKey';
import { MarketPriceSection } from './MarketPriceSection';

const ETH: BaseToken = {
  address: '0x0000000000000000000000000000000000000000',
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  type: 'base',
  chainId: 1,
  logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
};

const USDC: BaseToken = {
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  type: 'base',
  chainId: 1,
  logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
};

const meta = {
  title: 'LimitOrders/MarketPriceSection',
  component: MarketPriceSection,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MarketPriceSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tokens: [ETH, USDC],
    symbols: [
      composeTokenKey(ETH.chainId, ETH.address),
      composeTokenKey(USDC.chainId, USDC.address),
    ],
    datafeed,
  },
};
