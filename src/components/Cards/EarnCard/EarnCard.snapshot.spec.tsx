import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../vitest.setup';

import { IconButtonPrimary } from 'src/components/IconButton.style';
import BoltIcon from 'src/components/illustrations/BoltIcon';
import { EarnCard } from './EarnCard';

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
  data: {
    name: 'Moonwell Flagship USDC on base',
    asset: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040',
      chain: {
        chainId: 8453,
        chainKey: 'base',
      },
    },
    protocol: {
      name: 'morpho',
      product: 'metamorpho',
      version: '',
      logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
    },
    url: 'https://app.morpho.org',
    description:
      "Development Value - This value is used in our e2e tests workflows!!!\n\nLenders earn yield from interest paid by borrowers. Borrowers deposit collateral assets into Morpho's credit markets and borrow loans against their collateral. For detail on this vault’s curator and risk parameters, see [link](https://app.morpho.org/vault?vault=0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca&network=base).\n\nDescription from vault manager:\n\nThe Moonwell Flagship USDC Morpho vault curated by B.Protocol and Block Analitica is intended to optimize risk-adjusted interest earned from blue-chip collateral markets.\n\n[See more](https://app.morpho.org/vault?vault=0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca&network=base)",
    tags: ['Staking', 'Earn'],
    rewards: [],
    lpToken: {
      name: 'Moonwell Flagship USDC',
      symbol: 'mwUSDC',
      decimals: 18,
      address: '0xc1256Ae5FF1cf2719D4937adb3bbCCab2E00A2Ca',
      logo: 'https://moonwell.fi/_next/static/media/usdc.0f045781.svg',
      chain: {
        chainId: 8453,
        chainKey: 'base',
      },
    },
    slug: 'moonwell-flagship-usdc-on-base',
    lockupMonths: 2,
    capInDollar: '1000000000000000000',
    featured: true,
    forYou: true,
    latest: {
      date: '+057679-11-04T06:34:08.000Z',
      tvlUsd: '62572415',
      tvlNative: '62588064205976',
      apy: {
        base: 0.0558,
        reward: 0.0157,
        total: 0.07150000000000001,
      },
    },
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
        variant="compact"
        {...commonArgs}
        data={{ ...commonArgs.data, forYou: false }}
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
        data={{ ...commonArgs.data, forYou: false }}
        variant="list-item"
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
      <EarnCard {...commonArgs} variant="list-item" />,
    );
    expect(container).toMatchSnapshot();
  });
});
