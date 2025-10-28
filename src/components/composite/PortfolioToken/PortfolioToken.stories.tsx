import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PortfolioToken } from './PortfolioToken';

const token = {
  address: '0x0000000000000000000000000000000000000000',
  chainId: 1,
  chainName: 'Ethereum',
  chainLogoURI:
    'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
  cumulatedBalance: 2.5,
  cumulatedTotalUSD: 8625.3,
  logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  name: 'Ethereum',
  symbol: 'ETH',
  priceUSD: '3450.12',
  totalPriceUSD: 5175.18,
  chains: [
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      chainName: 'Ethereum',
      chainLogoURI:
        'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      name: 'Ethereum',
      symbol: 'ETH',
      priceUSD: '3450.12',
      cumulatedBalance: 1.5,
      cumulatedTotalUSD: 5175.18,
      totalPriceUSD: 5175.18,
      chains: [],
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      chainId: 8453,
      chainName: 'Base',
      chainLogoURI:
        'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg',
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      name: 'Ethereum',
      symbol: 'ETH',
      priceUSD: '3450.12',
      cumulatedBalance: 1.0,
      cumulatedTotalUSD: 3450.12,
      totalPriceUSD: 3450.12,
      chains: [],
    },
  ],
};

const meta: Meta<typeof PortfolioToken> = {
  title: 'Composite/PortfolioToken',
  component: PortfolioToken,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    token,
  },
};
