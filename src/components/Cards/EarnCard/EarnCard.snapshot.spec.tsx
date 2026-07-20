import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../vitest.setup';

import { EarnCard } from './EarnCard';
import {
  commonArgs,
  compactPrimaryAction,
  listItemPrimaryAction,
  wethCapacityArgs,
} from './fixtures';
import { AppPaths } from 'src/const/urls';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

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
    tokens: mockedTokens,
    getToken: (chainId: number, address: string) =>
      mockedTokens.find(
        (token) => token.address === address && token.chain.chainId === chainId,
      ),
    isSuccess: true,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@jumperexchange/wallet-management', () => ({
  useAccount: () => ({
    accounts: [],
  }),
}));

// Mocked USD prices for the assets used across fixtures, keyed by address.
// Backs the useVaultCapacity USD conversion (JUM-972 QA finding #1) without
// hitting the real @lifi/sdk price endpoint in tests.
const mockedTokenPricesUSD: Record<string, string> = {
  [commonArgs.data.asset.address]: '1', // USDC
  [wethCapacityArgs.data.asset.address]: '4700', // WETH
};

vi.mock('src/hooks/useToken', () => ({
  useToken: (_chainId: number, address: string) => {
    const priceUSD = mockedTokenPricesUSD[address];
    return {
      token: priceUSD
        ? { priceUSD, hasPriceUSD: () => parseFloat(priceUSD) > 0 }
        : undefined,
      error: null,
      isError: false,
      isLoading: false,
      isSuccess: true,
      updatedAt: 0,
    };
  },
}));

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
  it('compact card with href matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        href={`${AppPaths.Earn}/${commonArgs.data.slug}`}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with two items matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        data={{
          ...commonArgs.data,
          lockupDays: undefined,
          capInDollar: undefined,
          latest: {
            date: '2021-01-01',
            tvlUsd: '',
            tvlNative: '',
            apy: {
              base: 0.0558,
              reward: 0,
              intrinsic: 0,
              total: 0.0558,
            },
          },
        }}
        variant="compact"
        primaryAction={compactPrimaryAction}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with cap in dollar matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        data={{ ...commonArgs.data, capInDollar: '1000000' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with lockup days matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        data={{ ...commonArgs.data, lockupDays: 60 }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('compact card with lockup days and cap in dollar matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="compact"
        data={{ ...commonArgs.data, lockupDays: 60, capInDollar: '1000000' }}
      />,
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
  it('list item card with href matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        href={`${AppPaths.Earn}/${commonArgs.data.slug}`}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card with cap in dollar matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        data={{ ...commonArgs.data, capInDollar: '1000000' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card with lockup days matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        data={{ ...commonArgs.data, lockupDays: 60 }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('list item card with lockup days and cap in dollar matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="list-item"
        data={{ ...commonArgs.data, lockupDays: 60, capInDollar: '1000000' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('overview card matches snapshot', async () => {
    const { container } = render(
      <EarnCard {...commonArgs} variant="overview" />,
    );
    expect(container).toMatchSnapshot();
  });
  it('overview card with loading matches snapshot', async () => {
    const { container } = render(
      <EarnCard {...commonArgs} variant="overview" isLoading />,
    );
    expect(container).toMatchSnapshot();
  });

  it('overview card with badge matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="overview"
        headerBadge={
          <Badge variant={BadgeVariant.Secondary} size={BadgeSize.SM}>
            Badge
          </Badge>
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('overview card with cap in dollar fallback matches snapshot', async () => {
    // JUM-972 QA finding #2: with no vaults.fyi capacity, the deprecated
    // capInDollar field folds into a single Max Capacity row instead of a
    // separate "Capacity" row that could double up with the new rows.
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="overview"
        data={{
          ...commonArgs.data,
          lockupDays: undefined,
          capacity: undefined,
          capInDollar: '1000000',
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('overview card with non-stable asset capacity matches snapshot', async () => {
    // JUM-972 QA finding #1: capacity must render in real USD (via the
    // asset's price), not treat native WETH units as dollars.
    const { container } = render(
      <EarnCard {...wethCapacityArgs} variant="overview" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('overview card with lockup days matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="overview"
        data={{ ...commonArgs.data, lockupDays: 60 }}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('overview card with lockup days and cap in dollar matches snapshot', async () => {
    const { container } = render(
      <EarnCard
        {...commonArgs}
        variant="overview"
        data={{ ...commonArgs.data, lockupDays: 60, capInDollar: '1000000' }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
