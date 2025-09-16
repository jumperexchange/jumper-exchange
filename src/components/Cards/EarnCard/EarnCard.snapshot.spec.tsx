import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../vitest.setup';

import { EarnCard } from './EarnCard';
import { IconButtonPrimary } from 'src/components/IconButton.style';
import BoltIcon from 'src/components/illustrations/BoltIcon';

const mockedChains = [
  {
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    name: 'Ethereum',
    chainId: 1,
  },
  {
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    name: 'Base',
    chainId: 10,
  },
  {
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    name: 'Polygon',
    chainId: 137,
  },
];

const mockedTokens = [
  {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    logo: '',
    chain: {
      chainId: 1,
      chainKey: 'ETH',
    },
  },
  {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
    logo: '',
    chain: {
      chainId: 10,
      chainKey: 'BASE',
    },
  },
  {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
    logo: '',
    chain: {
      chainId: 137,
      chainKey: 'POLYGON',
    },
  },
];

vi.mock('src/hooks/useChains', () => ({
  useChains: () => ({
    data: {
      chains: mockedChains,
    },
    getChainById: (chainId: number) =>
      mockedChains.find((chain) => chain.chainId === chainId),
    isSuccess: true,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('src/hooks/useTokens', () => ({
  useTokens: () => ({
    data: {
      tokens: mockedTokens,
    },
    getTokenByAddressAndChain: (address: string, chainId: number) =>
      mockedTokens.find(
        (token) => token.address === address && token.chain.chainId === chainId,
      ),
    isSuccess: true,
    isLoading: false,
    error: null,
  }),
}));

const commonArgs = {
  assets: {
    label: 'Assets',
    tooltip: 'The assets you will earn from',
    tokens: [
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
        logo: '',
        chain: {
          chainKey: 'ETH',
          chainId: 1,
        },
      },
      {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
        address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
        logo: '',
        chain: {
          chainId: 10,
          chainKey: 'BASE',
        },
      },
    ],
  },
  protocol: {
    name: 'Morpho',
    logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
    product: 'Metamorpho',
    version: '1.0.0',
  },
  link: {
    url: 'https://app.morpho.org',
    label: 'Explore Morpho',
  },
  recommended: true,
  tags: ['Staking', 'Earn'],
  lockupPeriod: {
    label: 'Lockup Period',
    tooltip: 'The lockup period is the time you need to lock your assets for',
    value: 1000,
    valueFormatted: '1000 months',
  },
  apy: {
    label: 'APY',
    tooltip: 'The APY is the annualized return you will receive',
    value: 1000,
    valueFormatted: '1000%',
  },
  tvl: {
    label: 'TVL',
    tooltip: 'The TVL is the total value locked in the pool',
    value: 1000,
    valueFormatted: `$${Number(1000).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  },
};

const compactPrimaryAction = (
  <IconButtonPrimary
    sx={(theme) => ({
      color: `${(theme.vars || theme).palette.white.main} !important`,
    })}
  >
    <BoltIcon />
  </IconButtonPrimary>
);

const listItemPrimaryAction = (
  <IconButtonPrimary
    sx={(theme) => ({
      color: `${(theme.vars || theme).palette.white.main} !important`,
      height: 40,
      width: 40,
    })}
  >
    <BoltIcon height={20} width={20} />
  </IconButtonPrimary>
);

describe('EarnCard snapshot', () => {
  it('compact card matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        primaryAction={compactPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with no recommendation matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        recommended={false}
        primaryAction={compactPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with single asset matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        assets={{ ...commonArgs.assets, tokens: [commonArgs.assets.tokens[0]] }}
        primaryAction={compactPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with loading matches snapshot', async () => {
    const { container } = render(
      <EarnCard {...commonArgs} variant="compact" isLoading />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        primaryAction={listItemPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card with no recommendation matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        recommended={false}
        primaryAction={listItemPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card with loading matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        isLoading
        primaryAction={listItemPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card with single asset matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        assets={{ ...commonArgs.assets, tokens: [commonArgs.assets.tokens[0]] }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
