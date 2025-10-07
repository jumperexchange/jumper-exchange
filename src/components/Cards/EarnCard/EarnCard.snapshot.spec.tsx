import { describe, expect, it, vi } from 'vitest';

import { render } from '../../../../vitest.setup';

import { EarnCard } from './EarnCard';
import {
  commonArgs,
  compactPrimaryAction,
  listItemPrimaryAction,
} from './fixtures';
import { AppPaths } from 'src/const/urls';

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
});
